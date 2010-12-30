afStudio.widgetDesigner.ActionNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    updateNodeNameFromPropertyId: 'name',
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
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create());
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('url','Url').setRequired().create());
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('iconCls','Icon').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('condition','Condition').create());
    }
});
