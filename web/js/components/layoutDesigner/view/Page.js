Ext.namespace('afStudio.layoutDesigner.view');

/**
 * Represents Page - custom collection of Views (or Widgets). 
 * 
 * @class afStudio.layoutDesigner.view.Page
 * @extends Ext.Container
 * @author Nikolai
 */
afStudio.layoutDesigner.view.Page = Ext.extend(Ext.Container, {
	
	/**
	 * @cfg {String} layout (defaults to 'border')
	 */
	layout : 'border'	
	
	/**
	 * @cfg {Object} pageMeta required
	 * Page metadata
	 */	

	/**
	 * @property {afStudio.layoutDesigner.DesignerPanel} designPanel
	 * Designer Panel, this component wrapper
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	,_beforeInitComponent : function() {
		afStudio.vp.mask({
			msg: String.format('"{0}" view building...', this.pageMeta['i:title']), 
			region: 'center'
		});
		
		var	views = afStudio.layoutDesigner.view.ViewFactory.buildLayout(this.pageMeta);
			
		return {
			items: views
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
		afStudio.layoutDesigner.view.Page.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;
		
		afStudio.vp.unmask('center');
		
		_this.on('afterrender', _this.initPageView, _this);
	}//eo _afterInitComponent
	
	/**
	 * Page view <u>afterrender</u> event listener
	 * Executes init actions
	 */
	,initPageView : function() {
		//set designPanel property
		this.designPanel = this.ownerCt;
		
	}//eo initPageView
	
	/**
	 * Refreshes page layout
	 */
	,refreshPageLayout : function() {
		var dp = this.designPanel;
		
		dp.updateLayoutView(new afStudio.layoutDesigner.view.Page({pageMeta: this.pageMeta}));
	}//eo refreshPageLayout
	
	/**
	 * Returns page's metadata.
	 *  
	 * @return {Object} page metadata object
	 */
	,getPageMetaData : function() {
		return this.pageMeta;	
	}//eo getPageMetaData
	
	/**
	 * Returns page's <i>content</i> view container
	 * @return {afStudio.layoutDesigner.view.NormalView} view The content view container
	 */
	,getContentView : function() {
		var cv = this.find('region', 'center')[0];
		return Ext.isDefined(cv) ? cv : null;
	}//eo getContentView
	
	/**
	 * Return <i>active content</i> view container, real components(widgets) container
	 * @return {afStudio.layoutDesigner.view.NormalView} view The content view container
	 */
	,getActiveContentView : function() {
		var _this = this,
			   cv = _this.getContentView(),
			   mp = afStudio.layoutDesigner.view.MetaDataProcessor;

		if (Ext.isEmpty(cv)) {
			throw new afStudio.error.ApsError('Content view is not defined!');
		}
		
		if (mp.isViewTabbed(cv.viewMeta)) {
			cv = cv.getActiveTab();
		}
		
		return cv;
	}//eo getActiveContentView

	/**
	 * Adds view component (widget) to the active <u>content</u> view.
	 * 
	 * @param {Object} widgetMeta
	 */
	,addWidgetComponentToContentView : function(widgetMeta) {
		var cv = this.getActiveContentView();
		
		cv.addViewComponent(
			{
				attributes: {
					name: widgetMeta.widget,
					module: widgetMeta.module
				}
			}, 
			widgetMeta.meta['i:title']
		);
		
		this.doLayout();		
	}//eo addWidgetComponentToContentView
	
	/**
	 * Sets view layout type
	 * @param {Number} layout
	 */
	,setActiveContentViewLayout : function(layout) {
		var _this = this,
			   cv = this.getActiveContentView();
		
		cv.setLayoutMeta(layout);		
	}//eo setActiveContentViewLayout
	
	/**
	 * Updates {@link #pageMeta} metadata.
	 * 
	 * @param {Object} md The new "content" view metadata
	 * {
	 *    meta: view metadata,
	 *    callback: optional, function executed in this page context and accepted 
	 *              {@link afStudio.layoutDesigner.DesignerPanel} designPanel parameter
	 * }
	 */
	,updateMetaData : function(md) {
		var   mp = afStudio.layoutDesigner.view.MetaDataProcessor,
		    vIdx = mp.getContentViewMeta(this.pageMeta).contentIdx;
		
		if (Ext.isDefined(vIdx)) {
			this.pageMeta['i:area'][vIdx] = md.meta;	
		} else {
			this.pageMeta['i:area'] = md.meta;
		}

		if (Ext.isFunction(md.callback)) {
			Ext.util.Functions.createDelegate(md.callback, this, [this.designPanel])();
		}
	}//eo updateMetaData
	
});

/**
 * @type 'afStudio.layoutDesigner.view.page'
 */
Ext.reg('afStudio.layoutDesigner.view.page', afStudio.layoutDesigner.view.Page);