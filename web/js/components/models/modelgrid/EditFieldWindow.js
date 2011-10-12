Ext.ns('afStudio.models');

/**
 * EditFieldWindow
 * @class afStudio.models.EditFieldWindow
 * @extends Ext.Window
 * @author Nikolai Babinski
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
	},
	
	unmaskWindow : function() {
		this.bwrap.unmask();
	},
	
	/**
	 * @private 
	 * @param {Object} fDef
	 */
	updateFieldDefinition : function(fDef) {
		var me = this,
			idx = me.fieldIndex, 
			cm = me.gridView.cm;
		//Column model changes			
		//header
		cm.setColumnHeader(idx, fDef.name);
		//editor
		cm.config[idx].editor = afStudio.models.TypeBuilder.createEditor(
			fDef.type, 
			Ext.util.Format.trim(fDef.size), 
			fDef['default']
		);
		//renderer
		cm.config[idx].renderer = afStudio.models.TypeBuilder.createRenderer(fDef.type);
		
		me.gridView.refresh();
		
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
	},
	//eo updateFieldDefinition
	
	/**
	 * Runs Field's actions (update, create)
	 * @private
	 * @param {Object} o:
	 * <ul>
	 * {
	 *   <li><b>field</b>: {String} field to update, if field is not specified it is created</li>
	 *   <li><b>fieldData</b>: {Object} - field's data</li>
	 *   <li><b>callback</b>: {Function} - callback function to be executed</li>
	 * }
	 * </ul>
	 */
	doFieldAction : function(o) {		
		var me = this,
			grid = me.gridView.grid,
			model = grid.model, 
			schema = grid.schema,
			url, xaction;
	    
		url = afStudioWSUrls.modelListUrl;
		xaction = 'alterModelUpdateField';

		me.maskWindow();
		
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
				me.unmaskWindow();
				if (response.success) {
					me.updateFieldDefinition(o.fieldData);
					Ext.isFunction(o.callback) ? o.callback() : null;
					grid.fireEvent('alterfield');
				} else {
					grid.fireEvent('alterfieldexception', xhr);
					afStudio.Msg.warning(response.message);
				}
			},
			failure: function(xhr, opt) {
				me.unmaskWindow();
				grid.fireEvent('alterfieldfailure', xhr);				
				afStudio.Msg.error('Status: ' + xhr.status);
			}
		});
		
	},
	//eo fieldAction
	
	/**
	 * Updates Field
	 * @param {Object} field The field's definition object
	 */
	updateModelField : function(field, fData) {
		var me = this;
		
		this.doFieldAction({
			field: field,
			fieldData: fData,
			callback: Ext.util.Functions.createDelegate((function() {
				this.closeEditFieldWindow();
			}), me)
		});
	},
	
	/**
	 * Creates Field.
	 * @param {Object} field The field's definition object
	 */
	createModelField : function(field) {
		var me = this,
			fd = me.fieldDefinition,
			idx = me.fieldIndex, 
			cm = me.gridView.cm;
		
		this.doFieldAction({
			fieldData: field,
			callback: Ext.util.Functions.createDelegate((function() {
				//field created
				cm.config[idx].fieldDefinition.exists = true;		  		 				
				this.closeEditFieldWindow();
			}), me)
		});
	},
	
	/**
	 * Closes this window.
	 */
	closeEditFieldWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	},

	/**
	 * "Save" button handler.
	 * Saves field definition changes.
	 */
	saveUpdates : function() {
		var me = this,
			fd = me.fieldDefinition,
			idx = me.fieldIndex, 
			cm = me.gridView.cm,
			fExists = fd.exists,   
			fm = me.fieldForm.getForm();		   
		
		if (fm.isValid()) {
			var fv = fm.getFieldValues();
			
			//update
			if (fExists) {
			    if (fd.name != fv.name) {
                    Ext.MessageBox.confirm('Confirm', 'Field name has been changed - all data for old field will be lost. Are you sure you want to do that?', function(btn) {
                        if (btn == 'yes') me.updateModelField(fd.name, fv);
                    });
			    } else {
			        me.updateModelField(fd.name, fv);
			    }
			//add
			} else {
				me.createModelField(fv);
			}			
		}		
	},
	//eo saveUpdates

	/**
	 * "Cancel" button handler.
	 */
	cancelEditing :  function() {
		this.closeEditFieldWindow();
	},

	/**
	 * Loads field definition in the "fieldForm" (ref=fieldForm)
	 */
	loadFieldData : function() {
		var me = this,
		    fd = me.fieldDefinition,
		    gv = me.gridView,
		    fm = me.fieldForm.getForm();

		//load general fields	   
		fm.loadRecord(new Ext.data.Record(fd));
		
		//relation
		if (fd.foreignModel) {
			fm.findField('relation').setValue(fd.foreignModel + '.' + fd.foreignReference);
		}
		
		//key
		var key;
		if (fd.key) {
			key = fd.key;
		} else if (fd.primaryKey || fd.index || fd.index) {
			key =  fd.primaryKey ? 'primary' : (fd.index == 'unique' ? 'unique' : (fd.index ? 'index' : ''));
		}
		fm.findField('key').setValue(key);
	},
	//eo loadFieldData

	/**
	 * Resets the fields, sets first active tab and loads data.
	 * <u>show</u> event listener
	 */
	onShowEvent : function() {
		var f = this.fieldForm,
			tab = f.getComponent('fields-tab');
			    
		f.getForm().reset();
		
		var fields = tab.findByType('field');
		Ext.each(fields, function(f){
			f.setValue('');
		});
		
		tab.setActiveTab(0);
		
		this.loadFieldData();
	},	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	_beforeInitComponent : function() {
		var me = this;		
		
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
						store: [['', 'None'],['primary', 'Primary'], ['index', 'Index'], ['unique', 'Unique']],
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
						relationUrl: afStudioWSUrls.modelListUrl,
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
				}]					
			},{
				xtype: 'spacer',
				height: 10
			}],
			buttons: [
			{
				text: 'Save',
				iconCls: 'icon-accept',
				scope: this,
				handler: this.saveUpdates
			},{
				text: 'Cancel',
				iconCls: 'afs-icon-cancel',
				scope: this,
				handler: this.cancelEditing 
			}]			
		});
		
		return {
			title: 'Edit Field',
			modal: true,
			frame: true,
			width: 360,			
			autoHeight: true,
			resizable: false,
			closeAction: 'hide',
			closable: false,
			items: [fields]			
		}
	},
	//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.applyIf(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.models.EditFieldWindow.superclass.initComponent.apply(this, arguments);
		
		this._afterInitComponent();
	},
	
	/**
	 * @private
	 */
	_afterInitComponent : function() {
		var me = this;
		
		me.on({
			scope: this,
			
			show: this.onShowEvent
		});
	}	
});