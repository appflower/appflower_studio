/**
 * Studio extension for {@link Ext.Ajax}.
 * 
 * @singleton
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.xhr = {
	
    /**
     * @property requestSucceed
     * Default request success notification message
     * @type String
     */
    requestSucceed : 'Request was successfully processed!',
    
    /**
     * @property requestFail
     * Default request fail notification message
     * @type String
     */
    requestFail : 'Error occured during action execution.',
    
    /**
     * Masks element|viewport during request processing.
     * @param {Mixed} mask
     */
    mask : function(mask) {
        if (Ext.isObject(mask) && mask.ctn) {
            var el = this.getMaskElement(mask.ctn);
            
            if (el) {
                el.mask(mask.msg ? mask.msg : 'loading...', 'x-mask-loading');
            }
            
        } else if (mask) {
            afStudio.vp.mask(mask);
        }
    },

    /**
     * Unmasks element|viewport after request processing.
     * @param {Mixed} mask
     */
    unmask : function(mask) {
        if (Ext.isObject(mask) && mask.ctn) {
            var el = this.getMaskElement(mask.ctn);
           
            if (el) {
                el.unmask();                
            }
            
        } else if (mask) {
            mask.region ? afStudio.vp.unmask(mask.region) : afStudio.vp.unmask(); 
        }           
    },
    
    /**
     * @protected
     * @param {String|HTMLElement|Ext.Component} el
     * @return {Ext.Element} masking element or null if was not found
     */
    getMaskElement : function(el) {
	   return (Ext.isString(el) || Ext.isElement(el)) ? ((Ext.isString(el) && Ext.getCmp(el)) ? Ext.getCmp(el).el : Ext.get(el)) 
	                                                 : ((el instanceof Ext.Component) ? el.getEl() : null);  
    },
    
	/**
	 * Executes XMLHttpRequest action.
     * Details {@link Ext.Ajax.request}.
	 * 
	 * @param {Object} action:
	 * <ul>
	 * <li><b>url</b>: {String} (Required) The action URL.</li>
	 *    
	 * <li><b>params</b>: {Object} (Optional) ajax request parameters</li>
	 * 
     * <li><b>message</b>: {String|Boolean} (Optional) Using as string - success notification message 
     *    more prioritized than response message, Boolean true means to show default notification if action.showNoteOnSuccess is true
     * </li>
     * 
	 * <li><b>showNoteOnSuccess</b>: {Boolean} (Optional) By default all actions are notified, 
     *    having "message" property setup or message|content properties going from response.
	 *    If showNoteOnSuccess = false notification message will not be shown on success.
	 * </li>
	 *     
     * <li><b>scope</b>: {Object} (Optional) The scope in which to execute the callbacks (run/error).
     *    If it is not specified the default execution context is <tt>afStudio.xhr</tt>. 
     * </li>
     *     
	 * <li><b>run</b>: {Function} (Optional) The success callback function.
	 * 	  The callback is passed the following parameters:
	 *    <ul>
	 *      <li>response: Decoded json object</li> 
	 *      <li>options: The parameter to the request call.</li>
	 *    </ul>
	 * </li>
	 *   
	 * <li><b>error</b>: {Function} (Optional) The error callback function
	 * 	  The callback is passed the following parameters:
	 *    <ul>
	 *      <li>response: Decoded json object</li> 
	 *      <li>options: The parameter to the request call.</li>
	 *    </ul> 
	 * </li>
	 * 
	 * <li><b>mask</b>: {Mixed} (Optional) Masking action processing.
	 *    By default masking is not activated. To activate masking the simplest way is to set it to <i>true</i>. Then the whole viewport will be masked.
	 *    You can set up masking passing in a string - the masking message or more precisely using masking object:
	 *      <ul>
	 *      	<li><i>msg</i>: {String} The masking message.</li>
	 *      	<li><i>region</i>: (Optional) {String} The masking region. Mask will be applied to the specified region.
	 *               Region can be one of the following: 'center', 'west', 'north', 'south'. 
	 *               By default the whole viewport is masked.       
	 *          </li>
     *          <li><i>ctn</i>: (Optional) {String|HTMLElement|Ext.Component} The masking element</li>
	 *      </ul>
	 * </li>
	 * 
	 * <li><b>logMessage</b>: {String} (Optional) The log message, if specified then an action will be logged with this message.</li>
	 * </ul>
	 */
	executeAction : function(action) {
		var me = this,
			showNoteOnSuccess = action.showNoteOnSuccess === false ? false : true;

        me.mask(action.mask);
        
        var requestObj = {
            url: action.url,
           
            params: action.params,
           
            scope: action.scope ? action.scope : me,
           
            //specified that the response object should be json
            jsonResponse: true,
            
            success: function(xhr, opt) {
                me.unmask(opt.mask);
                
                try {
                    var response = Ext.decode(xhr.responseText);
                } catch(e) {
                    return;
                }
                
                var message = opt.message || response.message || response.content || null;
                    
                message = (message === true) ? (response.success ? me.requestSucceed : me.requestFail) : message;
                
                if (response.success) {
                    //run success callback
                    if (Ext.isFunction(action.run)) {
                        Ext.util.Functions.createDelegate(action.run, this, [response, opt], false)();
                    }
                    //updates console if "console" property exists in response 
                    if (response.console) { 
                        afStudio.updateConsole(response.console);
                    }
                    //log action if required
                    if (action.logMessage) {
                        this.fireEvent("logmessage", this, action.logMessage);  
                    }
                    //show success message on demand
                    if (showNoteOnSuccess && !Ext.isEmpty(message)) {
                        afStudio.Msg.info(message);
                    }
                
                //something is wrong
                } else {
                    if (Ext.isFunction(action.error)) {
                        Ext.util.Functions.createDelegate(action.error, this, [response, opt], false)();
                    }      
                    afStudio.Msg.warning(message);
                }
            },
            //eo success
           
            failure: function(xhr, opt) {
                me.unmask(opt.mask);
               
                if (Ext.isFunction(action.error)) {
                    Ext.util.Functions.createDelegate(action.error, this, [xhr, opt], false)();
                }
                var message  = String.format('Status code: {0} <br /> Message: {1}', xhr.status, xhr.statusText || 'none'),
                    msgTitle = "Server communication failure";
                    
                afStudio.Msg.error(msgTitle, message);
            }
            //eo failure
        };
        
        Ext.applyIf(requestObj, action);
        
		Ext.Ajax.request(requestObj);
	}
	//eo executeAction
};