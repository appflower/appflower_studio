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
				
		var gui = gf.buildGui(this.widgetMeta);
		
		var topBarItems = [
			{
				text: 'Save',
				itemId: 'saveBtn',
				iconCls: 'icon-save'
			},'-',{
				text: 'Preview', 
				itemId: 'previewBtn',
				iconCls: 'icon-preview' 
			}
		];		
		Ext.flatten(topBarItems.splice(2, 0, gui.controls));
		
		
		return {
			border: true,
			autoScroll: true,
			bodyStyle: 'padding: 4px;',
			tbar: new Ext.Toolbar({
				items: topBarItems
			}),
			items: [
				gui.view
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
	
	/**
	 * Returns top toolbar item.
	 * @param {String} item The itemId property  
	 * @return {Ext.Toolbar.Item} top toolbar item
	 */
	,getMenuItem : function(item) {		
		return this.getTopToolbar().getComponent(item);
	}//eo getMenuItem
});


/**
 * @type 'afStudio.wd.designerPanel'
 */
Ext.reg('afStudio.wd.designerPanel', afStudio.wd.DesignerPanel);