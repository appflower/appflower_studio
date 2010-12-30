afStudio.widgetDesigner.ParamNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
	getNodeConfig: function(){
        var node = {
            leaf: true,
            text: 'parameter'
        };
        return node;
	},
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create());
    }
});
