Ext.ns('afStudio.wd');

/**
 * Responsibilities:
 * <ul>
 *  <li>fetch cocnrete widget definition from Server</li>
 *  <li>save modified values back to server and handle any server side errors</li>
 * </ul>
 * When Widget is loaded from server there is 'datafetched' event emmited
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
			 * @param {Object} view definition.
			 */    
	    	'datafetched',
	    	
	    	/**
	    	 * @event 'fetchingexception' Fires after server response and if <u>success</u> response property is <b>false</b>.
	    	 * @param {Object} response.
	    	 */
	    	'fetchingexception'
	    );
	    
		afStudio.wd.WidgetDefinition.superclass.constructor.call(this);		
	}//eo constructor	
	
	/**
	 * 
	 * @param {Object} options The fetching object which may contain the following properties:
	 * <ul>
	 *   <li><b>success</b>: (Optional) {Function} The function is called on success of the fetching request.
	 *   	 				 To the function is passed just fetched view defintion object.</li>
	 *   <li><b>error</b>: (Optional) {Function} The function is called <u>success</u> property of the response is false.</li>
	 *   <li><b>scope</b>: (Optional) The execution context (scope) of success and error functions. Default is WidgetDefinition scope.</li>
	 * </ul>
	 */
    ,fetchDefinition : function(options) {
    	var _this = this;
    	
        Ext.Ajax.request({
            url: afStudioWSUrls.getGetWidgetUrl(this.widgetUri),
            
            scope: options.scope ? options.scope : _this,
            
            success: function(xhr) {
		        var response = Ext.util.JSON.decode(xhr.responseText);
		        if (response.success) {
		            var definition = Ext.util.JSON.decode(response.data);
		            
		            if (Ext.isFunction(options.success)) {
		            	Ext.util.Functions.createDelegate(options.success, this, [definition], false)();
		            }
		            _this.fireEvent('datafetched', definition);
				} else {
		            if (Ext.isFunction(options.error)) {
		            	Ext.util.Functions.createDelegate(options.error, this, [response], false)();
		            }
					_this.fireEvent('fetchingexception', response);
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