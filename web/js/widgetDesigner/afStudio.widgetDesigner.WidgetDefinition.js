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
    definition: null,
    fetchAndConfigure: function(widgetTypeRootNode){
        Ext.Ajax.request({
            url: 'afsWidgetBuilder/getWidget?uri='+this.widgetUri,
            success: function(response){
                this.parseFetchedData(response);
                widgetTypeRootNode.configureFor(this.definition);
            },
            scope: this
        });
   },
   parseFetchedData: function(response){
        if (response.statusText != 'OK') {
            console.log('response looks invalid');
        }

        var baseData = Ext.util.JSON.decode(response.responseText);
        this.definition = Ext.util.JSON.decode(baseData.data);
    }

});