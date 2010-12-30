afStudio.widgetDesigner.RowActionsNode = Ext.extend(afStudio.widgetDesigner.CollectionNode, {
    addChildActionLabel: 'Add rowaction',
    childNodeId: 'i:action',
    createChild: function(){
        return new afStudio.widgetDesigner.ActionNode;
    },
	getNodeConfig: function(){
        var config = {
            text: 'Row Actions',
            id: 'i:rowactions'
        };
        return config;
	}
});
