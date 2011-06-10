Ext.namespace('afStudio.wi');

/**
 * InspectorPanel encapsulates widget inspector tree and property grid.
 * 
 * @class afStudio.wi.InspectorPanel
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.wi.InspectorPanel = Ext.extend(Ext.Panel, { 
	
	layout: 'border'
	
	/**
	 * Widget metadata.
	 * @cfg {Object} widgetMeta
	 */
	
	/**
	 * Inspector property grid.
	 * Referenced by <tt>ref</tt> cfg option.
	 * 
	 * @property propertyGrid
	 * @type {afStudio.wi.PropertyGrid}
	 */

	/**
	 * Widget inspector tree.
	 * Referenced by <tt>ref</tt> cfg option.
	 * 
	 * @property inspectorTree
	 * @type {afStudio.wi.WidgetInspectorTree}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
   		var _this = this;
   	    var root = afStudio.wd.WidgetFactory.createWIRootNode(this.widgetMeta.definition.type);
       	root.configureFor(this.widgetMeta.definition);
        this.widgetRootNode = root;

        this.widgetRootNode.addListener('propertyChanged', this.WDNodePropertyChanged, this);

		return {
            title: 'Widget Inspector',
			items: [
			{
				xtype: 'afStudio.wi.widgetInspectorTree',
				ref: 'inspectorTree',
				region: 'center',
				widgetRootNode: root
			},{
				xtype: 'afStudio.wi.propertyGrid',
				ref: 'propertyGrid',
				region: 'south',
				split: true,			
				height: 150,				        
		        layout: 'fit',
				view: new Ext.grid.GroupingView({
					scrollOffset: 19,
					forceFit: true,
		            showGroupName: false,
		            groupTextTpl: '{text}'
		        })
			}]
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
		afStudio.wi.InspectorPanel.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private 
	 */
	,_afterInitComponent : function() {
		var _this = this;
		
		this.inspectorTree.on({
			scope: _this,
			click: _this.onInspectorTreeNodeClick	
		});
		
		this.propertyGrid.on({
			scope: _this,
        	afteredit: _this.onPropertyGridAfterEdit
		});		
		this.propertyGrid.getView().on('refresh', _this.onGridRefresh, _this);
	}//eo _afterInitComponent	
	
	/**
	 * {@link #inspectorTree} widget inspector tree <u>click</> event listener.
	 * @param {Ext.tree.TreeNode} node
	 * @param {Ext.EventObject} e
	 */
	,onInspectorTreeNodeClick : function(node) {
        this.loadNodeProperties(node);
	}//eo onInspectorTreeNodeClick
    ,loadNodeProperties: function(WInode) {
		var fields = WInode.attributes.WDNode.getProperties();
		this.propertyGrid.setSource(fields);
        this.currentWDNode = WInode.attributes.WDNode;
    }
	/**
     * delegates edit action to WDNode object
	 */
	,onPropertyGridAfterEdit : function(e) {
        this.widgetRootNode.setProperty(this.currentWDNode, e.record.id, e.value);
	}//eo onPropertyGridAfterEdit
	
    /**
     * Handler that reacts on any property changes
     * it reloads all properties
     */
    ,WDNodePropertyChanged: function(WDNode) {
        var WINode = this.inspectorTree.findWINodeByWDNode(WDNode);
        this.loadNodeProperties(WINode);
        WINode.setText(WDNode.getLabel());
    }
	,onGridRefresh : function(view) {
		var grid = view.grid,
   			  ds = grid.getStore();
   			  
    	for (var i = 0, rcnt = ds.getCount(); i < rcnt; i++) {    		
    		var rec = ds.getAt(i);
    		var html = '<b>' + rec.get('name') + ':</b> ' + rec.get('value');
			
        	var row = view.getRow(i);
        	var els = Ext.get(row).select('.x-grid3-cell-inner');
    		for (var j = 0, ccnt = els.getCount(); j < ccnt; j++) {
          		Ext.QuickTips.register({
            		target: els.item(j),
            		text: html
        		});
    		}
		}
		grid.hideMandatoryCheckers();
	}//eo onGridRefresh   
	
});

/**
 * @type afStudio.wi.inspectorPanel
 */
Ext.reg('afStudio.wi.inspectorPanel', afStudio.wi.InspectorPanel);