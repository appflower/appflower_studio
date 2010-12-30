afStudio.widgetDesigner.ParamNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
	getNodeConfig: function(){
        var node = {
            text: 'parameter'
        };
        return node;
	},
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create());
    }
});
