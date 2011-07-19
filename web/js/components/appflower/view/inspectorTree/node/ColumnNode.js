/**
 * <u>i:column</u> tree node.
 * @class afStudio.view.inspector.ColumnNode
 * @extends afStudio.view.inspector.TreeNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.ColumnNode = Ext.extend(afStudio.view.inspector.TreeNode, {
	
	/**
	 * @override
	 */
	initNode : function(attr) {
		attr.iconCls = 'icon-field';
	}
});


/**
 * Adds "RootNode" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.ColumnNode = afStudio.view.inspector.ColumnNode;