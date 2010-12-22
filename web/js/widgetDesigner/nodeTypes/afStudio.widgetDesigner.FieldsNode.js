afStudio.widgetDesigner.FieldsNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
                {text: 'Add field', handler: this.addAction, scope: this}
            ]
        });
    },
    addAction: function(){
        var newNode = new afStudio.widgetDesigner.ColumnNode;
        this.expand();
        this.appendChild(newNode);
    },
    contextMenuHandler: function(node, e){
        node.select();
        this.contextMenu.showAt(e.getXY());
    },
	getNodeConfig: function(){
        var config = {
            text: 'Fields',
            leaf: true,
            listeners: {
                contextmenu: this.contextMenuHandler
            }
        };
        return config;
	}
});