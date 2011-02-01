/**
 * This is base class for all behavior classes
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
    configureFor: function(node, widgetData) {
    },
    /**
     * If this is needed - this method should detect if some property value has changed
     * and do needed actions
     */
    propertyChanged: function(node, property){
    },
    /**
     * this method gets attached node widgetData and it should modify it if needed
     * after any modifications it should return widgetData (with some values changed probably)
     */
    dumpDataForWidgetDefinition: function(node, nodeWidgetData){}
});
