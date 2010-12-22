Ext.ns('afStudio.models');

/**
 * EditFieldWindow
 * @class afStudio.models.EditFieldWindow
 * @extends Ext.Window
 * @author Nikolay
 */
afStudio.models.EditFieldWindow = Ext.extend(Ext.Window, {
	
	/**
	 * @cfg {Object} fieldDefinition required
	 * Contains a edit field definition 
	 */

	/**
	 * @cfg {Number} fieldIndex required
	 * The field's index inside ColumnModel 
	 */	 
	
	/**
	 * @cfg {Ext.grid.GridView} gridView required
	 * The edit field's grid view 
	 */
	
	maskWindow : function(msg) {
		this.bwrap.mask(msg ? msg : 'loading...');	
	}
	
	,unmaskWindow : function() {
		this.bwrap.unmask();
	}
	
	/**
	 * @private 
	 * @param {Object} fDef
	 */
	,updateFieldDefinition : function(fDef) {
		var _this = this,
			  idx = _this.fieldIndex, 
			   cm = _this.gridView.cm;		   
		
		//Client side changes			
		//header
		cm.setColumnHeader(idx, fDef.name);
		//editor
		cm.config[idx].editor = afStudio.models.TypeBuilder.createEditor(
			fDef.type, 
			Ext.util.Format.trim(fDef.size), 
			fDef['default']
		);		
		//reflect changes in fieldDefinition 
		cm.config[idx].fieldDefinition.name = fDef['name'];			
		cm.config[idx].fieldDefinition.type = fDef.type;		
		cm.config[idx].fieldDefinition.size = Ext.util.Format.trim(fDef.size);
		cm.config[idx].fieldDefinition.required = fDef['required'];
		cm.config[idx].fieldDefinition['default'] = fDef['default'];			
		cm.config[idx].fieldDefinition.autoIncrement = fDef['autoIncrement'];
		cm.config[idx].fieldDefinition.key = fDef['key'];
		cm.config[idx].fieldDefinition.relation = fDef['relation'];
		cm.config[idx].fieldDefinition.onDelete = fDef['onDelete'];		
	}//eo updateFieldDefinition
	
	/**
	 * Runs Field's actions (update, create)
	 * @private
	 * @param {Object} o
	 * {
	 * 	 action - update/create
	 *   field  - field to update
	 *   fieldData - field's data
	 *   callback  - callback function to be executed
	 * }
	 */
	,doFieldAction : function(o) {		
		var _this = this,
			 grid = _this.gridView.grid,
			model = grid.model, 
		   schema = grid.schema,
		   url, xaction;
		
		switch (o.action) {
			case 'update':
				url = '/appFlowerStudio/models/';
				xaction = 'alterModelUpdateField';
			break;
			case 'create':
				url = '/appFlowerStudio/models/';
				xaction = 'alterModelCreateField';
			break;
			
		}

		_this.maskWindow();
		
		Ext.Ajax.request({
			url: url,
			params: {
				xaction: xaction,
				model: model,
				field: o.field,
				schema: schema,
				fieldDef: Ext.encode(o.fieldData)
			},
			success: function(xhr, opt) {
				var response = Ext.decode(xhr.responseText);
				_this.unmaskWindow();
				if (response.success) {
					_this.updateFieldDefinition(o.fieldData);
					Ext.isFunction(o.callback) ? o.callback() : null;
					grid.fireEvent('alterfield');
				} else {
					grid.fireEvent('alterfieldexception', xhr);
					Ext.Msg.alert('Warning', response.message);
				}
			},
			failure: function(xhr, opt) {
				_this.unmaskWindow();
				grid.fireEvent('alterfieldfailure', xhr);				
				Ext.Msg.alert('Failure', 'Status: ' + xhr.status);
			}
		});
		
	}//eo fieldAction
	
	/**
	 * Updates Field
	 * @param {Object} field The field's definition object
	 */
	,updateModelField : function(field, fData) {
		var _this = this;
		
		this.doFieldAction({
			action: 'update',
			field: field,
			fieldData: fData,
			callback: Ext.util.Functions.createDelegate((function() {
				this.closeEditFieldWindow();
			}), _this)
		});
	}
	
	/**
	 * Creates Field.
	 * @param {Object} field The field's definition object
	 */
	,createModelField : function(field) {
		var _this = this,
			   fd = _this.fieldDefinition,
			  idx = _this.fieldIndex, 
			   cm = _this.gridView.cm;
		
		this.doFieldAction({
			action: 'create',
			fieldData: field,
			callback: Ext.util.Functions.createDelegate((function() {
				//field created
				cm.config[idx].fieldDefinition.exists = true;		  		 				
				this.closeEditFieldWindow();
			}), _this)
		});
	}
	
	/**
	 * Closes this window.
	 */
	,closeEditFieldWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	}

	/**
	 * "Save" button handler.
	 * Saves field definition changes
	 */
	,saveUpdates : function() {
		var _this = this,
			   fd = _this.fieldDefinition,
			  idx = _this.fieldIndex, 
			   cm = _this.gridView.cm,
		  fExists = fd.exists,   
			   fm = _this.fieldForm.getForm();		   
		
		if (fm.isValid()) {
			var fv = fm.getFieldValues();
			
			//update
			if (fExists) {
				_this.updateModelField(fd.name, fv);
			//add
			} else {
				_this.createModelField(fv);
			}			
		}		
	}//eo saveUpdates

	/**
	 * "Cancel" button handler.
	 */
	,cancelEditing :  function() {
		this.closeEditFieldWindow();
	}

	/**
	 * Loads field definition in the "fieldForm" (ref=fieldForm)
	 */
	,loadFieldData : function() {
		var _this = this,
			   fd = _this.fieldDefinition,
			   gv = _this.gridView,
			   fm = _this.fieldForm.getForm();

		//load general fields	   
		fm.loadRecord(new Ext.data.Record(fd));
		
		//relation
		if (fd.foreignModel) {
			fm.findField('relation').setValue(fd.foreignModel + '.' + fd.foreignReference);
		}
		
		//key
		var key = '';
		if (fd.key) {
			key = fd.key;
		} else if (fd.primaryKey || fd.index || fd.index) {
			key =  fd.primaryKey ? 'primary' : (fd.index == 'unique' ? 'unique' : (fd.index ? 'index' : ''));
		}
		fm.findField('key').setValue(key);		
	}

	/**
	 * This <u>show</u> event listener
	 * Sets first active tab and loads data
	 */
	,onShowEvent : function() {
		var _this = this,
			    f = this.fieldForm;
			    
		f.getForm().reset();
		f.getComponent('fields-tab').setActiveTab(0);		
		_this.loadFieldData();
	}	
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this;		
		
		var fields = new Ext.FormPanel({
			ref: 'fieldForm',				
			baseCls: 'x-plain',
			style: 'padding: 5px',
			border: false,
			labelWidth: 100,
			defaults: {
				width: 230,
				msgTarget: 'qtip'
			},
			items: [
			{
				xtype: 'textfield',
				fieldLabel: 'Name',
				allowBlank: false,
				maskRe: /[\w]/,
				validator: function(value) {
					return /^[^\d]\w*$/im.test(value) ? true : afStudio.models.TypeBuilder.invalidFieldName;					
				},
				name: 'name'
			},{
				xtype: 'afStudio.models.typeCombo',
				fieldLabel: 'Type',
				allowBlank: false,
				name: 'type'
			},{
				xtype: 'numberfield',
				allowDecimals: false,
				allowNegative: false,
				fieldLabel: 'Size',
				name: 'size'
			},{
			// TabPanel 
				xtype: 'tabpanel',
				itemId: 'fields-tab',
				width: 336,
				height: 100,
				style: 'margin-top: 10px;',
				activeTab: 0,				
				defaults: {
					layout: 'form',
					frame: true					
				},
				items: [
				{
					title: 'Attributes',
					defaults: {
						width: 215
					},
					items: [
					{
						xtype: 'checkbox',
						fieldLabel: 'Required',
						name: 'required'
					},{
						xtype: 'textfield',
						fieldLabel: 'Default value',
						name: 'default'
					}]
				},{
					title: 'Key',
					defaults: {
						width: 215
					},					
					items: [
					{
						xtype: 'checkbox',
						fieldLabel: 'Autoincrement',
						name: 'autoIncrement'					
					},{
						xtype: 'combo',
						fieldLabel: 'Key',
						typeAhead: true,
						triggerAction: 'all',					
						editable: false,
						mode: 'local',
						valueField: 'field',
						displayField: 'field',
						store: [['primary', 'Primary'], ['index', 'Index'], ['unique', 'Unique']],
						hiddenName: 'key',
						name: 'key'
					}]	
				},{
					title: 'Relation',
					defaults: {
						width: 215
					},					
					items: [
					{
						xtype: 'relationcombo',
						relationUrl: '/appFlowerStudio/models',
						listWidth: 250,
						fieldLabel: 'Relation',
						name: 'relation'
					},{
						xtype: 'combo',
						fieldLabel: 'On Delete',
						typeAhead: true,
						triggerAction: 'all',					
						editable: false,
						mode: 'local',
						valueField: 'field',
						displayField: 'field',
						store: [['cascade', 'cascade'], ['setnull', 'setnull'], ['restrict', 'restrict'], ['none', 'none']],
						hiddenName: 'onDelete',
						name: 'onDelete'
					}]
					
				}]//eo tabs					
			},{
				xtype: 'spacer',
				height: 10
			}],
			buttons: [{
				text: 'Save',
				iconCls: 'icon-accept',
				handler: Ext.util.Functions.createDelegate(_this.saveUpdates, _this)
			},{
				text: 'Cancel',
				iconCls: 'afs-icon-cancel',
				handler: Ext.util.Functions.createDelegate(_this.cancelEditing, _this) 
			}]			
		});
		
		return {
			title: 'Edit Field',
			closeAction: 'hide',
			modal: true,
			frame: true,
			width: 360,			
			autoHeight: true,
			resizable: false,
			closable: false,
			items: [fields]			
		}
	}//eo _beforeInitComponent
	
	//private
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));
		afStudio.models.EditFieldWindow.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on({
			'show': Ext.util.Functions.createDelegate(_this.onShowEvent, _this)
		});		
	}//eo _afterInitComponent	
	
});