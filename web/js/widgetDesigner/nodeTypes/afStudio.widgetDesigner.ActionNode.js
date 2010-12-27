afStudio.widgetDesigner.ActionNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
                {text: 'Delete', handler: this.remove, scope: this, iconCls: 'icon-delete'}
            ]
        });
    },
    contextMenuHandler: function(node, e){
        node.select();
        this.contextMenu.showAt(e.getXY());
    },
	getNodeConfig: function(){
        var node = {
            leaf: true,
            text: 'new action',
            listeners: {
                contextmenu: this.contextMenuHandler
            }
        };
        return node;
	},
    getProperties: function(){
        var properties = [
        	new afStudio.widgetDesigner.PropertyTypeString('name'),
        	new afStudio.widgetDesigner.PropertyTypeString('iconCls'),
        	new afStudio.widgetDesigner.PropertyTypeString('url'),
        	new afStudio.widgetDesigner.PropertyTypeString('condition')
        ];

        return this.prepareProperties(properties);
    }
});
