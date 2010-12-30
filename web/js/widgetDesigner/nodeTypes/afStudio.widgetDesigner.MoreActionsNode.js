afStudio.widgetDesigner.MoreActionsNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
                {
                    text: 'Add moreaction',
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
            text: 'More Actions',
            leaf: true,
            listeners: {
                contextmenu: this.contextMenuHandler
            },
            id: 'i:moreactions'
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
            afStudio.widgetDesigner.MoreActionsNode.superclass.configureForValue(this, arguments);
        }
    },
    dumpChildsData: function(){
        var data = [];
        this.eachChild(function(childNode){
            data.push(childNode.dumpDataForWidgetDefinition());
        });

        return {'i:action': data};
    }
});
