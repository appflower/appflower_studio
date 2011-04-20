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
		var _this = this;
		
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
		
		this.relayEvents(this.designerView, ['changeColumnPosition']);
		
		
		_this.on({
			scope: this,			
			changeColumnPosition: this.onListViewChangeColumnPosition,
			afterrender: function() {
			}
		})
	}//eo _afterInitComponent
	
	/**
	 * Handles columns reordering in List view
	 * <u>changeColumnPosition</u> event listener.
	 */
	,onListViewChangeColumnPosition : function(clm, oldPos, newPos) {
		
		var widgetUri = this.widgetMeta.widgetUri,
			widgetType = afStudio.wd.GuiFactory.getWidgetType(this.widgetMeta),
			vi = this.viewInspector,
			viRoot = vi.getRootNode(),
			fn = viRoot.getFieldsNode();
		
		
		if (fn && fn.findChild('text', clm.name)) {
			if (oldPos > newPos) {
				fn.childIdsOrdered.dragUp(oldPos, newPos);
			} else {
				fn.childIdsOrdered.dragDown(oldPos, newPos);
			}
		}
		
		//TODO move to "save" button handler
		var definition = viRoot.dumpDataForWidgetDefinition();	
		
		var wdef = new afStudio.wd.WidgetDefinition({
			widgetUri: widgetUri,
			widgetType: widgetType
		});
		wdef.saveDefinition(definition);
		//----		
	}//eo onListViewChangeColumnPosition
	
	//TODO refactor/reimplement
	,preview : function() {
		afApp.widgetPopup(this.widgetUri, this.rootNode.text, null, "iconCls:\'" + "\',width:800,height:600,maximizable: false", afStudio);
	}//eo preview
		
});

/**
 * @type 'afStudio.wd.designerTab'
 */
Ext.reg('afStudio.wd.designerTab', afStudio.wd.DesignerTab);