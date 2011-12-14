N = afStudio.theme.desktop.menu.view.inspector;

N.ToolNode = Ext.extend(afStudio.view.inspector.TreeNode, {
    labelProperty : 'text',

    /**
     * @override
     */
    initNode : function(attr) {
        attr.iconCls = 'icon-tb-menu-tool';
    }    
});

/**
 * Adds "ToolNode" type to inspector tree nodes
 */
N.nodeType.ToolNode = N.ToolNode;

delete N;