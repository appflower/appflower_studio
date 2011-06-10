/**
 * This class contains Param node
 * It is used in places where class and method is provided
 * Also in validators
 * 
 * @class afStudio.wi.ParamNode
 * @extends afStudio.wi.ContainerNode
 */
afStudio.wi.ParamNode = Ext.extend(afStudio.wi.ContainerNode, {
    /**
     * template method
     * @override
     * @return {Object} this node configuration object
     */    
    getNodeConfig : function() {
        return {
            'text': 'parameter'
        };
    }//eo getNodeConfig 
    
    /**
     * template method
     * @override
     */    
    ,createProperties : function() {
        var properties = [
            new afStudio.wi.PropertyTypeString({id: 'name', label: 'Name'}).setRequired().create(),
            new afStudio.wi.PropertyTypeString({id: '_content', label: 'Value'}).setRequired().create()
        ];
        this.addProperties(properties);
    }//eo createProperties 
    ,getLabel : function() {
        return this.getPropertyValue('name');
    }//eo addBehavior
});
