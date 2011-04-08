/**
 * This class contains Param node
 * It is used in places where class and method is provided
 * Also in validators
 * 
 * @class afStudio.widgetDesigner.ParamNode
 * @extends afStudio.widgetDesigner.ContainerNode
 */
afStudio.widgetDesigner.ParamNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    
	/**
	 * ParamNode
	 * @constructor
	 */
    constructor : function() {
        afStudio.widgetDesigner.ParamNode.superclass.constructor.apply(this, arguments);
        
        this.addBehavior(new afStudio.widgetDesigner.WithNamePropertyAsLabelBehavior);
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
            new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create(),
            new afStudio.widgetDesigner.PropertyTypeString('_content','Value').setRequired().create()
        ];
        this.addProperties(properties);
    }//eo createProperties 
});
