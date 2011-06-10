Ext.namespace('afStudio.wi');

/**
 * Widget Inspector tree component.
 * Responsible for representing and monupulating of widget's elements (fields, columns, datasource and etc.)
 * 
 * each WDNode is translated to WINode that is rendered
 * 
 * WDNode means WidgetDefinitionNode - those are afStudio.wi.BaseNode instances
 * WINode is simple JS object that is used to create Ext Tree
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
	    
        this.widgetRootNode.addListener('nodeCreated', this.WDNodeCreated, this);
        this.widgetRootNode.addListener('nodeDeleted', this.WDNodeDeleted, this);
        
        var WIRootNode = this.buildWINodeFromWDNode(this.widgetRootNode);

		return {
			root: WIRootNode,
            animate: true,
            containerScroll: true,
            autoScroll: true
		};
	}//eo _beforeInitComponent	
    /**
     * Handler that reacts on WidgetDefinition changes - new node created
     * It rebuilds all childrens of changed parent node
     */
    ,WDNodeCreated: function(newWDNode) {
        var newWINodeDefinition = this.buildWINodeFromWDNode(newWDNode);
        
        // we need to operate on parent because newWDNode does not have WI corecponding node yet
        var WDParentNode = newWDNode.parentNode;
        var WIParentNode = this.findWINodeByWDNode(WDParentNode);
        var newWINode = WIParentNode.appendChild(newWINodeDefinition);
        newWINode.expand();
    }
    /**
     * Handler that reacts on WidgetDefinition node deletion event
     */
    ,WDNodeDeleted: function(removedWDNode) {
        // we need to operate on parent because newWDNode does not have WI corecponding node yet
        var WINode = this.findWINodeByWDNode(removedWDNode);
        WINode.destroy();
    }
    /**
     * Creates simple object definition of WI node from WD node
     */
    ,buildWINodeFromWDNode: function(WDNode) {
        var WINode = {
            text: WDNode.getLabel()
            ,children: []
            ,WDNode: WDNode
            ,leaf: WDNode.isLeaf()
        }
        if (!WDNode.isLeaf()) {
            this.buildWINodeChildrensFromWDNode(WDNode, WINode);
        }
        
        this.createContextMenu(WDNode, WINode);
        
        return WINode;
    }
    /**
     * Finds WINode coresponding to given WDNode
     */
    ,findWINodeByWDNode: function(WDNode) {
        var findChildByWDNode = function(WINode) {
            if (WINode.attributes.WDNode.id == WDNode.id) {
                return true;
            }
        }
        var WIRootNode = this.getRootNode();
        return WIRootNode.findChildBy(findChildByWDNode, null, true);
    }
    /**
     * Recursively builds WINodes for each child of given WDNode
     */
    ,buildWINodeChildrensFromWDNode: function(WDNode, WINode){
        var childrens = [];

        WDNode.eachChild(function(WDChildNode){
            var WIChildNode = this.buildWINodeFromWDNode(WDChildNode);
            childrens.push(WIChildNode);
        },
        this);
        WINode.children = childrens;
    }
    /**
     * checks if given WDNode should have context menu and builds it
     */
    ,createContextMenu: function(WDNode, WINode) {
        var contextMenu = null;
        if (WDNode.isCollectionType()) {
            contextMenu = this.createContextMenuForCollectionNode(WDNode);
        } else if (WDNode.parentNode && WDNode.parentNode.isCollectionType()) {
            contextMenu = this.createContextMenuForCollectionNodeChild(WDNode, WINode);
        }

        if (contextMenu != null) {
            WINode.contextMenu = contextMenu;
            WINode.listeners = {
                contextmenu: function(node, event) {
                    var menu = node.attributes.contextMenu;
                    menu.contextNode = node;
                    menu.showAt(event.getXY());
                }
            }
        }
    }
    /**
     * builds context menu for collection type WDNodes
     */
    ,createContextMenuForCollectionNode: function(collectionNode) {
        var menu = new Ext.menu.Menu({
            items: [{
                id: 'create-node',
                text: collectionNode.getAddChildActionLabel()
            }]
            ,listeners: {
                itemclick: function(item) {
                    switch (item.id) {
                        case 'create-node':
                            var WINode = item.parentMenu.contextNode;
                            if (WINode) {
                                var treePanel = WINode.getOwnerTree();
                                treePanel.widgetRootNode.createNewNodeFor(WINode.attributes.WDNode);
                            }
                            break;
                    }
                }
            }
        });
        return menu;
    }
    /**
     * builds context menu for children node of collection type WDNode
     */
    ,createContextMenuForCollectionNodeChild: function(collectionChildNode) {
        var menu = new Ext.menu.Menu({
            items: [{
                id: 'delete-node',
                text: 'delete'
            }]
            ,listeners: {
                itemclick: function(item) {
                    switch (item.id) {
                        case 'delete-node':
                            var WINode = item.parentMenu.contextNode;
                            if (WINode) {
                                var treePanel = WINode.getOwnerTree();
                                treePanel.widgetRootNode.deleteNode(WINode.attributes.WDNode);
                            }
                            break;
                    }
                }
            }
        });
        return menu;
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