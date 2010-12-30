afStudio.widgetDesigner.DatasourceNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
	constructor: function(){
        afStudio.widgetDesigner.DatasourceNode.superclass.constructor.apply(this, arguments);

        this.appendChild(new afStudio.widgetDesigner.MethodNode());
	},
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
        		{iconCls: 'icon-edit', text: 'Rename Method'},
				{iconCls: 'afs-icon-delete', text: 'Delete', handler: this.remove, scope: this}
            ]
        });
    },
    contextMenuHandler: function(node, e){
        node.select();
        this.contextMenu.showAt(e.getXY());
    },
    createProperties: function(){
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeChoice('type','Type')
                .setChoices({
                	'orm':'orm',
                	'file':'file',
          			'static': 'static'
				})
                .create()
        );
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeString('class','Class')
                .create()
        );
    },
	getNodeConfig: function(data){
        var node = {
            text: 'Datasource',
            leaf: true,
            listeners: {
                contextmenu: this.contextMenuHandler
            },
            id: 'i:datasource'
        };
        return node;
	}
});