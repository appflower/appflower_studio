/**
 * This is base class for all behavior classes
 * Behavior can be use by Node objects
 * Behavior has the chance to add any properties to Node that is using it
 * Behavior will also be able to react on those parameters change
 **/
Ext.namespace('afStudio.widgetDesigner');
afStudio.widgetDesigner.BaseBehavior = function(){
}
Ext.apply(afStudio.widgetDesigner.BaseBehavior.prototype, {
    /**
     * this method should return properties objects that should be added to node
     */
    createBehaviorProperties: function() {
        return [];
    },
    /**
     * this method should configure node for given widgetData that was read from XML file
     */
    configureFor: function(widgetData) {
    },
    /**
     * If this is needed - this method should detect if some property value has changed
     * and do needed actions
     */
    propertyChanged: function(property){
    },
    /**
     * this method gets attached node widgetData and it should modify it if needed
     * after any modifications it should return widgetData (with some values changed probably)
     * default implementation just returns widgetData without modifying it
     */
    dumpDataForWidgetDefinition: function(nodeWidgetData){
        return nodeWidgetData;
    },
    setNode: function(node) {
        this.node = node;
    }
});
