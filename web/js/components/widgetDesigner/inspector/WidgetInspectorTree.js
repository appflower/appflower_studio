Ext.namespace('afStudio.wi');

/**
 * Widget Inspector tree component.
 * Responsible for representing and monupulating of widget's elements (fields, columns, datasource and etc.)
 * 
 * @class afStudio.wi.WidgetInspectorTree
 * @extends Ext.tree.TreePanel
 * @author Nikolai
 */
afStudio.wi.WidgetInspectorTree = Ext.extend(Ext.tree.TreePanel, {
	/**
	 * @cfg {String} layout
	 */
	layout : 'fit'
	
    /**
     * Tree sorter.
     * @property treeSorter
     * @type {Ext.tree.TreeSorter}
     */	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
        this.treeSorter = new Ext.tree.TreeSorter(this, {
        	folderSort: true
        });
	    
        var rootNode = this.buildTreeRootNode(this.widgetRootNode) ;

		return {
			root: rootNode,
            animate: true,
            containerScroll: true,
            autoScroll: true
		};
	}//eo _beforeInitComponent	
	,buildTreeRootNode : function(widgetRootNode) {
        var root = {
            text: widgetRootNode.getLabel(),
            children: [],
            WDNode: widgetRootNode
        }
        
        // @todo - how we can fix this ?
        window.tmpFuncHolder = this.buildTreeNode;
        
        this.buildTreeNode(widgetRootNode, root);
        return root;
    },
    buildTreeNode: function(nodeWithPossibleChildrens, rootNode){

        nodeWithPossibleChildrens.eachChild(function(childNode){

            var node = {
                text: childNode.getLabel(),
                leaf: childNode.isLeaf(),
                children: [],
                WDNode: childNode
            };
            this.children.push(node);
            if (!childNode.isLeaf()) {
                // @todo - how we can fix this ?
                // @todo - I need to call buildTreeNode recursively here but I don't know how I can reference it
                window.tmpFuncHolder(childNode, node);
            }
        },
        rootNode
        );
    }
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this,
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wi.WidgetInspectorTree.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this;		
		
		this.on({
			scope: _this,			
			afterrender: _this.initWidgetInspectorTree
		});
	}//eo _afterInitComponent

	/**
	 * Initialises inspector tree after it was rendered.
	 * This tree <u>afterrender</u> event listener.
	 * @private
	 */	
	,initWidgetInspectorTree : function() {
		this.expandAll();
	}//eo initWidgetInspectorTree 
});

/**
 * @type afStudio.wi.widgetInspectorTree
 */
Ext.reg('afStudio.wi.widgetInspectorTree', afStudio.wi.WidgetInspectorTree);