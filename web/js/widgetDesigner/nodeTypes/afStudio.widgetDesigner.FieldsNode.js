afStudio.widgetDesigner.FieldsNode = Ext.extend(afStudio.widgetDesigner.CollectionNode, {
    addChildActionLabel: 'Add Field',
    childNodeId: 'i:column',
    createChild: function(){
        return new afStudio.widgetDesigner.ColumnNode;
    },
	getNodeConfig: function(){
        var config = {
            text: 'Fields',
            id: 'i:fields'
        };
        return config;
	}
});