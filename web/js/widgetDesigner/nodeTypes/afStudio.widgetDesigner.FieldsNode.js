afStudio.widgetDesigner.FieldsNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
                {text: 'Add field', handler: this.addField, scope: this}
            ]
        });
    },
    addField: function(){
        var newNode = new afStudio.widgetDesigner.ColumnNode;
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
            text: 'Fields',
            leaf: true,
            listeners: {
                contextmenu: this.contextMenuHandler
            },
            id: 'i:fields'
        };
        return config;
	},
    configureForValue: function(id, value){
        if (id == 'i:column') {
            if (!Ext.isArray(value)) {
                value = [value];
            }
            for(var i=0;i<value.length;i++){
                var newNode = this.addField();
                newNode.configureFor(value[i]);
            }
        } else {
            afStudio.widgetDesigner.FieldsNode.superclass.configureForValue(this, arguments);
        }
    },
    dumpChildsData: function(){
        var data = [];
        this.eachChild(function(childNode){
            data.push(childNode.dumpDataForWidgetDefinition());
        });

        return {'i:column': data};
    }
});