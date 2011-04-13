Ext.namespace('afStudio.wd');

/**
 * WD wrapper panel.
 * 
 * @class afStudio.wd.WidgetPanel
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.wd.WidgetPanel = Ext.extend(Ext.Panel, {
	
	/**
	 * @cfg {String} (required) actionPath
	 * Widget action path 
	 */
	
	/**
	 * @cfg {String} (required) securityPath
	 * Widget security path  
	 */
	
	/**
	 * @cfg {String} (required) widgetUri
	 * Widget URI  
	 */
		
	layout : 'fit'
	
	/**
	 * @property widgetDefinition
	 * @type {afStudio.wd.WidgetDefinition}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		
		this.widgetDefinition = new afStudio.wd.WidgetDefinition({
			widgetUri: this.widgetUri
		});
		
		return {
			title: this.widgetUri
		};
	}//eo _beforeInitComponent
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.wd.WidgetPanel.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent	
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this;
		
		this.widgetDefinition.on('datafetched', this.onWidgetDataFetched, this); 
		
		this.on({
			scope: _this,
			afterrender: _this.initWidgetPanel
		});		
	}//eo _afterInitComponent 
	
	/**
	 * Initialises widget panel after it was rendered.
	 * This widget panel <u>afterrender</u> event listener.
	 * @private
	 */
	,initWidgetPanel : function() {
		afStudio.vp.mask({region: 'center'});
		this.widgetDefinition.fetchAndConfigure();
	}//eo initWidgetPanel
	
	/**
	 * {@link #widgetDefinition} <u>datafetched</u> event listener.
	 * @param {Ext.tree.TreeNode} rootNode The root node of WI tree.
	 * @param {Object} definition The widget metadata.
	 */
	,onWidgetDataFetched : function(rootNode, definition) {		
		this.add({
			xtype: 'afStudio.wd.designerTabPanel',
			border: false,
			frame: false,
			actionPath: this.actionPath,
			securityPath: this.securityPath,
            widgetUri: this.widgetUri,
            rootNodeEl: rootNode			
		});		
		this.doLayout();
		
        var WI = afStudio.getWidgetInspector();
        WI.setRootNode(rootNode);	
        
        afStudio.vp.unmask('center');
	}//eo onWidgetDataFetched	
});