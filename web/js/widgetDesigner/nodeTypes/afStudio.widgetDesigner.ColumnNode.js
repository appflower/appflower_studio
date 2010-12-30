afStudio.widgetDesigner.ColumnNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    updateNodeNameFromPropertyId: 'name',
	getNodeConfig: function(){
        var node = {
            iconCls: 'icon-field',
            text: 'column name'
        }
        return node;
	},
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create());
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeBoolean('sortable','Sortable')
                .create()
        );
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeBoolean('editable','Editable')
                .create()
        );
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeBoolean('resizable','Resizable')
                .create()
        );
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeString('style','Style')
                .create()
        );
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeString('label','Label')
                .create()
        );
    }
});