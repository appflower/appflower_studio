N = afStudio.theme.desktop.menu.view.inspector;

N.ButtonNode = Ext.extend(afStudio.view.inspector.ContainerNode, {
    labelProperty : 'label',
    
    /**
     * @override
     */
    initNode : function(attr) {
        attr.iconCls = 'icon-tb-menu-btn';
    }
});

/**
 * Adds "ButtonNode" type to inspector tree nodes
 */
N.nodeType.ButtonNode = N.ButtonNode;

delete N;