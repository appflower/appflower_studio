afStudio.widgetDesigner.ActionsNode = function(){
    var config = this.getNodeConfig();
    this.createContextMenu();
    afStudio.widgetDesigner.ActionsNode.superclass.constructor.apply(this, [config]);
};
Ext.extend(afStudio.widgetDesigner.ActionsNode, Ext.tree.TreeNode, {
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
	getNodeConfig: function(){
        var config = {
            text: 'Actions',
            leaf: true,
            listeners: {
                contextmenu: this.contextMenuHandler
            }
        };
        return config;
	}
});
