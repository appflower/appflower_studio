Ext.ns('afStudio.view.inspector');

/**
 * Base inspector tree node.
 * 
 * @class afStudio.view.inspector.TreeNode
 * @extends Ext.tree.TreeNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.TreeNode =  Ext.extend(Ext.tree.TreeNode, {

	/**
	 * @property
	 * @type {Ext.menu.Menu}
	 */
	contextMenu : null,
	
	/**
	 * @property modelNode
	 * @type {Node}
	 */
	
	constructor : function(attr) {
		attr = attr || {}; 
		
		if (attr.modelNode) {
			this.modelNode = attr.modelNode;
			delete attr.modelNode;
		}
		
		attr.text = attr.name || attr.text || this.modelNode.tag; 
		
		afStudio.view.inspector.TreeNode.superclass.constructor.call(this, attr);
	}
	//eo constructor
});

afStudio.view.inspector.TreePanel.nodeTypes.node = afStudio.view.inspector.TreeNode;