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
        	new afStudio.widgetDesigner.PropertyRecord({
                    name: 'Name', value: '', required: 'Mandatory'
                }, 'Name'
            ),
        	new afStudio.widgetDesigner.PropertyRecord({
                    name: 'Icon', value: '', required: 'Optional'
                }, 'Icon'
            ),
        	new afStudio.widgetDesigner.PropertyRecord({
                    name: 'Url', value: '', required: 'Mandatory'
                }, 'Url'
            ),
        	new afStudio.widgetDesigner.PropertyRecord({
                    name: 'Condition', value: '', required: 'Optional'
                }, 'Condition'
            )
        ];
        return properties;
    }
});
