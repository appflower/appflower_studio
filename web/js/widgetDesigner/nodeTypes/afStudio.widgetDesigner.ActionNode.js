/**
 * This node represents <b>i:action</b> node in edit type widget
 * 
 * @class afStudio.widgetDesigner.ActionNode
 * @extends afStudio.widgetDesigner.ContainerNode
 */
afStudio.widgetDesigner.ActionNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
	
	/**
	 * ActionNode constructor.
	 * @constructor
	 */
    constructor : function() {
        afStudio.widgetDesigner.ActionNode.superclass.constructor.apply(this, arguments);
        
        this.addBehavior(new afStudio.widgetDesigner.WithNamePropertyAsLabelBehavior);
    }//eo constructor
    
    /**
     * template method
     * @override
     * @return {Object} this node configuration object
     */
    ,getNodeConfig : function() {
        return {
            'text': 'new action'
        };
    }//eo getNodeConfig
    
    /**
     * template method
     * @override
     */
    ,createProperties : function() {
       var properties = [
           new afStudio.widgetDesigner.PropertyTypeString('name', 'Name').setRequired().create(),
           new afStudio.widgetDesigner.PropertyTypeString('url', 'Url').setRequired().create(),
           new afStudio.widgetDesigner.PropertyTypeString('iconCls', 'Icon CSS class').create(),
           new afStudio.widgetDesigner.PropertyTypeString('icon', 'Icon URL').create(),
           new afStudio.widgetDesigner.PropertyTypeBoolean('forceSelection', 'Force selection').create(),
           new afStudio.widgetDesigner.PropertyTypeBoolean('post', 'Post').create(),
           new afStudio.widgetDesigner.PropertyTypeString('tooltip', 'Tooltip').create(),
           new afStudio.widgetDesigner.PropertyTypeString('confirmMsg', 'Confirm message').create(),
           new afStudio.widgetDesigner.PropertyTypeString('condition', 'Condition').create()
       ];

       this.addProperties(properties);
    }//eo createProperties
});