Ext.ns('afStudio.view.inspector');

/**
 * Inspector tree base node class.
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
	
	attr.text = attr.name || attr.text || this.modelNode.tag; 
	
	afStudio.view.inspector.TreeNode.superclass.constructor.call(this, attr);
};

/**
 * Context menu "delete" item text
 * @static deleteNodeCxtText
 * @type {String} 
 */
afStudio.view.inspector.TreeNode.deleteNodeCxtText = 'Delete',
/**
 * Context menu "add" item text
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
            			node.removeNode();
            		break;
            	}
            }
        }		
	}),
	//eo contextMenu
	
	/**
	 * @abstract
	 */
	initContextMenu : function() {
		return null;
	},
	
	/**
	 * Removes node.
	 */
	removeNode : function() {
		this.remove();
	}
	
});

afStudio.view.inspector.TreePanel.nodeTypes.node = afStudio.view.inspector.TreeNode;