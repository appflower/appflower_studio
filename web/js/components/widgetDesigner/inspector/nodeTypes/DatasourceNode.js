/**
 * This node represents i:datasource node in edit type widget
 * @class afStudio.wi.DatasourceNode
 * @extends afStudio.wi.ContainerNode
 */
afStudio.wi.DatasourceNode = Ext.extend(afStudio.wi.ContainerNode, {
	
    constructor : function() {
        afStudio.wi.DatasourceNode.superclass.constructor.apply(this, arguments);
        this.addBehavior(new afStudio.wi.WithValueTypeBehavior);
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
            new afStudio.wi.PropertyTypeString({id: 'modelName', label: 'Model Name'}).create(),
            new afStudio.wi.PropertyTypeString({id: 'dataLoadedHandler', label: 'JS Data loaded handler'}).create(),
            new afStudio.wi.PropertyTypeString({id: 'className', label: 'Class Name'}).create()
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
            this.behaviors[0].configureFor({
               'type': 'orm',
               'i:class': 'ModelCriteriaFetcher',
               'i:method': {
                 'name': 'getDataForList',
                 'i:param': [{name: 'modelName', _content: model}]
               }
            });
        } else {
            var peerClass = model+'Peer';
            this.behaviors[0].configureFor({
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