/**
 * Inspector tree base <i>inspector tree nodes</i> class.
 * 
 * @class afStudio.view.inspector.TreeNode
 * @constructor
 * @param {Object} attr
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.TreeNode = function(attr) {
	attr = attr || {};
	
	if (attr.modelNode) {
		this.modelNode = attr.modelNode;
		delete attr.modelNode;
	}
	
	this.initNode(attr);
	
	afStudio.view.inspector.TreeNode.superclass.constructor.call(this, attr);
	
	this.resolveNodeText();
	
	this.initContextMenu();
};

/**
 * Context menu "delete" item's text
 * @static deleteNodeCxtText
 * @type {String} 
 */
afStudio.view.inspector.TreeNode.deleteNodeCxtText = 'Delete',
/**
 * Context menu "add" item's text
 * @static addNodeCxtText
 * @type {String} 
 */
afStudio.view.inspector.TreeNode.addNodeCxtText = 'Add',

/**
 * @class afStudio.view.inspector.TreeNode
 * @extends Ext.tree.TreeNode
 */
Ext.extend(afStudio.view.inspector.TreeNode, Ext.tree.TreeNode, {
	/**
	 * The Model node associated with this node.
	 * @property modelNode
	 * @type {Node}
	 */
	
	/**
	 * The context menu object for this node.
	 * @property contextMenu
	 * @type {Ext.menu.Menu}
	 */
	contextMenu : new Ext.menu.Menu({
		items: [
        {
            itemId: 'delete',
            text: afStudio.view.inspector.TreeNode.deleteNodeCxtText,
            iconCls: 'afs-icon-delete'
		}],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            	
            	switch (item.itemId) {
            		case 'delete' :
            			node.removeModelNode();
            		break;
            	}
            }
        }
	}),
	//eo contextMenu

	/**
	 * Sets required attributes.
	 * 
	 * Template method.
	 * @protected
	 * @param {Object} attr
	 */
	initNode : function(attr) {
	},
	
	/**
	 * Sets up node {@link #text} property.
	 * 
	 * Template method.
	 * @protected
	 */
	resolveNodeText : function() {
		var attr = this.attributes;
		//this.attributes.text is required for tree sorter class
		this.text = this.attributes.text = attr.name || attr.text || this.modelNode.tag;
	},
	
	/**
	 * This method should be overrided in descendants classes to provide node's context menu implementation 
	 * and setting up {@link #contextMenu} property.
	 * The method should set up {@link #contextMenu} property to apply new context menu.
	 * 
	 * Template method.
	 * @protected
	 */
	initContextMenu : function() {
		if (this.modelNode.isDirectRootChild()) {
			this.contextMenu = null;
		}
	},
	
	/**
	 * Removes {@link modelNode} model associated with this node.
	 * In result of the operation this tree-node will be removed.
	 * @public
	 */
	removeModelNode : function() {
		this.modelNode.remove(true);
	}	
});

/**
 * Adds "node" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.node = afStudio.view.inspector.TreeNode;