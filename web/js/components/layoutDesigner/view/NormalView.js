Ext.namespace('afStudio.layoutDesigner.view');

/**
 * Basic view class
 * 
 * @class afStudio.layoutDesigner.view.NormalView
 * @extends Ext.ux.Portal
 * @author Nikolai
 */
afStudio.layoutDesigner.view.NormalView = Ext.extend(Ext.ux.Portal, {
	
	/**
	 * @cfg {Object} viewMeta required
	 * View metadata
	 */
	
	/**
	 * @cfg {Number} viewMetaPosition required (defaults to 0)
	 * Metadata position
	 */
	viewMetaPosition : 0
	
	/**
	 * @property {Number} componentsNum (defaults to 0)
	 * The components number in this view
	 */
	,componentsNum : 0
	
	/**
	 * @property {Number} viewLayout (defaults to 1)
	 * Default view layout type
	 */
	,viewLayout : 1
	
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
		
		_this.on({
			afterrender:    _this.initViewComponents,
			scope: _this
		});		
				
	}//eo _afterInitComponent
	
	/**
	 * Initializes view.
	 * Creates all views containers.
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
			
			_this.componentsNum = cmpsMeta.length;
			
			Ext.each(cmpsMeta, function(cm, i, allCmps) {
				var cl = cm.attributes.column || 0,
					 w = _this.createViewComponent(cm, null, i);
					 
				_this.items.itemAt(cl).add(w);
			});
			
			_this.doLayout();
		}
	}//eo initViewComponents
	
	/**
	 * Updates view's metadata and trigger changes inside the container
	 */
	,updateViewMetaData : function() {
		var container = this.ownerCt;
		
		container.updateMetaData({
			meta: this.viewMeta, 
			position: this.viewMetaPosition
		});
	}//eo updateMetaData	
	
	/**
	 * Adds component's metadata to this view
	 * @param {Object} cmpMeta The component metadata
	 */
	,addViewComponentMetaData : function(cmpMeta) {
		var vc = this.viewMeta['i:component'];
		
		if (Ext.isArray(vc)) {
			vc.push(cmpMeta);
		} else {
			this.viewMeta['i:component'] = [vc, cmpMeta];
		}
		
		this.updateViewMetaData();
	}//eo addViewComponentMetaData
	
	,deleteViewComponentMetaData : function(cmpPosition) {
		var vc = this.viewMeta['i:component'];
		
		if (Ext.isArray(vc)) {
			delete vc[cmpPosition];
		} else {
			delete this.viewMeta['i:component'];
		}
		
		this.updateViewMetaData();
	}
	
	/**
	 * Adds new component into the view
	 * @param {Object} cmpMeta The component's metadata
	 * @param {String} title The component's title
	 */
	,addViewComponent : function(cmpMeta, title) {
		var mp = afStudio.layoutDesigner.view.MetaDataProcessor,
			 w = this.createViewComponent(cmpMeta, title, this.componentsNum);
		
		this.componentsNum++;
		
		var column = 0;
		
		cmpMeta.attributes.column = column;
		this.addViewComponentMetaData(cmpMeta);
		
		this.items.itemAt(column).add(w);
		
		this.doLayout();
	}//eo addViewComponent
	
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
	 * @param {String} title 
	 * @param {Number} position
	 * @return {Object} component(widget)
	 */
	,createViewComponent : function(cmpMeta, title, position) {
		var _this = this,
			 cmpName = cmpMeta.attributes.name,
			 cmpModule = cmpMeta.attributes.module,
			 p = _this.getPage(),
			 pTitle = p.pageMeta['i:title'];
			 
		var w = new Ext.ux.Portlet({
			componentMeta: cmpMeta,
			componentPosition: position,
			frame: true,
			title: String.format('{0} / {1}', cmpModule, cmpName),			
			html: String.format('<br /><center>Widget {0} </center><br />', title || pTitle),
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
		var cmpPos = panel.componentPosition;
		
//		this.deleteViewComponentMetaData(cmpPos);		
		panel.destroy();
	}
	
});

/**
 * @type 'afStudio.layoutDesigner.view.normalView'
 */
Ext.reg('afStudio.layoutDesigner.view.normalView', afStudio.layoutDesigner.view.NormalView);