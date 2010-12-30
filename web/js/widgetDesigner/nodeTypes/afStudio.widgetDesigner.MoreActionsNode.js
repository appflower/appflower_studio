afStudio.widgetDesigner.MoreActionsNode = Ext.extend(afStudio.widgetDesigner.CollectionNode, {
    addChildActionLabel: 'Add moreaction',
    childNodeId: 'i:action',
    createChild: function(){
        return new afStudio.widgetDesigner.ActionNode;
    },
	getNodeConfig: function(){
        var config = {
            text: 'More Actions',
            id: 'i:moreactions'
        };
        return config;
	}
});