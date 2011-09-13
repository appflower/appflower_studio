/**
 * <u>i:set</u> tree node.
 * @class afStudio.view.inspector.SetNode
 * @extends afStudio.view.inspector.ContainerNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.SetNode = Ext.extend(afStudio.view.inspector.ContainerNode, {

	labelProperty : 'title'
});


/**
 * Adds "SetNode" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.SetNode = afStudio.view.inspector.SetNode;