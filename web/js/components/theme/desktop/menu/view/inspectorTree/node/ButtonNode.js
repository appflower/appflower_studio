N = afStudio.theme.desktop.menu.view.inspector;

N.ButtonNode = Ext.extend(afStudio.view.inspector.ContainerNode, {
    labelProperty : 'label'
});

/**
 * Adds "ButtonNode" type to inspector tree nodes
 */
N.nodeType.ButtonNode = N.ButtonNode;

delete N;