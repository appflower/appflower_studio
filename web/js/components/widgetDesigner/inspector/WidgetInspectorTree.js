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
	    
        this.widgetRootNode.addListener('childNodeCreated', this.newNodeCreated, this);
        
        var rootNode = this.buildTreeRootNode(this.widgetRootNode) ;

		return {
			root: rootNode,
            animate: true,
            containerScroll: true,
            autoScroll: true
		};
	}//eo _beforeInitComponent	
    ,newNodeCreated: function(parentNode, newChildNode, WIParentNode) {
        var newNodeDefinition = {
            text: newChildNode.getLabel()
            ,children: []
            ,WDNode: newChildNode
            ,leaf: newChildNode.isLeaf()
        }
        this.buildTreeNode(newChildNode, newNodeDefinition);
        var newWINode = WIParentNode.appendChild(newNodeDefinition);
        newWINode.expand();
    }
	,buildTreeRootNode : function(widgetRootNode) {
        var root = {
            text: widgetRootNode.getLabel(),
            children: [],
            WDNode: widgetRootNode
        }
        
        this.buildTreeNode(widgetRootNode, root);
        return root;
    },
    buildTreeNode: function(nodeWithPossibleChildrens, rootNode){
        var childrens = [];

        nodeWithPossibleChildrens.eachChild(function(childNode){

            var contextMenu = null;
            if (childNode.isCollectionType()) {
                contextMenu = this.createContextMenuForCollectionNode(childNode);
            }

            var node = {
                text: childNode.getLabel(),
                leaf: childNode.isLeaf(),
                children: [],
                WDNode: childNode
            };
            
            if (contextMenu != null) {
                node.contextMenu = contextMenu;
                node.listeners = {
                    contextmenu: function(node, event) {
                        var menu = node.attributes.contextMenu;
                        menu.contextNode = node;
                        menu.showAt(event.getXY());
                    }
                }
            }
            
            childrens.push(node);
            if (!childNode.isLeaf()) {
                this.buildTreeNode(childNode, node);
            }
        },
        this);
        rootNode.children = childrens;
    }
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
                            var node = item.parentMenu.contextNode;
                            if (node) {
                                var treePanel = node.getOwnerTree();
                                treePanel.widgetRootNode.createNewNodeFor(node.attributes.WDNode, node);
                            }
                            break;
                    }
                }
            }
        });
        return menu;
//    listeners: {
//        contextmenu: function(node, e) {
////          Register the context node with the menu so that a Menu Item's handler function can access
////          it via its parentMenu property.
//            node.select();
//            var c = node.getOwnerTree().contextMenu;
//            c.contextNode = node;
//            c.showAt(e.getXY());
//        }
//    }        
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