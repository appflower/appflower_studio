Ext.namespace('afStudio.wi');

/**
 * BaseBehavior constructor.
 * 
 * This is base class for all behavior classes.
 * Behavior can be use by Node objects.
 * Behavior has the chance to add any properties to Node that is using it.
 * Behavior will also be able to react on those parameters change. *  
 * @constructor
 */
afStudio.wi.BaseBehavior = function() {
}

Ext.apply(afStudio.wi.BaseBehavior.prototype, {
	
    /**
     * This method should return properties objects that should be added to node.
     * @protected
     */
    createBehaviorProperties : function() {
        return [];
    },
    
    /**
     * Abstract method.
     * This method should configure node for given widgetData that was read from XML file
     * @protected
     * @param {Object} widgetData The widget metadata
     */
    configureFor : function(widgetData) {
    },
    
    /**
     * Abstract method.
     * If this is needed - this method should detect if some property value has changed
     * and do needed actions
     * @protected
     * @param {PropertyBaseType} property
     */
    propertyChanged : function(property) {
    },
    
    /**
     * this method gets attached node widgetData and it should modify it if needed
     * after any modifications it should return widgetData (with some values changed probably)
     * default implementation just returns widgetData without modifying it
     * @protected
     * @param {Object} nodeWidgetData The widget metadata for a concrete node
     * @return {Object} widget data for the node
     */
    dumpDataForWidgetDefinition : function(nodeWidgetData) {
		return nodeWidgetData;
	},
	
	/**
	 * Sets behavior for the concrete node.
	 * @protected
	 * @param {Ext.tree.TreeNode} node
	 */
    setNode : function(node) {
    	/**
    	 * @property node
    	 * @type {Ext.tree.TreeNode}
    	 */
        this.node = node;
    }
});
