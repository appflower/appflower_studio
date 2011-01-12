/**
 * Responsibilities:
 *  * fetch cocnrete widget definition from Server
 *  * initialize root node of WI tree
 *  * populate fetched values into already intialized Widget Inspector
 *  * save modified values back to server and handle any server side errors
 */
afStudio.widgetDesigner.WidgetDefinition = function(widgetUri, widgetType){
    this.widgetUri = widgetUri;
    if (widgetType) {
        this.widgetType = widgetType;
    }
};

afStudio.widgetDesigner.WidgetDefinition = Ext.extend(afStudio.widgetDesigner.WidgetDefinition, {
    widgetUri: null,
    definition: null,
    widgetType: null,
    rootNode: null,
    fetchAndConfigure: function(widgetInspector){
        Ext.Ajax.request({
            url: 'afsWidgetBuilder/getWidget?uri='+this.widgetUri,
            success: function(response){
                this.parseFetchedData(response);
                this.createRootNode();
                this.rootNode.configureFor(this.definition);
                if (widgetInspector) {
                    widgetInspector.setRootNode(this.rootNode);
                }
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
        this.widgetType = this.definition['type'];
    },
    save: function(){
        var data = this.rootNode.dumpDataForWidgetDefinition();

        Ext.Ajax.request({
            url: 'afsWidgetBuilder/saveWidget?uri='+this.widgetUri,
            params: {
                'data': Ext.util.JSON.encode(data),
                'widgetType': this.widgetType
            },
            success: function(response){
                this.parseSaveResponse(response);
            },
            scope: this
        });
   },
   parseSaveResponse: function(response){
        if (response.statusText != 'OK') {
            console.log('response looks invalid');
        }

        var actionResponse = Ext.util.JSON.decode(response.responseText);
        if (actionResponse.success !== true) {
            console.log('An error occured: '+actionResponse.message);
        } else {
            console.log(actionResponse.message);
        }
   },
   createRootNode: function(){
       switch (this.widgetType) {
           case 'list':
               this.rootNode = new afStudio.widgetDesigner.ListNode();
               break;
           case 'edit':
               this.rootNode = new afStudio.widgetDesigner.EditNode();
               break;
       }

       this.rootNode.setText(this.widgetUri);
   }

});