/**
 * Responsibilities:
 *  * fetch cocnrete widget definition from Server
 *  * populate fetched values into already intialized Widget Inspector
 *  * save modified values back to server and handle any server side errors
 */
afStudio.widgetDesigner.WidgetDefinition = function(widgetUri){
    this.widgetUri = widgetUri;
};

afStudio.widgetDesigner.WidgetDefinition = Ext.extend(afStudio.widgetDesigner.WidgetDefinition, {
   widgetUri: null,
   fetch: function(){
       console.log('fetching widget data from server for uri:'+this.widgetUri);
   }
});