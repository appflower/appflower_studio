/**
 * <u>i:ref</u> tree node.
 * @class afStudio.view.inspector.RefNode
 * @extends afStudio.view.inspector.TreeNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.RefNode = Ext.extend(afStudio.view.inspector.TreeNode, {

	labelProperty : 'to'
});


/**
 * Adds "RefNode" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.RefNode = afStudio.view.inspector.RefNode;