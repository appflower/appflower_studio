Ext.namespace('afStudio.layoutDesigner.view');

/**
 * Tabbed page view
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
	
	/**
	 * Returns view's layout metadata
	 * @return {Number} 1-9 layout type number
	 */
	,getViewLayout : function() {
		return this.viewMeta.attributes.layout;		
	}
	
	/**
	 * Returns view tabs metadata
	 * @return {Object}
	 */
	,getViewTabsMetaData : function() {
		return this.viewMeta['i:tab'];
	}

	,addEmptyTabMetaData : function() {
		var tm = this.getViewTabsMetaData();
		
		var newTabIndex; 
		
		if (Ext.isArray(tm)) {
			newTabIndex = this.viewMeta['i:tab'].push({});
			newTabIndex--;
		} else {			
			this.viewMeta['i:tab'] = [tm, {}];
			newTabIndex = 1;
		}
		
		return newTabIndex;
	}//eo addEmptyTabMetaData
	
	/**
	 * Returns tab's metadata.
	 * 
	 * @param {Number} tabIndex The tab index number inside 'i:tab' metadata collection 
	 * @return {Object} tab metadata
	 */
	,getViewTabMetaData : function(tabIndex) {
		return this.getViewTabsMetaData()[tabIndex];
	}

	/**
	 * Returns components metadata for the specified tab
	 * @param {Number} tabIndex
	 * @return {Object} components metadata
	 */
	,getViewTabComponentsMetaData : function(tabIndex) {
		return this.getViewTabMetaData(tabIndex)['i:component'];
	}	
	
	/**
	 * Returns <u>content</u> tab view's layout
	 * @param {Object} tabMeta The tab metadata
	 * @return {Number} layout 
	 */
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
		config.viewMeta.attributes.layout = 
			!Ext.isDefined(config.viewMeta.attributes.layout) 
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
			layout.push(_this.createTabView(tm, i));
		});   
		
		return layout;
	}//eo initView
	
	/**
	 * Returns newly created view container.
	 * 
	 * @param {Object} tabMeta The view metadata
	 * @param {Number} metaPosition The metadata position 
	 * @return {afStudio.layoutDesigner.view.NormalView} view
	 */
	,createTabView : function(tabMeta, metaPosition) {
		var _this = this;
		var title = tabMeta.attributes.title;
		
		tabMeta.attributes.layout = this.getViewTabLayout(tabMeta);
		
		var view = new afStudio.layoutDesigner.view.NormalView({
			title: title,
			viewMeta: tabMeta,
			viewMetaPosition: metaPosition 
		});
		
		return view;		
	}//eo createTabView
	
	/**
	 * Updates tab's metadata and applies changes to the owner container
	 * 
	 * @param {Object} md The new tab's meta
	 */
	,updateMetaData : function(md) {
	 	var container = this.ownerCt;
		
		Ext.apply(this.getViewTabMetaData(md.position), md.meta);
		
		container.updateMetaData(Ext.apply(md, {
			meta: this.viewMeta
		}));
	}//eo updateMetaData	
	
	/**
	 * Adds new Tab component to this View.
	 * 
	 * @param {String} tabTitle
	 */
	,addTabViewComponent : function(tabTitle) {
		
		var newTabMeta = {
			'attributes': {
				layout: 1,
				title: tabTitle
			},
			'i:component' : []
		};
		
		var tabPosition = this.addEmptyTabMetaData();
		
		this.updateMetaData({
			position: tabPosition,
			meta: newTabMeta,
			callback : function() {
				this.refreshPageLayout();
			}
		});
		
		//tabPanel.setActiveTab(tab.getId());
		
	}//eo addTabViewComponent
});


/**
 * @type 'afStudio.layoutDesigner.view.tabbedView'
 */
Ext.reg('afStudio.layoutDesigner.view.tabbedView', afStudio.layoutDesigner.view.TabbedView);