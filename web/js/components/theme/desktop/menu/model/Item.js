N = afStudio.theme.desktop.menu.model; 

N.Item = Ext.extend(N.Node, {

    tag: 'item',
    
    properties : [
        {name: 'type', type: 'menuItemType', required: true, defaultValue: 'item'},
        {name: 'label', type: 'string', required: true},
        {name: 'handler', type: 'string', required: true},
        {name: 'url', type: 'internalUriType', required: true},
        {name: 'icon', type: 'string'},
        {name: 'tooltip', type: 'string'}
    ],
    
    nodeTypes : [
        {name: 'item', hasMany: true}, 
        {name: 'button', hasMany: true} 
    ]
    
});

delete N;