afStudio.widgetDesigner.ObjectRootNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    /**
     * should contain widget type
     */
    widgetType: null,
	getNodeConfig: function(){
        var config = {
			text: 'Abstract root Object node',
            iconCls: 'icon-obj',
            expanded: true
        };
        return config;
	},
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('i:title','Title').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeBoolean('i:description','Description').create());
    }
});
