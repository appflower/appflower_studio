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
	}
});
