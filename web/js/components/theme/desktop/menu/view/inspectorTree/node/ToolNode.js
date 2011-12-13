N = afStudio.theme.desktop.menu.view.inspector;

N.ToolNode = Ext.extend(afStudio.view.inspector.TreeNode, {
    labelProperty : 'text'
});

/**
 * Adds "ToolNode" type to inspector tree nodes
 */
N.nodeType.ToolNode = N.ToolNode;

delete N;