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
		return {
			title: 'Edit Field',
			closeAction: 'hide',
			modal: true,
			plain: true,
			width: 400,
			height: 300,
			resizable: false,
			//layout: 'fit',
			items: [
			{
				xtype: 'form',
				html: 'Rename Field window'
			}]			
		}
	}
	
	//private
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));
		afStudio.models.EditFieldWindow.superclass.initComponent.apply(this, arguments);		
	}
	
});