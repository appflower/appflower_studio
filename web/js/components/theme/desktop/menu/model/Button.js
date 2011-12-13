N = afStudio.theme.desktop.menu.model; 

N.Button = Ext.extend(N.Node, {

    tag: N.Nodes.BUTTON,
    
    properties : [
        {name: 'type', type: 'menuItemType', required: true, defaultValue: 'button'},
        {name: 'label', type: 'string', required: true},
        {name: 'handler', type: 'string', required: true},
        {name: 'icon', type: "absoluteUriType"},
        {name: 'tooltip', type: 'string'}
    ],
    
    nodeTypes : [
        {name: N.Nodes.ITEM, hasMany: true}, 
        {name: N.Nodes.BUTTON, hasMany: true} 
    ]
});

delete N;