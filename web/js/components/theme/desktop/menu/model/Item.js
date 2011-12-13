N = afStudio.theme.desktop.menu.model; 

N.Item = Ext.extend(N.Node, {

    tag: N.Nodes.ITEM,
    
    properties : [
        {name: 'type', type: 'menuItemType', required: true, defaultValue: 'item'},
        {name: 'label', type: 'string', required: true},
        {name: 'url', type: 'internalUriType', required: true},
        {name: 'icon', type: "absoluteUriType"},
        {name: 'tooltip', type: 'string'}
    ],
    
    nodeTypes : [
        {name: N.Nodes.ITEM, hasMany: true}, 
        {name: N.Nodes.BUTTON, hasMany: true} 
    ]
});

delete N;