Ext.ns('afStudio.models');

/**
 * EditFieldWindow
 * @class afStudio.models.EditFieldWindow
 * @extends Ext.Window
 * @author Nikolay
 */
afStudio.models.EditFieldWindow = Ext.extend(Ext.Window, {
	
//A) String should have size in the 
//B) Relation should have relation picker and auto-suggestion 
//C) Select should have a set of selectable options, which means it should be possible to add selectable items to a list (just dummy code) 
//D) Currency to select what type of currency to be default

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


	/**
	 * "Save" button handler.
	 * Saves field definition updates
	 */
	saveUpdates : function() {
		var _this = this,
			   fd = _this.fieldDefinition,
			   cm = _this.gridView.cm,
			   fm = _this.fieldForm.getForm();
			   
		
		if (fm.isValid()) {
			var fv = fm.getFieldValues();
			cm.setColumnHeader(_this.fieldIndex, fv.name);
			
			_this.hide();
		}		
	}

	/**
	 * "Cancel" button handler.
	 * Closes this window
	 */
	,cancelEditing :  function() {
		this.hide();	
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
		
		if (fd.foreignModel) {
			fm.findField('relation').setValue(fd.foreignModel + '.' + fd.foreignReference);
		}		
		fm.findField('key').setValue(
			fd.primaryKey ? 'primary' : (fd.index == 'unique' ? 'unique' : (fd.index ? 'index' : ''))
		);		
//		console.log('fieldDefinition', fd);
//		console.log('gridView', gv);
//		console.log('field def. form', _this.fieldForm);
	}

	/**
	 * This <u>show</u> event listener
	 */
	,onShowEvent : function() {
		this.fieldForm.getForm().reset();
		this.loadFieldData();
	}	
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		return {
			title: 'Edit Field',
			closeAction: 'hide', //mapped to "cancelEditing"
			modal: true,
			frame: true,
			width: 360,			
			autoHeight: true,
			resizable: false,
			items: [
			{
				xtype: 'form',
				ref: 'fieldForm',				
				baseCls: 'x-plain',
				style: 'padding: 5px',
				border: false,
				labelWidth: 100,
				defaults: {
					width: 225,
					msgTarget: 'qtip'
				},
				items: [{
					xtype: 'textfield',
					fieldLabel: 'Name',
					allowBlank: false,
					name: 'name'
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
					name: 'key'
				},{
					xtype: 'afStudio.models.typeCombo',
					fieldLabel: 'Type',
					name: 'type'
				},{
					xtype: 'textfield',
					fieldLabel: 'Size',
					name: 'size'
				},{
					xtype: 'checkbox',
					fieldLabel: 'Autoincrement',
					name: 'autoIncrement'					
				},{
					xtype: 'textfield',
					fieldLabel: 'Default value',
					name: 'default'
				}, {
					xtype: 'relationcombo',
					relationUrl: '/appFlowerStudio/models',
					listWidth: 250,
					fieldLabel: 'Relation',
					name: 'relation'
				},{
					xtype: 'checkbox',
					fieldLabel: 'Required',
					name: 'required'
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
			}]			
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