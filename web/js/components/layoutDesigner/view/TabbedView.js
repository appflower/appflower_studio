Ext.namespace('afStudio.layoutDesigner.view');

/**
 * Tabbed page view
 * 
 * @class afStudio.layoutDesigner.view.TabbedView
 * @extends afStudio.layoutDesigner.view.TabViewPanel
 * @author Nikolai
 */
afStudio.layoutDesigner.view.TabbedView = Ext.extend(afStudio.layoutDesigner.view.TabViewPanel, {
	
	/**
	 * @cfg {Object} viewMeta required
	 * View metadata.
	 */
	
	/**
	 * @property viewLayout (defaults to 1)
	 * Default view layout type.
	 * @type {Number}
	 */
	viewLayout : 1
	
	/**
	 * @cfg {Number} viewMetaPosition required (defaults to 0)
	 * This view metadata position inside the page metadata.
	 */
	,viewMetaPosition : 0
	
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

	/**
	 * Adds <tt>new empty</tt> tab metadata to the end of <tt>i:tab</tt> metadata.
	 *   
	 * @return {Number} just added empty tab position
	 */
	,addEmptyTabMetaData : function() {
		var tm = this.getViewTabsMetaData();
		
		var newTabIndex; 
		
		if (Ext.isArray(tm)) {
			newTabIndex = this.viewMeta['i:tab'].push({});
			newTabIndex--;
		} else {
			if (Ext.isDefined(tm)) {
				this.viewMeta['i:tab'] = [tm, {}];
				newTabIndex = 1;
			} else {
			//all tabs were removed/closed 
				this.viewMeta['i:tab'] = [{}];
				newTabIndex = 0;
			}
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
		if (!Ext.isDefined(config.viewMeta.attributes.layout)) {
			config.viewMeta.attributes.layout = this.viewLayout; 
		}
		
		afStudio.layoutDesigner.view.TabbedView.superclass.constructor.call(this, config);
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
		
		_this.on({
			alltabswereclosed: _this.onAllTabsWereClosed, 
			scope: _this
		});
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
		
		Ext.each(tabs, function(tm, i, allTabs) {
			layout.push(_this.createTabView(tm, i));
		});   
		
		return layout;
	}//eo initView
	
	/**
	 * Creates tab view {@link afStudio.layoutDesigner.view.NormalView}.
	 * 
	 * @param {Object} tabMeta The view's metadata
	 * @param {Number} metaPosition The view's metadata position. 
	 * @return {afStudio.layoutDesigner.view.NormalView} view
	 */
	,createTabView : function(tabMeta, metaPosition) {
		var _this = this,
			title = tabMeta.attributes.title;
		
		tabMeta.attributes.layout = this.getViewTabLayout(tabMeta);
		
		var view = new afStudio.layoutDesigner.view.NormalView({
			title: title,
			viewMeta: tabMeta,
			viewMetaPosition: metaPosition,
			closable: true
		});
		
		return view;		
	}//eo createTabView
	
	/**
	 * Updates tab's metadata and applies changes to the owner container.
	 * 
	 * @param {Object} md The new tab's meta
	 */
	,updateMetaData : function(md) {
	 	var container = this.ownerCt; //page
		
	 	//updates tab view meta
		Ext.apply(this.getViewTabMetaData(md.position), md.meta);
		
		container.updateMetaData({
			meta: this.viewMeta,
			position: this.viewMetaPosition,
			callback: md.callback			
		});
		
	}//eo updateMetaData	
	
	/**
	 * Deletes tab's metadata and applies changes to the owner container.
	 * 
	 * @param {Object} md The tab's metadata being deleted
	 */
	,deleteViewMetaData : function(md) {
	 	var container = this.ownerCt; //page		
	 	
		if (Ext.isArray(this.viewMeta['i:tab'])) {
			var tv = this.viewMeta['i:tab'];
			
			for (var i = 0, len = tv.length; i < len; i++) {
				var found = true;
				
				Ext.iterate(md.meta.attributes, function(key, value) {
					if (tv[i]['attributes'][key] != value) {
						found = false;
					}
				});
				
				if (found) {
					delete tv[i];
					break;
				}
			}
			
			var compArr = [];			
			for (var i = 0, len = tv.length; i < len; i++) {
				if (Ext.isDefined(tv[i])) {
					compArr.push(tv[i]);
				}
			}
			
			if (compArr.length > 0) {
				this.viewMeta['i:tab'] = compArr;
			} else {
				delete this.viewMeta['i:tab'];
			}
			
		} else {
			delete this.viewMeta['i:tab'];
		}
		
		container.updateMetaData(Ext.apply(md, {
			meta: this.viewMeta
		}));
	}//eo deleteViewMetaData
	
	/**
	 * Adds new Tab component to this View.
	 * 
	 * @param {String} tabTitle The tab's title
	 */
	,addTabViewComponent : function(tabTitle) {
		var _this = this;
		
		//empty tab metadata
		var newTabMeta = {
			'attributes': {
				layout: 1,
				title: tabTitle
			}
		};
		
		var tabPosition = _this.addEmptyTabMetaData();
		
		/**
		 * @param {@link afStudio.layoutDesigner.DesignerPanel} designPanel
		 * @context {@link afStudio.layoutDesigner.view.Page}
		 */
		function afterTabAdditionCallback(designPanel) {
			this.refreshPageLayout();				
			designPanel.layoutView.getContentView().setActiveTab(tabPosition);			
		}
		
		_this.updateMetaData({
			position: tabPosition,
			meta: newTabMeta,
			callback: afterTabAdditionCallback
		});		
	}//eo addTabViewComponent
	
	/**
	 * View <u>alltabswereclosed</u> event listener
	 */
	,onAllTabsWereClosed : function() {
		var pageContainer = this.ownerCt;
		
		/**
		 * @param {@link afStudio.layoutDesigner.DesignerPanel} designPanel
		 * @context {@link afStudio.layoutDesigner.view.Page}
		 */
		function afterAllTabsRemovalCallback(designPanel) {
			this.refreshPageLayout();
		}		
		
		Ext.util.Functions.createDelegate(afterAllTabsRemovalCallback, pageContainer, [pageContainer.designPanel])();
	}//eo onAllTabsWereClosed
	
});

/**
 * @type 'afStudio.layoutDesigner.view.tabbedView'
 */
Ext.reg('afStudio.layoutDesigner.view.tabbedView', afStudio.layoutDesigner.view.TabbedView);