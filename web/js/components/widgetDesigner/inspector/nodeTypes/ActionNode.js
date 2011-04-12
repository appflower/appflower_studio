/**
 * This node represents <b>i:action</b> node in edit type widget
 * 
 * @class afStudio.wi.ActionNode
 * @extends afStudio.wi.ContainerNode
 */
afStudio.wi.ActionNode = Ext.extend(afStudio.wi.ContainerNode, {
	
	/**
	 * ActionNode constructor.
	 * @constructor
	 */
    constructor : function() {
        afStudio.wi.ActionNode.superclass.constructor.apply(this, arguments);
        
        this.addBehavior(new afStudio.wi.WithNamePropertyAsLabelBehavior);
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
           new afStudio.wi.PropertyTypeString('name', 'Name').setRequired().create(),
           new afStudio.wi.PropertyTypeString('url', 'Url').setRequired().create(),
           new afStudio.wi.PropertyTypeString('iconCls', 'Icon CSS class').create(),
           new afStudio.wi.PropertyTypeString('icon', 'Icon URL').create(),
           new afStudio.wi.PropertyTypeBoolean('forceSelection', 'Force selection').create(),
           new afStudio.wi.PropertyTypeBoolean('post', 'Post').create(),
           new afStudio.wi.PropertyTypeString('tooltip', 'Tooltip').create(),
           new afStudio.wi.PropertyTypeString('confirmMsg', 'Confirm message').create(),
           new afStudio.wi.PropertyTypeString('condition', 'Condition').create()
       ];

       this.addProperties(properties);
    }//eo createProperties
});