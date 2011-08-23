/**
 * WD GUI container.
 * 
 * @class afStudio.wd.DesignerPanel
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.wd.DesignerPanel = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} layout (sets to 'fit')
	 */
	layout : 'fit',
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var self = this,
			c = this.controller,
			widget = c.getView('widget');
		
		var topBarItems = [
			{
				text: 'Save',
				itemId: 'saveBtn',
				iconCls: 'icon-save',
				listeners: {
					scope: self,
					click: self.onSaveWidgetView
				}
			},'-',{
				text: 'Preview', 
				itemId: 'previewBtn',
				iconCls: 'icon-preview',
				listeners: {
					scope: self,
					click: self.onPreviewWidgetView
				}
			}
		];
		
		return {
			border: true,
			bodyStyle: 'padding: 4px;',
			tbar: {
				items: topBarItems
			},
			items: widget 
		};
	},	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wd.DesignerPanel.superclass.initComponent.apply(this, arguments);
	},	
	
	/**
	 * Returns menu item.
	 * @param {String} item The itemId property  
	 * @return {Ext.Toolbar.Item} top toolbar item
	 */
	getMenuItem : function(item) {		
		return this.getTopToolbar().getComponent(item);
	},
	
	onSaveWidgetView : function() {
		afStudio.Msg.info('save');
		
//		var valid = this.controller.getRootNode().isValid();
//		console.log('model valid', valid);
	},

	onPreviewWidgetView : function() {
		afStudio.Msg.info('preview');
//		var widgetUri = this.widgetMeta.widgetUri,
//			viRootNode = this.viewInspector.getRootNode();		
//		
//		afApp.widgetPopup(widgetUri, viRootNode.text, null, null, afStudio);			
	}
});


/**
 * @type 'wd.designerPanel'
 */
Ext.reg('wd.designerPanel', afStudio.wd.DesignerPanel);