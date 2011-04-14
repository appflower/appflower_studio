Ext.ns('afStudio.wd');

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
 * @class afStudio.wd.WidgetDefinition
 * @extends Ext.util.Observable
 */
afStudio.wd.WidgetDefinition = Ext.extend(Ext.util.Observable, {
	
	/**
	 * @cfg {String} (required) widgetUri
	 * Unique widget URI
	 */
    
	/**
	 * @cfg {String} widgetType
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
	    
		afStudio.wd.WidgetDefinition.superclass.constructor.call(this);		
	}//eo constructor	
	
    ,fetchDefinition : function(widgetUri) {
    	var _this = this;
    	
        Ext.Ajax.request({
            url: afStudioWSUrls.getGetWidgetUrl(this.widgetUri),
            success: function(xhr) {
		        var response = Ext.util.JSON.decode(xhr.responseText);
		        if (response.success) {
		            var definition = Ext.util.JSON.decode(response.data);
		            _this.fireEvent('datafetched', definition);
				} else {
					var msg = String.format('Fetching widget "{0}" data failed. <br/> {1}', response.message || 'server error');
					afStudio.Msg.error(msg);
				}
            },
            failure : function(xhr, reqOpt) {
			   var message = String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText);
			   afStudio.Msg.error('Server side error', message);	
            }
        });
	}//eo fetchDefinition
    
	,saveDefinition : function(definition, callback, createNewWidget) {
        var _this = this,
		definition = Ext.util.JSON.encode(definition);
		
        Ext.Ajax.request({
            url: afStudioWSUrls.getSaveWidgetUrl(this.widgetUri),
            params: {
                data: definition,
                widgetType: this.widgetType,
                createNewWidget: createNewWidget ? true : false
            },
            success: function(xhr) {
				var response = Ext.decode(xhr.responseText);				
				if (response.success) {
					afStudio.Msg.info(response.message);
					if (Ext.isFunction(callback)) {
						callback(response);	
					}
				} else {
					afStudio.Msg.error(response.message);					
				}
            },
            failure: function(xhr, reqOpt) {
			   var message = String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText);
			   afStudio.Msg.error('Server side error', message);	
            }
        });
   }//eo saveDefinition

});