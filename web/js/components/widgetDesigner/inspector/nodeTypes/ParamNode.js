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
	 * ParamNode
	 * @constructor
	 */
    constructor : function() {
        afStudio.wi.ParamNode.superclass.constructor.apply(this, arguments);
        
        this.addBehavior(new afStudio.wi.WithNamePropertyAsLabelBehavior);
    }//eo constructor
    
    /**
     * template method
     * @override
     * @return {Object} this node configuration object
     */    
    ,getNodeConfig : function() {
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
            new afStudio.wi.PropertyTypeString('name','Name').setRequired().create(),
            new afStudio.wi.PropertyTypeString('_content','Value').setRequired().create()
        ];
        this.addProperties(properties);
    }//eo createProperties 
});
