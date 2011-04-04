/**
 * Responsibilities:
 *  * fetch cocnrete widget definition from Server
 *  * initialize root node of WI tree
 *  * populate fetched values into already intialized Widget Inspector
 *  * save modified values back to server and handle any server side errors
 *
 * When Widget is loaded from server there is 'datafetched' event emmited
 * In your handler for datafetched you should pass rootNode into WI ExtJS component
 */
afStudio.widgetDesigner.WidgetDefinition = function(widgetUri, widgetType){
    this.widgetUri = widgetUri;
    if (widgetType) {
        this.widgetType = widgetType;
    }
    this.addEvents('datafetched');
};

afStudio.widgetDesigner.WidgetDefinition = Ext.extend(afStudio.widgetDesigner.WidgetDefinition, Ext.util.Observable, {
    widgetUri: null,
    definition: null,
    widgetType: null,
    rootNode: null,
    fetchAndConfigure: function(){
        Ext.Ajax.request({
            url: window.afStudioWSUrls.getGetWidgetUrl(this.widgetUri),
            success: function(response){
                this.parseFetchedData(response);
                this.createRootNode();
                this.rootNode.configureFor(this.definition);
                this.fireEvent('datafetched', this.rootNode, this.definition);
            },
            scope: this
        });
   },
   parseFetchedData: function(response){
        if (response.statusText != 'OK') {
            afStudio.Msg.warning('response looks invalid');
        }
        var baseData = Ext.util.JSON.decode(response.responseText);
        if (baseData.success) {
            this.definition = Ext.util.JSON.decode(baseData.data);
            this.widgetType = this.definition['type'];
        }
    },
    save: function(widgetBuilderWindow, createNewWidget){
        var data = this.rootNode.dumpDataForWidgetDefinition();

        Ext.Ajax.request({
            url: window.afStudioWSUrls.getSaveWidgetUrl(this.widgetUri),
            params: {
                'data': Ext.util.JSON.encode(data),
                'widgetType': this.widgetType,
                'createNewWidget': createNewWidget ? true : false
            },
            success: function(response){
                if (this.parseSaveResponse(response)) {
                    var widgetsTreePanel = afStudio.getWidgetsTreePanel();
                    if (widgetBuilderWindow) {
                        widgetBuilderWindow.close();
                        widgetsTreePanel.reloadTree()
                    }
                    widgetsTreePanel.addWidgetDesigner(this.widgetUri);
                }

            },
            scope: this
        });
   },
   
   parseSaveResponse: function(response){
   		//Unmask parent tree
   		var tree = this.rootNode.getOwnerTree()
        if (tree) {
            tree.body.unmask();
        }
   		
        if (response.statusText != 'OK') {
            afStudio.Msg.error('System Message', 'Response looks invalid');
        }

        var actionResponse = Ext.util.JSON.decode(response.responseText);
        if (actionResponse.success !== true) {
            afStudio.Msg.error('System Message', 'An error occured: '+actionResponse.message);
        } else {
            afStudio.Msg.info('System Message', actionResponse.message);
        }

        //Reload Widget inspector tree
        if (tree && actionResponse.success === true) {
            tree.fireEvent('afterrender', tree);
            return true;
        } else if (actionResponse.success === true) {
            afStudio.showWidgetDesigner(this.widgetUri);
            return true;
        }

        return false;
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

       this.rootNode.setText(this.widgetUri+' ['+this.widgetType+']');
   }

});