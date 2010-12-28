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
    createProperties: function(){
        var properties = [
            new afStudio.widgetDesigner.PropertyBaseType('i:name','Name').setRequired().create(),
            new afStudio.widgetDesigner.PropertyBaseType('i:url','Url').setRequired().create(),
            new afStudio.widgetDesigner.PropertyBaseType('i:icon','Icon').create(),
            new afStudio.widgetDesigner.PropertyBaseType('i:condition','Condition').create()
        ];
        return properties;
    }
});
