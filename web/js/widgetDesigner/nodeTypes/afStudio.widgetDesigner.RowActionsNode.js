afStudio.widgetDesigner.RowActionsNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
                {
                    text: 'Add rowaction',
                    handler: this.addAction,
                    scope: this,
                    iconCls: 'icon-add'
                }
            ]
        });
    },
    addAction: function(){
        var newNode = new afStudio.widgetDesigner.ActionNode;
        this.appendChild(newNode);
        if (this.rendered) {
            this.expand();
        }
        return newNode;
    },
    contextMenuHandler: function(node, e){
        node.select();
        this.contextMenu.showAt(e.getXY());
    },
	getNodeConfig: function(){
        var config = {
            text: 'Row Actions',
            leaf: true,
            listeners: {
                contextmenu: this.contextMenuHandler
            },
            id: 'i:rowactions'
        };
        return config;
	},
    configureForValue: function(id, value){
        if (id == 'i:action') {
            if (!Ext.isArray(value)) {
                value = [value];
            }
            for(var i=0;i<value.length;i++){
                var newNode = this.addAction();
                newNode.configureFor(value[i]);
            }
        } else {
            afStudio.widgetDesigner.RowActionsNode.superclass.configureForValue(this, arguments);
        }
    }
});
