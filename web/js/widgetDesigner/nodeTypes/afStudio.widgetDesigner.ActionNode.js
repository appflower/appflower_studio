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
        	new afStudio.widgetDesigner.PropertyTypeString({fieldLabel: 'Name', required: true}),
        	new afStudio.widgetDesigner.PropertyTypeString({fieldLabel: 'Icon'}),
        	new afStudio.widgetDesigner.PropertyTypeString({fieldLabel: 'Url', required: true}),
        	new afStudio.widgetDesigner.PropertyTypeString({fieldLabel: 'Condition'})
        ];

        return this.prepareProperties(properties);
    }
});
