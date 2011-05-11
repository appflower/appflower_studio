Ext.namespace('afStudio.wd');

/**
 * Designer tab panel. 
 * Contains from two parts: {@link afStudio.wd.DesignerPanel} and {@link afStudio.wi.InspectorPalett}.
 * DesignerPanel is a GUI for building widget.
 * InspectorPalett is a palett of instruments dedicated for building/manipulating of widget's properties.
 * 
 * @class afStudio.wd.DesignerTab
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.wd.DesignerTab = Ext.extend(Ext.Panel, {	
	/**
	 * @cfg {String} layout
	 */
	layout : 'hbox'
	
	/**
	 * @cfg {Object} layoutConfig
	 */
	,layoutConfig : {
	    align: 'stretch',
	    pack: 'start'
	}
	
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
	 * Reference to DesignerPanel.
	 * 
	 * @property designerPanel
	 * @type {afStudio.wd.DesignerPanel}
	 */
	
	/**
	 * Reference to InspectorPalette.
	 * 
	 * @property inspectorPalette
	 * @type {afStudio.wi.InspectorPalett}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {

		return {
			title: 'Widget Designer',
			defaults: {
				layout: 'fit',
				style: 'padding: 2px;'
			},
			items: [
			{
				xtype: 'afStudio.wd.designerPanel',
				ref: 'designerPanel',
				widgetMeta: this.widgetMeta,
				flex: 3
			},{ 
				xtype: 'container',
				flex: 1,
				items: [
				{
					xtype: 'afStudio.wi.inspectorPalette',
					ref: '../inspectorPalette',
					widgetMeta: this.widgetMeta
                }]
			}]
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
		afStudio.wd.DesignerTab.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent	
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this  = this,
			gf     = afStudio.wd.GuiFactory;
		
		/**
		 * View type.
		 * @property widgetType
		 * @type {String}
		 */	
		this.widgetType  = gf.getWidgetType(this.widgetMeta);
			
		/**
		 * @property designerView
		 * @type {Ext.Container}
		 */
		this.designerView = this.designerPanel.getDesignerView();
		/**
		 * @property viewProperty
		 * @type {afStudio.wi.PropertyGrid}
		 */
		this.viewProperty = this.inspectorPalette.getPropertyGrid();
		/**
		 * @property viewInspector
		 * @type {afStudio.wi.WidgetInspectorTree}
		 */
		this.viewInspector = this.inspectorPalette.getInspectorTree();		
		
		//Save button
		this.designerPanel.getMenuItem('saveBtn').on('click', this.onSaveWidgetView, this);		
		//Preview button
		this.designerPanel.getMenuItem('previewBtn').on('click', this.onPreviewWidgetView, this);		
		
		//Relaying Events
		this.relayEvents(this.viewInspector, ['append']);
		
		//Init specific view component
		if (gf.isWidgetTypeValid(this.widgetType)) {
			this['init' + this.widgetType.ucfirst() + 'DesignerView']();
		} else {
			afStudio.Msg.error('Widget Designer', String.format('Unknown widget type <b>{0}</b>', this.widgetType));
		}
		
		_this.on({
			scope: this,
			append: this.onViewInspectorAppendProperty
		});
	}//eo _afterInitComponent
	
	/**
	 * Initializes <b>List</b> view.
	 * @private 
	 */
	,initListDesignerView : function() {
		this.relayEvents(this.designerView, ['changeColumnPosition', 'changeColumnLabel', 'deleteColumn']);		
		this.relayEvents(this.viewProperty, ['metaPropertyChange']);		

		//Add column button
		//TODO will be added in future release		
		//		this.designerPanel.getMenuItem('addColumnBtn').on('click', function() {
		//			afStudio.Msg.info('Add column click');
		//		}, this);		
		
		this.on({
			scope: this,
			changeColumnPosition: this.onListViewChangeColumnPosition,
			changeColumnLabel: this.onListViewChangeColumnLabel,
			deleteColumn: this.onListViewDeleteColumn,
			metaPropertyChange: this.onListViewMetaPropertyChange
		});
	}//eo initListDesignerView
	
	/**
	 * @private
	 */
	,initEditDesignerView : function() {		
	}//eo initEditDesignerView
	
	/**
	 * @private
	 */
	,initShowDesignerView : function() {		
	}//eo initShowDesignerView
	
	/**
	 * @private
	 */
	,initHtmlDesignerView : function() {		
	}//eo initHtmlDesignerView
	
	/**
	 * WD <i>Save button</i> <u>click</u> event listener.
	 * Saves widget view.
	 */
	,onSaveWidgetView : function() {
		var widgetUri = this.widgetMeta.widgetUri,
			widgetType = afStudio.wd.GuiFactory.getWidgetType(this.widgetMeta),		
			vi = this.viewInspector,
			viRoot = vi.getRootNode();		
		
		var viewDefinition = viRoot.dumpDataForWidgetDefinition();
		
		var wdef = new afStudio.wd.WidgetDefinition({
			widgetUri: widgetUri,
			widgetType: widgetType
		});
		wdef.saveDefinition(viewDefinition);		
	}//eo onSaveWidgetView

	/**
	 * WD <i>Preview</i> button <u>click</u> event listener.
	 * Shows widget preview.
	 */	
	,onPreviewWidgetView : function() {
		var widgetUri = this.widgetMeta.widgetUri,			
			viRootNode = this.viewInspector.getRootNode();		
		
		afApp.widgetPopup(widgetUri, viRootNode.text, null, null, afStudio);
	}//eo onPreviewWidgetView
	
	/**
	 * 
	 * @param {} vi
	 * @param {} parent
	 * @param {} node
	 * @param {} index
	 */
	,onViewInspectorAppendProperty : function(vi, parent, node, index) {
		var gf   = afStudio.wd.GuiFactory,
			vd   = this.designerView,
			vpg	 = this.viewProperty,
			vit  = this.viewInspector;
		 
		switch (this.widgetType) {
			
			case gf.LIST :			
				switch (parent.id) {
					case 'i:fields':					
						var	vCm      = vd.getColumnModel(),		
							startIdx = vd.getView().getUninitColumn(),
							endIdx   = vCm.getColumnCount(true);
						
						if (startIdx != -1) {
							vpg.setSource(node.getProperties());
							(function() {
								vit.getSelectionModel().select(node);
							}).defer(100, this);
				
							vCm.config[startIdx].uninit = false;
							vCm.config[startIdx].header = node.getProperty('label').get('value');
							vCm.config[startIdx].name   = node.getProperty('name').get('value');		
							vCm.moveColumn(startIdx, endIdx);
							vCm.setHidden(endIdx, false);
						} else {
							(function() {
								node.destroy();
								vpg.setSource([]);
							}).defer(100, this);
							afStudio.Msg.info('Widget Designer: List View', String.format('Max columns size <u>{0}</u>', vd.maxColumns));
						}
					break;
				}			
			break;			
		}	
		
	}//eo onViewInspectorAppendProperty
	
	/*------------------------------ List view ----------------------------- */
	
	/**
	 * Handles columns reordering in List view
	 * <u>changeColumnPosition</u> event listener.
	 */
	,onListViewChangeColumnPosition : function(clm, oldPos, newPos) {
		var vi 		= this.viewInspector,
			viRoot  = vi.getRootNode(),
			fn      = viRoot.getFieldsNode();
			
		if (fn && fn.findChild('text', clm.name)) {
			if (oldPos > newPos) {
				fn.childIdsOrdered.dragUp(oldPos, newPos);
			} else {
				fn.childIdsOrdered.dragDown(oldPos, newPos);
			}
		}
	}//eo onListViewChangeColumnPosition	
	
	/**
	 * Handles columns header modifications in List view.
	 * <u>changeColumnLabel</u> event listener.
	 * For detailed information look at {@link afStudio.wd.list.SimpleListView#changeColumnLabel}.
	 * @param {Ext.grid.Column} clm
	 * @param {Number} clmIndex
	 * @param {String} value
	 */
	,onListViewChangeColumnLabel : function(clm, clmIndex, value) {
		var vi = this.viewInspector,
			viRoot = vi.getRootNode(),
			fn = viRoot.getFieldsNode(),
			viClmNode;
		
		if (fn && (viClmNode = fn.findChild('text', clm.name))) {
			var lp = viClmNode.getProperty('label');
			lp.set('value', value);			
		}
	}//eo onListViewChangeColumnLabel
	
	,onListViewDeleteColumn : function(clmName) {
		var vi = this.viewInspector,
			fn = vi.getRootNode().getFieldsNode(),
			viClmNode;
		
		if (fn && (viClmNode = fn.findChild('text', clmName))) {
			fn.deleteChild(viClmNode);
		}		
	}//eo onListViewDeleteColumn
	
	/**
	 * ListView <u>metaPropertyChange</u> event listener. 
	 * @param {Ext.tree.TreeNode} node
	 * @param {String} propId
	 * @param {String} value
	 * @param {String} originalValue
	 */
	,onListViewMetaPropertyChange : function(node, propId, value, originalValue) {		
		var gf   = afStudio.wd.GuiFactory,
			vd   = this.designerView,
			vpg	 = this.viewProperty,
			vit  = this.viewInspector,
			mf   = node.attributes.metaField;
			
		if (Ext.isDefined(mf)) {			
			switch (mf) {
				//Root node
				case 'root':
					switch (propId) {
						case 'i:title':
							vd.setTitle(value);
						break;
						
						case 'i:description':
							var descCmp = vd.getTopToolbar().getComponent('desc');
							descCmp.get(0).setText(value);							
							if (Ext.util.Format.trim(value)) {
								descCmp.show();	
							} else {
								descCmp.hide();
							}
							vd.doLayout();
						break;
					}					
				break;				
				//Column node <i:column>
				case 'i:column':
					var cm = vd.getColumnModel();
					
					switch (propId) {
						case 'label':
							var nodeName = node.getProperty('name').data.value,
								clms = cm.getColumnsBy(function(c) {						
									return c.name == nodeName;
								});
							if (clms[0]) {	
								cm.setColumnHeader(cm.getIndexById(clms[0].id), value);
							}
						break;
						
						case 'name':
							var clms = cm.getColumnsBy(function(c) {						
								return c.name == originalValue;
							});
							if (clms[0]) {
								clms[0].name = value;
							}
						break;
					}
				break;
				//Fields node <i:fields>
				case 'i:fields':
					switch (propId) {
						case 'pager':
							if (value === false) {
								vd.getBottomToolbar().hide();	
							} else {
								vd.getBottomToolbar().show();
							}
							vd.doLayout();
						break;					
					}					
				break;
			}//eo switch		
		}//eo if
	}//eo onListViewMetaPropertyChange	
});

/**
 * @type 'afStudio.wd.designerTab'
 */
Ext.reg('afStudio.wd.designerTab', afStudio.wd.DesignerTab);