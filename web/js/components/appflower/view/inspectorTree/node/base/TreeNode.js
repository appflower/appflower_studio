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
	
	this.properties = attr.properties;
	delete attr.properties;
	
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
	 * The {@link #modelNode} property's name which TreeNode uses to specify 
	 * its {@link #text} property and text attribute (defaults to "name").
	 * This property should be used to change the text("label") of a tree node.   
	 * @property
	 * @type {String}
	 */
	labelProperty : "name",
	
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
	 * @abstract
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
		var attr = this.attributes,
			ps = this.properties,
			lp = this.labelProperty;
		
		if (Ext.isDefined(ps[lp])) {
			this.text = attr.text = ps[lp];
		} else {
			this.text = attr.text = this.modelNode.tag;
		}
	},
	
	/**
	 * This method can be overrided in descendants classes to provide node's context menu implementation 
	 * and setting up {@link #contextMenu} property.
	 * The method should set up {@link #contextMenu} property to apply new context menu.
	 * 
	 * Template method.
	 * @protected
	 */
	initContextMenu : function() {
		var model = this.modelNode;
		if (model.isRequired() && !model.hasMany()) {
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
	},
	
	/**
	 * Finds first node which associated model is equal to passed in model node. 
	 * @public
	 * @param {String/Node} mn The model node to search by. String for model node's ID.
	 * @param {Boolean} deep The flag for deep searching.
	 * @return {TreeNode}
	 */
    findChildByAssociatedModel : function(mn, deep) {
        return this.findChildBy(function(){
            return this.modelNode.id == (Ext.isString(mn) ? mn : mn.id);
        }, null, deep);
    }
});

/**
 * Adds "node" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.node = afStudio.view.inspector.TreeNode;