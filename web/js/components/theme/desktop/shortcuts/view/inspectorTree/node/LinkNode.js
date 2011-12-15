N = afStudio.theme.desktop.shortcut.view.inspector;

N.LinkNode = Ext.extend(afStudio.view.inspector.TreeNode, {
    labelProperty : 'name',

    /**
     * @override
     */
    initNode : function(attr) {
        attr.iconCls = 'icon-tb-shortcut-link';
    }    
});

/**
 * Adds "ToolNode" type to inspector tree nodes
 */
N.nodeType.LinkNode = N.LinkNode;

delete N;