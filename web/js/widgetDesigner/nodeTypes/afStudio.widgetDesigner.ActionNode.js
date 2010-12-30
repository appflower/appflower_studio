afStudio.widgetDesigner.ActionNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    updateNodeNameFromPropertyId: 'name',
	getNodeConfig: function(){
        var node = {
            text: 'new action'
        };
        return node;
	},
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create());
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('url','Url').setRequired().create());
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('iconCls','Icon').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('condition','Condition').create());
    }
});
