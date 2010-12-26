afStudio.widgetDesigner.ObjectRootNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
                {text: 'Add action', handler: this.addAction, scope: this}
            ]
        });
    },
    addAction: function(){
        var newNode = new afStudio.widgetDesigner.ActionNode;
        this.expand();
        this.appendChild(newNode);
    },
    contextMenuHandler: function(node, e){
        node.select();
        this.contextMenu.showAt(e.getXY());
    },
	getNodeConfig: function(data){
        var config = {
			text: data['i:title'] || 'Object node',
			qtip: data['i:description'] || 'Default QTip',

            itemId: 'object', iconCls: 'icon-obj',
            leaf: false, expanded: true,
            
            listeners: {
                contextmenu: this.contextMenuHandler
            }
        };
        return config;
	}
});
