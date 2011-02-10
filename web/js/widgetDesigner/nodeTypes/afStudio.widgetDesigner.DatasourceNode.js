/**
 * This node represents i:datasource node in edit type widget
 **/
afStudio.widgetDesigner.DatasourceNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    constructor: function(){
        afStudio.widgetDesigner.DatasourceNode.superclass.constructor.apply(this, arguments);
        this.addBehavior(new afStudio.widgetDesigner.WithValueTypeBehavior);
    },
    getNodeConfig: function(){
        return {
            'text': 'Datasource',
            'id': 'i:datasource'
        };
    },
    setClassFromModel: function(model) {
        var peerClass = model+'Peer';
        this.behaviors[0].configureFor(this,{
           'type': 'orm',
           'i:class': peerClass
        });
    }
});
