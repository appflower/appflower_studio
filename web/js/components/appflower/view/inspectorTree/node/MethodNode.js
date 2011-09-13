/**
 * <u>i:method</u> tree node.
 * @class afStudio.view.inspector.MethodNode
 * @extends afStudio.view.inspector.ContainerNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.MethodNode = Ext.extend(afStudio.view.inspector.ContainerNode, {

	labelProperty : 'tag'
});


/**
 * Adds "MethodNode" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.MethodNode = afStudio.view.inspector.MethodNode;