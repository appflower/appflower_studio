/**
 * This node represents i:datasource node in edit type widget
 * @class afStudio.widgetDesigner.DatasourceNode
 * @extends afStudio.widgetDesigner.ContainerNode
 */
afStudio.widgetDesigner.DatasourceNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
	
    constructor : function() {
        afStudio.widgetDesigner.DatasourceNode.superclass.constructor.apply(this, arguments);
        this.addBehavior(new afStudio.widgetDesigner.WithValueTypeBehavior);
    }//eo constructor
    
    /**
     * template method
     * @override
     * @return {Object} this node configuration object
     */
    ,getNodeConfig : function() {
        return {
        	id: 'i:datasource',
            text: 'Datasource'
        };
    }//eo getNodeConfig
    
    /**
     * template method
     * @override
     */    
    ,createProperties : function() {
        var properties = [
            new afStudio.widgetDesigner.PropertyTypeString('modelName', 'Model Name').create()
        ];
        this.addProperties(properties);
    }//eo createProperties
    
    /**
     * Sets datasource model
     * @private
     * @param {String} model
     * @param {String} widgetType
     */
    ,setClassFromModel : function(model, widgetType) {
        if (widgetType == 'list') {
            this.properties['modelName'].set('value', model);
            this.behaviors[0].configureFor(this,{
               'type': 'orm',
               'i:class': 'ModelCriteriaFetcher',
               'i:method': {
                 'name': 'getDataForList',
                 'i:param': [{name: 'modelName', _content: model}]
               }
            });
        } else {
            var peerClass = model+'Peer';
            this.behaviors[0].configureFor(this, {
               'type': 'orm',
               'i:class': peerClass,
               'i:method': {
                 'name': 'retrieveByPk',
                 'i:param': {name: 'id', _content: '{id}'}
               }
            });
        }
    }//eo setClassFromModel
});