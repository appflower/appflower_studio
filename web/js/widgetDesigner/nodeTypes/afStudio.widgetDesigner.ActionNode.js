afStudio.widgetDesigner.ActionNode = function(){
    var config = this.getNodeConfig();
    this.createContextMenu();
    afStudio.widgetDesigner.ActionNode.superclass.constructor.apply(this, [config]);
};
Ext.extend(afStudio.widgetDesigner.ActionNode, Ext.tree.TreeNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
                {text: 'Delete', handler: this.remove, scope: this}
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
	}
});
