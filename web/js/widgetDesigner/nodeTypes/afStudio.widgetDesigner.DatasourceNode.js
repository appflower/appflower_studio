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
        this.properties['modelName'].set('value', model);
        this.behaviors[0].configureFor(this,{
           'type': 'orm',
           'i:class': 'ModelCriteriaFetcher',
           'i:method': {
             'name': 'getDataForList',
             'i:param': [{name: 'modelName', _content: model}]
           }
        });
    },
    createProperties: function(){
        var properties = [
            new afStudio.widgetDesigner.PropertyTypeString('modelName','Model Name').create(),
        ];
        this.addProperties(properties);
    }
});
