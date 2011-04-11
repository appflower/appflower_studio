/**
 * Responsibilities:
 *  * fetch cocnrete widget definition from Server
 *  * initialize root node of WI tree
 *  * populate fetched values into already intialized Widget Inspector
 *  * save modified values back to server and handle any server side errors
 *
 * When Widget is loaded from server there is 'datafetched' event emmited
 * In your handler for datafetched you should pass rootNode into WI ExtJS component
 *  
 * @class afStudio.widgetDesigner.WidgetDefinition
 * @extends Ext.util.Observable
 */
afStudio.widgetDesigner.WidgetDefinition = Ext.extend(Ext.util.Observable, {
	
	/**
	 * @cfg {String} (required) widgetUri
	 * Unique widget URI
	 */
    
    /**
     * @cfg {String} (optional) widgetType
     * Contains one of view's (widget's) types: <u>list, edit, show, html</u> 
     */
    
    /**
     * Widget definition object. Contains view's metadata
     * @property definition
     * @type {Object} 
     */
    
	/**
	 * WI root node reference. 
	 * @property rootNode
	 * @type {Ext.tree.TreeNode}
	 */
    
	/**
	 * WidgetDefinition constructor. 
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function(config) {
		config = config || {};
		Ext.apply(this, config);
		
	    this.addEvents(
			/**
			 * @event 'datafetched' Fires after view/widget definition data was loaded and parsed.
			 * @param {Ext.tree.TreeNode} WI root node for fetched definition data.
			 * @param {Object} view definition.
			 */    
	    	'datafetched'
	    );
	    
		afStudio.widgetDesigner.WidgetDefinition.superclass.constructor.call(this);		
	}//eo constructor	
	
    ,fetchAndConfigure : function() {
    	//TODO should be developed centrilised afStudio.Ajax package for all single ajax requests
    	//to make ajax request more simpler and handling/logging errors in one place
        Ext.Ajax.request({
            url: afStudioWSUrls.getGetWidgetUrl(this.widgetUri),
            scope: this,
            success: function(response) {
                this.parseFetchedData(response);
                this.createRootNode();
                this.rootNode.configureFor(this.definition);
                this.fireEvent('datafetched', this.rootNode, this.definition);
            },
            failure : function(xhr, reqOpt) {
			   var message = String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText);
			   afStudio.Msg.error('Server side error', message);	
            }
        });
	}//eo fetchAndConfigure
	
	,parseFetchedData : function(response) {		
        var baseData = Ext.util.JSON.decode(response.responseText);
        if (baseData.success) {
            this.definition = Ext.util.JSON.decode(baseData.data);
            this.widgetType = this.definition['type'];
        }
    }//eo parseFetchedData
    
	,save : function(widgetBuilderWindow, createNewWidget) {
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
                        widgetsTreePanel.loadRootNode();
                    }
                    widgetsTreePanel.addWidgetDesigner(this.widgetUri);
                }
            },
            failure: function(xhr, reqOpt) {
			   var message = String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText);
			   afStudio.Msg.error('Server side error', message);	
            },            
            scope: this
        });
   }//eo save
   
   ,parseSaveResponse : function(response) {
   		//Unmask parent tree
   		var tree = this.rootNode.getOwnerTree();
        if (tree) {
            tree.body.unmask();
        }   		
        var actionResponse = Ext.util.JSON.decode(response.responseText);
        if (actionResponse.success !== true) {
            afStudio.Msg.error('System Message', 'An error occured: ' + actionResponse.message);
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
   }//eo parseSaveResponse
   
   ,createRootNode : function() {
       switch (this.widgetType) {
           case 'list':
               this.rootNode = new afStudio.widgetDesigner.ListNode();
               break;
           case 'edit':
               this.rootNode = new afStudio.widgetDesigner.EditNode();
               break;
       }
       this.rootNode.setText(this.widgetUri + ' [' + this.widgetType + ']');
   }//eo createRootNode

});