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
	 * @cfg {String} layout (sets to 'fit')
	 */
	layout : 'fit'
	
	/**
	 * Widget meta data object:
	 * <u>
	 *   <li><b>actionPath</b>: Path to widget's action controller.</li>
	 *   <li><b>securityPath</b>: Path to widget's security config.</li>
	 *   <li><b>widgetUri</b>: Widget URI</li>
	 *   <li><b>definition</b>: Widget's metadata definition.</li>
	 * </ul>
	 * @cfg {Object} widgetMeta
	 */	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this,
			   gf = afStudio.wd.GuiFactory;
		
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
		
		var view = gf.buildGui(this.widgetMeta);
		
		return {
			border: true,
			autoScroll: true,
			bodyStyle: 'padding: 4px;',
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
			},
			items: [
				view
			]
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
	
	/**
	 * Returns designer GUI view component.
	 * @return {Ext.Container} view
	 */
	,getDesignerView : function() {
		return this.items.itemAt(0);
	}//eo getDesignerView
	
});


/**
 * @type 'afStudio.wd.designerPanel'
 */
Ext.reg('afStudio.wd.designerPanel', afStudio.wd.DesignerPanel);