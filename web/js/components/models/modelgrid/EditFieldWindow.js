Ext.ns('afStudio.models');

/**
 * EditFieldWindow
 * @class afStudio.models.EditFieldWindow
 * @extends Ext.Window
 * @author Nikolay
 */
afStudio.models.EditFieldWindow = Ext.extend(Ext.Window, {
	
//1) option"Rename Field" and make "edit field" open popup window. Which contains the field type (if of time, checkbox, password and so forth) and then specific settings for that field type. So for relation you could add place to add the relation like you did in editing <model> 
//dit Field options 
//
//A) String should have size in the 
//B) Relation should have relation picker and auto-suggestion 
//C) Select should have a set of selectable options, which means it should be possible to add selectable items to a list (just dummy code) 
//D) Currency to select what type of currency to be default 
//
//And maybe all field types has the default value visible in the popup as well.. 	
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 */
	_beforeInitComponent : function() {
		var _this = this,
			   fd = _this.fieldDefinition;
		
		//console.log('fieldDefinition', _this.fieldDefinition);	   
			   
		return {
			title: 'Edit Field',
			closeAction: 'hide',
			modal: true,
			frame: true,
			width: 360,
			height: 310,
			resizable: false,
			layout: 'fit',
			items: [
			{
				xtype: 'form',
				baseCls: 'x-plain',
				style: 'padding: 5px',
				border: false,
				labelWidth: 100,
				defaults: {
					width: 225
				},
				items: [{
					xtype: 'textfield',
					fieldLabel: 'Name',
					name: 'name'
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
					text: 'Save'
				},{
					text: 'Cancel'
				}]
			}]			
		}
	}
	
	//private
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));
		afStudio.models.EditFieldWindow.superclass.initComponent.apply(this, arguments);		
	}
	
});