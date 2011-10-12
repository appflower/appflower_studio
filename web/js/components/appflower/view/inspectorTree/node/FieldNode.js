/**
 * <u>i:field</u> tree node.
 * @class afStudio.view.inspector.FieldNode
 * @extends afStudio.view.inspector.ContainerNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.FieldNode = Ext.extend(afStudio.view.inspector.ContainerNode, {
	
	/**
	 * @override
	 */
	initNode : function(attr) {
		attr.iconCls = 'icon-field';
	}
});


/**
 * Adds "FieldNode" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.FieldNode = afStudio.view.inspector.FieldNode;