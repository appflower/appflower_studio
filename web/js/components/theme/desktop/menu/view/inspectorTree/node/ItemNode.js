N = afStudio.theme.desktop.menu.view.inspector;

N.ItemNode = Ext.extend(afStudio.view.inspector.ContainerNode, {
    labelProperty : 'label',
    
    /**
     * @override
     */
    initNode : function(attr) {
        attr.iconCls = 'icon-tb-menu-item';
    }
});


/**
 * Adds "ItemNode" type to inspector tree nodes
 */
N.nodeType.ItemNode = N.ItemNode;

delete N;