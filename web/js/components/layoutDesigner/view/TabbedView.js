Ext.namespace('afStudio.layoutDesigner.view');

/**
 * 
 * @class afStudio.layoutDesigner.view.TabbedView
 * @extends Ext.TabPanel
 * @author Nikolai
 */
afStudio.layoutDesigner.view.TabbedView = Ext.extend(Ext.TabPanel, {
	
	/**
	 * @cfg {Object} viewMeta required
	 * View metadata
	 */
	
	/**
	 * @property {Number} viewLayout (defaults to 1)
	 * Default view layout type
	 */
	viewLayout : 1
	
	
	,getViewLayout : function() {
		return this.viewMeta.attributes.layout;		
	}
	
	/**
	 * Returns view tabs metadata
	 * @return {}
	 */
	,getViewTabsMetaData : function() {
		return this.viewMeta['i:tab'];
	}

	,getViewTabMetaData : function(tabIndex) {
		return this.getViewTabsMetaData()[tabIndex];
	}

	,getViewTabComponentsMetaData : function(tabIndex) {
		return this.getViewTabMetaData(tabIndex)['i:component'];
	}	
	
	,getViewTabLayout : function(tabMeta) {
		var tabLayout = tabMeta.attributes.layout;
		return !Ext.isDefined(tabLayout) ? this.getViewLayout() : tabLayout;
	}
	
	/**
	 * Constructor
	 * @param {Object} config
	 */	
	,constructor : function(config) {		
		//area layout attribute
		config.viewMeta.attributes.layout = !Ext.isDefined(config.viewMeta.attributes.layout) 
						? this.viewLayout : config.viewMeta.attributes.layout;		
		
		afStudio.layoutDesigner.view.NormalView.superclass.constructor.call(this, config);
	}//eo constructor
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var viewItems = this.initView();

		return {
			activeTab: 0,
			anchor: '100%',
			items: viewItems  
		}
	}//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.layoutDesigner.view.TabbedView.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;
	}//eo _afterInitComponent
	
	/**
	 * Initializes view.
	 * Creates all views tab containers.
	 * @return {Object} view's layout
	 */
	,initView : function() {
		var _this = this,
		     tabs = this.getViewTabsMetaData(),			   
		   layout = [];	   
		
		Ext.each(tabs, function(tm, i, allTabs){
			layout.push(_this.createTabView(tm));
		});   
		
		return layout;
	}//eo initView	
	
	/**
	 * Returns newly created view container.
	 * @param {Object} tabMeta The view metadata 
	 * @return {}
	 */
	,createTabView : function(tabMeta) {
		var _this = this;
		var title = tabMeta.attributes.title;
		
		tabMeta.attributes.layout = this.getViewTabLayout(tabMeta);		
		
		return new afStudio.layoutDesigner.view.NormalView({
			title: title,
			viewMeta: tabMeta
		});		
	}//eo createTabView
	
});


/**
 * @type 'afStudio.layoutDesigner.view.tabbedView'
 */
Ext.reg('afStudio.layoutDesigner.view.tabbedView', afStudio.layoutDesigner.view.TabbedView);