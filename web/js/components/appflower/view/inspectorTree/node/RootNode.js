/**
 * Inspector tree <i>Root</i> node.
 * 
 * @class afStudio.view.inspector.RootNode
 * @extends Ext.tree.ContainerNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.RootNode = Ext.extend(afStudio.view.inspector.ContainerNode, {
	
	/**
	 * Template method.
	 * @protected
	 * @override
	 * Root node has no context menu right now.
	 */
	initContextMenu : function() {
		this.contextMenu = null;
	}
});


/**
 * Adds "RootNode" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.RootNode = afStudio.view.inspector.RootNode;