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
	 * @cfg {String} widgetMetaUrl (defaults to 'afsLayoutBuilder/getWidget')
	 */
	widgetMetaUrl : 'afsLayoutBuilder/getWidget'
	
	/**
	 * @cfg {Object} viewMeta required
	 * View metadata
	 */
	
	/**
	 * @cfg {Number} viewMetaPosition required (defaults to 0)
	 * This view metadata position inside the page metadata.
	 */
	,viewMetaPosition : 0
	
	/**
	 * @cfg {String} emptyViewMessage
	 * Holds <u>empty</u> view message.
	 */
	,emptyViewMessage : 'View has no widgets added yet, add you first widget to get started.'
	
	/**
	 * @property {Number} viewLayout (defaults to 1)
	 * Default view layout type
	 */
	,viewLayout : 1
	
	/**
	 * @property emptyView <i>Read-only</i> (defaults to true)
	 * Contains view <b>empty</b> flag. If it is <b>true</b> then the View is <u>empty</u> otherwise View contains components.
	 * @type Boolean
	 */
	,emptyView : true
	
	/**
	 * @property viewMessageBox
	 * Contains reference to view message-box.
	 * @type {afStudio.layoutDesigner.view.ViewMessageBox}
	 */
	
	/**
	 * If view's message-box is not instantiated instantiates it.
	 * Returns {@link #viewMessageBox} reference.
	 * 
	 * @param {String} message The message to show.
	 * @return {afStudio.layoutDesigner.view.ViewMessageBox} viewMessageBox
	 */
	,setViewMessageBox : function(message) {
		if (!Ext.isDefined(this.viewMessageBox)) {
			this.viewMessageBox = new afStudio.layoutDesigner.view.ViewMessageBox({
				viewContainer: this.ownerCt,
				viewMessage: message
			});	
		}
		
		return this.viewMessageBox;	
	}//eo getViewMessageBox
	
	/**
	 * Shows empty view message in view's {@link #viewMessageBox}
	 */
	,showEmptyViewMessage : function() {
		this.setViewMessageBox(this.emptyViewMessage);
		this.add(this.viewMessageBox);
	}//eo showEmptyViewMessage
	
	/**
	 * Returns view's meta <tt>layout</tt> property.
	 * @return {Number} layout type number
	 */
	,getViewLayout : function() {
		return this.viewMeta.attributes.layout;		
	}
	
	/**
	 * Returns view's components metadata.
	 * @return {Array/Object} component(s) metadata
	 */
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
		
		if (!Ext.isDefined(config.viewMeta.attributes.layout)) {
			config.viewMeta.attributes.layout = this.viewLayout;	
		}

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
		
		_this.addEvents(
			/**
			 * @event 'viewtitlechange' Fires after view's title was changed
			 * @param {afStudio.layoutDesigner.view.NormalView} view The view which title was changed
			 * @param {String} newTitle The new view's title
			 */
			'viewtitlechange'
		);
		
		_this.on({
			afterrender: 	 _this.initViewComponents,
			
			beforeclose: 	 _this.onBeforeCloseView,
			
			close:       	 _this.onCloseView,
			
			viewtitlechange: _this.onViewTitleChange,
			
			beforedrop:      _this.beforeComponentDrop,
			
			drop:            _this.dropComponent,
			
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
			vf = afStudio.layoutDesigner.view.ViewFactory,
			vLayoutType = this.getViewLayout(),
		  	clsMeta = vf.getLayoutCfg(vLayoutType),
		   	layout = [];	   
		
		Ext.each(clsMeta, function(cm, i, allCls) {
			layout.push(_this.createViewColumn(i, cm));
		});
		
		return layout;
	}//eo initView
	
	/**
	 * Initializes view's components(widgets)
	 */
	,initViewComponents : function() {
		var _this = this,
		 cmpsMeta = this.getViewComponentsMetaData();
		
		if (!Ext.isEmpty(cmpsMeta)) {			
			
			this.emptyView = false;
			
			if (Ext.isArray(cmpsMeta)) {				
				Ext.each(cmpsMeta, function(cm, i, allCmps) {					
					var cl = cm.attributes.column || 0,
						 w = _this.createViewComponent(cm, null);					
					_this.items.itemAt(cl).add(w);
				});
				
			} else {
				var cl = cmpsMeta.attributes.column || 0,
					 w = _this.createViewComponent(cmpsMeta, null);
				_this.items.itemAt(cl).add(w);
			}
			
			_this.doLayout();
		} else {			
			this.emptyView = true;
			this.showEmptyViewMessage();
		}
	}//eo initViewComponents
	
	/**
	 * Returns component's metadata index from view's components metadata array. 
	 * 
	 * @param {Object} cmpMeta The component's metadata.
	 * @param {Object} (optional) searchIn The collection we are going to search the component in 
	 * 					instead of looking into this view metadata.
	 * @return {Number} component's index on success otherwise undefined. 
	 */
	,getComponentMetaIndex : function(cmpMeta, searchIn) {
		var cm = searchIn ? searchIn : this.getViewComponentsMetaData();
		
		var index;

		for (var i = 0, len = cm.length; i < len; i++) {
			var found = true;
			Ext.iterate(cmpMeta.attributes, function(key, value) {
				if (cm[i]['attributes'][key] != value) {						
					return (found = false);
				}
			});
			
			if (found) {
				index = i;
				break;
			}
		}
		
		return index;		
	}//eo getComponentMetaIndex
	
	/**
	 * Updates view's metadata and triggers changes inside the container
	 */
	,updateViewMetaData : function(callback) {
		var container = this.ownerCt;
		
		container.updateMetaData({
			meta: this.viewMeta,
			position: this.viewMetaPosition,
			callback: callback
		});
	}//eo updateMetaData	
	
	/**
	 * Deletes view's metadata and triggers changes inside the container.
	 * Works only with Tabbed views after view was closed
	 */
	,deleteViewMetaData : function() {
		var container = this.ownerCt;
		
		//get a copy of metadata
		var metadata = Ext.apply({}, this.viewMeta);
		
		delete this.viewMeta;
		
		container.deleteViewMetaData({
			meta: metadata, 
			position: this.viewMetaPosition
		});		
	}//eo deleteViewMetaData
	
	/**
	 * Adds component's metadata to this view
	 * @param {Object} cmpMeta The component metadata
	 */
	,addViewComponentMetaData : function(cmpMeta) {
		var vc = this.viewMeta['i:component'];
		
		if (Ext.isArray(vc)) {
			vc.push(cmpMeta);			
		} else {			
			if (Ext.isDefined(vc)) { 
				this.viewMeta['i:component'] = [vc, cmpMeta];
			} else {
			    //if undefined - the view is empty
				this.viewMeta['i:component'] = cmpMeta;
			}
		}
		
		this.updateViewMetaData();
	}//eo addViewComponentMetaData
	
	/**
	 * Removes component metadata
	 * @param {Object} cmpMeta The component's meta to be removed
	 */
	,deleteViewComponentMetaData : function(cmpMeta) {
		var vc = this.viewMeta['i:component'];
		
		if (Ext.isArray(vc)) {
			var cmpIndex = this.getComponentMetaIndex(cmpMeta);
			//delete component metadata
			if (Ext.isDefined(cmpIndex)) {
				vc.splice(cmpIndex, 1);
			}
			if (vc.length == 0) {
				delete this.viewMeta['i:component'];
			}
		} else {
			delete this.viewMeta['i:component'];
		}
		
		this.updateViewMetaData();
	}//eo deleteViewComponentMetaData
	
	/**
	 * Sets view's layout type
	 * @param {Number} newLayout The new layout type
	 */
	,setLayoutMeta : function(newLayout) {
		var vc = this.viewMeta['i:component'],
			mp = afStudio.layoutDesigner.view.MetaDataProcessor,
			vf = afStudio.layoutDesigner.view.ViewFactory,
			container = this.ownerCt,
			columnMaxValue = vf.getLayoutColumnMaxValue(newLayout);
		
		//updates layout type
		this.viewMeta.attributes.layout = newLayout;
		
		//if this.viewMeta['i:component'] is undefined means that view is empty
		if (Ext.isDefined(vc)) {
		//correct components column attribute to new layout type	
			if (Ext.isArray(vc)) {
				for (var i = 0, len = vc.length; i < len; i++) {
					if (vc[i]['attributes']['column'] >= columnMaxValue) {
						vc[i]['attributes']['column'] = columnMaxValue;
					}
				}
			} else {
				if (vc['attributes']['column'] >= columnMaxValue) {
					vc['attributes']['column'] = columnMaxValue;
				}
			}
		}
		
		var idx;
		if (container.viewMeta && mp.isViewTabbed(container.viewMeta)) {
			var ai = container.getActiveTab();
			idx = container.items.indexOf(ai);
		}
		
		//scope inside callback is afStudio.layoutDesigner.view.Page
		this.updateViewMetaData(function(ld) {
			this.refreshPageLayout();
			//if tabbed
			if (idx) {
				ld.layoutView.getContentView().setActiveTab(idx);
			}
		});
	}//eo setLayoutMeta
	
	/**
	 * Adds new component(widget) into the view.
	 * 
	 * @param {Object} cmpMeta The component's metadata
	 * @param {String} title The component's title
	 */
	,addViewComponent : function(cmpMeta, title) {
		var w = this.createViewComponent(cmpMeta, title);
		
		var column = 0;		
		cmpMeta.attributes.column = column;
		this.addViewComponentMetaData(cmpMeta);
		
		if (this.emptyView) {
			this.remove(this.viewMessageBox, true);
			this.emptyView = false;
		}
		this.items.itemAt(column).add(w);
		
		this.doLayout();
	}//eo addViewComponent
	
	/**
	 * Creates view column
	 *  
	 * @protected
	 *  
	 * @param {Number} id The index part of column's itemId property 
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
	 * Creates view's component.
	 * 
	 * Each component has a custom property:
	 * <tt>componentMeta</tt> - contains metadata
	 * 
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
			componentMeta: cmpMeta, //custom property
			frame: true,
			title: String.format('{0} / {1}', cmpModule, cmpName),			
			html: String.format('<br /><center>Widget {0} </center><br />', title || pTitle),
			tools: [
			{
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
	
	/**
	 * Shows widget preview
	 * @param {String} name
	 * @param {String} module
	 * @param {Object} cmpMeta
	 */
	,previewWidget : function(name, module, cmpMeta) {		
		var widgetUri = cmpMeta.attributes.module + '/' + cmpMeta.attributes.name;
		
		afStudio.WD.previewWidget(widgetUri);
	}//eo previewWidget
	
	/**
	 * Runs WD (Widget Designer) for specified view component.
	 * 
	 * //TODO should be optimized
	 * 
	 * @param {String} name The widget action name
	 * @param {String} module The widget module name
	 * @param {} cmpMeta
	 */
	,editWidget : function(name, module, cmpMeta) {		
		afStudio.vp.mask({region: 'center'});
		
		Ext.Ajax.request({
		   url: this.widgetMetaUrl,
		   params: {
		       module_name: module,
		       action_name: name
		   },
		   success: function(xhr, opt) {		   	
			   afStudio.vp.unmask('center');
			   
			   var response = Ext.decode(xhr.responseText);
			   
			   if (response.success) {			   	
			       var actionPath = response.meta.actionPath,
			           securityPath = response.meta.securityPath,		
				       widgetUri = String.format('{0}/{1}', module, name);
				       
					   afStudio.vp.addToWorkspace({
							xtype: 'afStudio.wd.widgetPanel',
							actionPath: actionPath,
							securityPath: securityPath,
					        widgetUri: widgetUri
					   }, true);
			   } else {
			       afStudio.Msg.warning(response.content)
			   }
		   },
		   failure: function(xhr, opt) {
		   	   afStudio.vp.unmask('center');
			   var message = String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText);
			   afStudio.Msg.error('Server side error', message);
		   }
		});		
	}//eo editWidget 
	
	/**
	 * Removes component from this view. 
	 * For detailed information look at {@link Ext.Panel#tools}
	 */
	,removeWidget : function(e, tool, panel) {
		var cmpMeta = panel.componentMeta;
		this.deleteViewComponentMetaData(cmpMeta);		
		panel.destroy();
	}//eo removeWidget
	
	/**
	 * View <u>beforeclose</u> event listener.
	 * 
	 * @param {afStudio.layoutDesigner.view.NormalView} view The closing view.
	 * @param {Boolean} <tt>custom</tt> severalTabs optional Signalizes what we are going to close several views.
	 * @param {Array} <tt>custom</tt> views optional If severalTabs = true, then views contains an array of
	 * 					{@link afStudio.layoutDesigner.view.NormalView} being closed.   
	 */
	,onBeforeCloseView : Ext.emptyFn
	
	/**
	 * View <u>close</u> event listener.
	 * @param {afStudio.layoutDesigner.view.NormalView} view The being closed view
	 */
	,onCloseView : function(view) {		
		this.deleteViewMetaData();
	}//eo onCloseView
	
	/**
	 * View <u>viewtitlechange</u> event listener.
	 * @param {afStudio.layoutDesigner.view.NormalView} view The view which title was changed
	 * @param {String} newTitle The new view's title
	 */
	,onViewTitleChange : function(view, newTitle) {
		this.viewMeta.attributes.title = newTitle;
		this.updateViewMetaData();
	}//eo onViewTitleChange
	
	/**
	 * View <u>beforedrop</u> event listener.
	 * Can be used to cancel <tt>drop</tt> event.
	 * @param {Object} dropEvent For more details look at {@link Ext.ux.Portal#beforedrop}
	 */
	,beforeComponentDrop : Ext.emptyFn
	
	/**
	 * Returns column view metadata 
	 * @param {Number} columnNumber The column's index
	 * @return {Object} {component: 'contains column meta components', index: 'components indexes in view meta'} 
	 */
	,getColumnMetaData : function(columnNumber) {
		var clmMeta = {
			component: [],
			index: []
		},
		cm = this.getViewComponentsMetaData();
		
		if (Ext.isArray(cm)) {
			Ext.iterate(cm, function(item, index, allItems) {
				if ((item.attributes.column || 0) == columnNumber) {
					clmMeta.component.push(item);
					clmMeta.index.push(index);
				}
			});
			
		} else {
			if ((cm.attributes.column || 0) == columnNumber) {
				clmMeta.component.push(cm);
				clmMeta.index.push(0);
			}
		}
		
		return clmMeta;
	}//eo getColumnMetaData
	
	/**
	 * View <u>drop</u> event listener.
	 * @param {Object} dropEvent For more details look at {@link Ext.ux.Portal#beforedrop}
	 */
	,dropComponent : function(dropEvent) {
		
		var comp = dropEvent.panel,
			compMeta = comp.componentMeta,
			pos = dropEvent.position,
			columnIndex = dropEvent.columnIndex;
			
		var updateViewComponentsMeta = Ext.util.Functions.createDelegate(
			function(columnMeta) {
				for (var i = 0, len = columnMeta.index.length; i < len; i++) {
					this.viewMeta['i:component'][columnMeta.index[i]] = columnMeta.component[i];
				}
			}, this);
			
		//update component's "column" metadata 
		compMeta.attributes.column = dropEvent.columnIndex;		
		
		//update component's "position" metadata
		var columnMeta = this.getColumnMetaData(columnIndex),
			    cmpIdx = this.getComponentMetaIndex(compMeta, columnMeta.component);

		if (!Ext.isEmpty(columnMeta.component)) {
			if (cmpIdx > pos) {
				columnMeta.component.dragUp(cmpIdx, pos);
				updateViewComponentsMeta(columnMeta);				
			} else if (cmpIdx < pos) {
				columnMeta.component.dragDown(cmpIdx, pos);
				updateViewComponentsMeta(columnMeta);				
			}
		}

		this.updateViewMetaData();
	}//eo dropComponent 
});

/**
 * @type 'afStudio.layoutDesigner.view.normalView'
 */
Ext.reg('afStudio.layoutDesigner.view.normalView', afStudio.layoutDesigner.view.NormalView);