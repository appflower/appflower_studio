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
    
    defaultDefinition : {
        attributes: {
            label: 'Item'
        }
    },    
    
    nodeTypes : [
        {name: N.Nodes.ITEM, hasMany: true}, 
        {name: N.Nodes.BUTTON, hasMany: true} 
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
            
            if (v == ns.Nodes.BUTTON) {
                delete def.attributes.url;
                
                newNode = new ns.Button({
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