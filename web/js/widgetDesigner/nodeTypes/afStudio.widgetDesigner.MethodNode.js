afStudio.widgetDesigner.MethodNode = Ext.extend(afStudio.widgetDesigner.CollectionNode, {
    addChildActionLabel: 'Add param',
    childNodeId: 'i:param',
    createChild: function(){
        return new afStudio.widgetDesigner.ParamNode;
    },
	getNodeConfig: function(){
        var config = {
            text: 'Method',
            id: 'i:method'
        };
        return config;
	},
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create());
    }
});
