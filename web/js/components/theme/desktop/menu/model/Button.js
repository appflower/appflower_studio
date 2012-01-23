N = afStudio.theme.desktop.menu.model; 

N.Button = Ext.extend(N.Node, {

    tag: N.Nodes.BUTTON,
    
    properties : [
        {name: 'name', type: 'dbNameType', required: true},
        {name: 'type', type: 'menuItemType', required: true, defaultValue: 'button'},
        {name: 'label', type: 'string', required: true},
        {name: 'handler', type: 'string', required: true},
        {name: 'iconCls', type: 'token'},
        {name: 'icon', type: "absoluteUriType"},
        {name: 'tooltip', type: 'string'}
    ],
    
    defaultDefinition : {
        attributes: {
            label: 'Button',
            name: 'button'
        }
    },    
    
    nodeTypes : [
        {name: N.Nodes.ITEM, hasMany: true, unique: 'name'}, 
        {name: N.Nodes.BUTTON, hasMany: true, unique: 'name'} 
    ],
    
    /**
     * @override 
     */
    onModelPropertyChanged : function(node, p, v, oldValue) {
        var tree = this.getOwnerTree(),
            ns = afStudio.theme.desktop.menu.model;
        
        //"type" property
        if (tree && p == "type") {
            var newNode = null,
                def = {attributes: node.getPropertiesHash()};
            
            if (v == ns.Nodes.ITEM) {
                delete def.attributes.handler;
                
                newNode = new ns.Item({
                    definition: def
                });
            }
            
            node.parentNode.replaceChildPreserveContent(newNode, node);
            newNode.getOwnerTree().selectModelNode(newNode);
        }
        
        return true;
    }    
});

delete N;