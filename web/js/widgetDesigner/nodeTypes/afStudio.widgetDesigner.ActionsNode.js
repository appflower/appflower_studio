afStudio.widgetDesigner.ActionsNode = Ext.extend(afStudio.widgetDesigner.CollectionNode, {
    addChildActionLabel: 'Add action',
    childNodeId: 'i:action',
    createChild: function(){
        return new afStudio.widgetDesigner.ActionNode;
    },
	getNodeConfig: function(){
        var config = {
            text: 'Actions',
            id: 'i:actions'
        };
        return config;
	}
});
