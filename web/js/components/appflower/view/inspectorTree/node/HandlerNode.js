/**
 * <u>i:handler</u> tree node.
 * @class afStudio.view.inspector.HandlerNode
 * @extends afStudio.view.inspector.ContainerNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.HandlerNode = Ext.extend(afStudio.view.inspector.ContainerNode, {

	labelProperty : 'action'
});


/**
 * Adds "HandlerNode" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.HandlerNode = afStudio.view.inspector.HandlerNode;