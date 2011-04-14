Ext.namespace('afStudio.wd');

/**
 * DesignerPanel
 * Container of WD GUI part.
 * 
 * @class afStudio.wd.DesignerPanel
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.wd.DesignerPanel = Ext.extend(Ext.Panel, {
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var _this = this;
		
		var columnsMenu = {
			items: [
			{
				text: 'Columns',
				menu: {
					items: [
    				{
						xtype: 'combo', 
						triggerAction: 'all', 
						mode: 'local', 
						emptyText: 'Select an item...',
						store: [        
							[1, '1 columns'],
							[2, '2 columns'],
							[3, '3 columns'],
							[4, '4 columns']
						]
					}]
				}
			},{
				text: 'Re-size' 
			}]
		};
		
		return {
			border: true,
			autoScroll: true,
			tbar: {
				items: [
				{
					text: 'Save', 
					iconCls: 'icon-save'
//					handler: this.saveDesigner,
//					scope: this
				},'-',{
					text: 'Add Field', 
					iconCls: 'icon-add'
//					handler: this.addField,
//					scope: this
				},'-',{
					text: 'Format', 
					iconCls: 'icon-format', 
					menu: columnsMenu
				},'-',{
					text: 'Preview', 
					iconCls: 'icon-preview', 
					handler: this.preview,
					scope: this
				}]
			}			
		};
	}//eo _beforeInitComponent	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wd.DesignerPanel.superclass.initComponent.apply(this, arguments);
	}//eo initComponent	
});


/**
 * @type 'afStudio.wd.designerPanel'
 */
Ext.reg('afStudio.wd.designerPanel', afStudio.wd.DesignerPanel);