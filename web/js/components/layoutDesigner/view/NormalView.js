Ext.namespace('afStudio.layoutDesigner.view');

/**
 * 
 * @class afStudio.layoutDesigner.view.NormalView
 * @extends Ext.ux.Portal
 * @author Nikolai
 */
afStudio.layoutDesigner.view.NormalView = Ext.extend(Ext.ux.Portal, {
	
	/**
	 * @cfg {Object} viewMeta
	 * View metadata
	 */
	
	/**
	 * @property {Number} viewLayout (defaults to 1)
	 * Default view layout type
	 */
	viewLayout : 1
	
	/**
	 * @property {Object} viewLayoutConfig
	 * 
	 */
	,viewLayoutConfig : {
		1 : [1],
		2 : [0.5, 0.5],
		3 : [0.25, 0.75],
		4 : [0.75, 0.25],
		5 : [0.33, 0.33,0.33],
		6 : [0.5, 0.25, 0.25],
		7 : [0.25, 0.5, 0.25],
		8 : [0.25, 0.25, 0.25, 0.25],
		9 : [0.4, 0.2, 0.2, 0.2]
	}//eo viewLayoutConfig
	
	,getViewLayout : function() {
		return this.viewMeta.attributes.layout;		
	}
	
	,getViewComponentsMetaData : function() {
		return this.viewMeta['i:component'];
	}

	/**
	 * Returns Page container of this view.
	 * <b>Attention</b> page should be <u>rendered</u> before using this method.
	 * <i>Dynamic method</i> 
	 * @return {afStudio.layoutDesigner.view.Page} page
	 */
	,getPage : function() {
		return this.findParentByType('afStudio.layoutDesigner.view.page', true);
	}//eo getPage
	
	/**
	 * Constructor
	 * @param {Object} config
	 */	
	,constructor : function(config) {		
		config.viewMeta.attributes.layout = !Ext.isDefined(config.viewMeta.attributes.layout) 
						? this.viewLayout : config.viewMeta.attributes.layout;		
		
		afStudio.layoutDesigner.view.NormalView.superclass.constructor.call(this, config);
	}
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var viewItems = this.initView();

		return {
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
		afStudio.layoutDesigner.view.NormalView.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on('afterrender', _this.initViewComponents, _this);		
	}//eo _afterInitComponent
	
	/**
	 * Initializes view
	 * @return {Object} view's layout
	 */
	,initView : function() {
		var _this = this,
		  clsMeta = this.viewLayoutConfig[this.getViewLayout()],			   
		   layout = [];	   
		
		Ext.each(clsMeta, function(cm, i, allCls){
			layout.push(_this.createViewColumn(i, cm));
		});
		return layout;
	}//eo initView
	
	/**
	 * Initializes view's components(widgets)
	 */
	,initViewComponents : function() {
		var _this = this,
		 cmpsMeta = this.getViewComponentsMetaData() || [];
		
		if (!Ext.isEmpty(cmpsMeta)) {
			Ext.each(cmpsMeta, function(cm, i, allCmps) {
				var cl = cm.attributes.column || 0;
				var w = _this.createViewComponent(cm);				
				_this.items.itemAt(cl).add(w);
			});
			
			_this.doLayout();
		}
	}//eo initViewComponents
	
	/**
	 * Creates view column 
	 * @protected 
	 * @param {Number} id The column's itemId property
	 * @param {Number} width The column's width
	 * @return {Object} column configuration
	 */
	,createViewColumn : function(id, width) {
		return {
			itemId: 'portal-column-' + id,				
			columnWidth: width,
			style: 'padding: 5px',
			defaults: {
				bodyCssClass: 'layout-designer-widget'
			}
		}
	}//eo createViewColumn
	
	/**
	 * Creates view's component
	 * @param {Object} cmpMeta The component metadata
	 * @return {Object} component(widget)
	 */
	,createViewComponent : function(cmpMeta) {
		var _this = this,
			 cmpName = cmpMeta.attributes.name,
			 cmpModule = cmpMeta.attributes.module,
			 p = _this.getPage(),
			 pTitle = p.pageMeta['i:title'];
			 
		var w = new Ext.ux.Portlet({
			componentMeta: cmpMeta,
			title: String.format('{0} / {1}', cmpModule, cmpName),
			frame: true,
			html: String.format('<br /><center>Widget {0} </center><br />', pTitle),
			tools: [{
				id: 'close', 
				handler: Ext.util.Functions.createDelegate(_this.removeWidget, _this)
			}],
			buttons: [
			{
				text: 'Preview',
				handler: Ext.util.Functions.createDelegate(_this.previewWidget, _this, [cmpName, cmpModule, cmpMeta])
			},{
				text: 'Edit',
				handler: Ext.util.Functions.createDelegate(_this.editWidget, _this, [cmpName, cmpModule, cmpMeta])
			}],
			buttonAlign: 'center'			
		});
		
		return w;
	}//eo createViewWidget
	
	,previewWidget : function(name, module, cmpMeta) {
		Ext.Msg.alert('Preview Widget', 'Under developing');
		//console.log('preview widget', name, module, cmpMeta);
	}
	
	,editWidget : function(name, module, cmpMeta) {
		Ext.Msg.alert('Edit Widget', 'Under developing');
		//console.log('edit widget', name, module, cmpMeta);
	}
	
	,removeWidget: function(e, tool, panel) {
		panel.destroy();
	}
	
});

/**
 * @type 'afStudio.layoutDesigner.view.normalView'
 */
Ext.reg('afStudio.layoutDesigner.view.normalView', afStudio.layoutDesigner.view.NormalView);