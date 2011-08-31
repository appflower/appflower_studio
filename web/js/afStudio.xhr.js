/**
 * Studio's extension for XMLHttpRequest.
 * 
 * @singleton
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.xhr = {	
	
	/**
	 * Executes XMLHttpRequest action.  
	 * 
	 * @param {Object} action:
	 * <ul>
	 * <li><b>url</b>: {String} (Required) The action URL.</li>
	 *    
	 * <li><b>params</b>: {Object} (Optional) ajax request parameters</li>
	 * 
	 * <li><b>showNoteOnSuccess</b>: {Boolean} (Optional) By default all actions are notified.
	 *    If showNoteOnSuccess = false notification message will not be shown on success.
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
	 *    You can set up masking passing in a string - the masking message or more precisely using making object:
	 *      <ul>
	 *      	<li><i>msg</i>: (Optional) The masking message.</li>
	 *      	<li><i>region</i>: The masking region. Mask will be applied to the specified region.
	 *               Region can be one of the following: 'center', 'west', 'north', 'south'.          
	 *          </li>
	 *      </ul>
	 * </li>
	 * 
	 * <li><b>logMessage</b>: {String} (Optional) The log message, if specified then an action will be logged with this message.</li>
	 *    
	 * <li><b>scope</b>: {Object} (Optional) The scope in which to execute the callbacks (run/error).
	 * 	  If it is not specified the default execution context is <tt>afStudio.xhr</tt>. 
	 * </li>
	 * </ul>
	 */
	executeAction : function(action) {
		var _this = this,
			showNoteOnSuccess = action.showNoteOnSuccess === false ? false : true;

		if (action.mask) {			
			afStudio.vp.mask(action.mask);
		}
		
		var unmask = function () {
	   		if (action.mask) {
	   			action.mask.region ? afStudio.vp.unmask(action.mask.region) : afStudio.vp.unmask(); 
	   		}			
		};
		
		Ext.Ajax.request({
			url: action.url,
		   
			params: action.params,
		   
			scope: action.scope ? action.scope : _this,
		   
			success: function(xhr, opt) {
		   		unmask();
		   		
				var response = Ext.decode(xhr.responseText),
					message  = response.message || response.content 
					|| (response.success ? 'Operation was successfully processed!' : 'Error occured during action execution.');
			   
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
					if (showNoteOnSuccess) {
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
		   		unmask();
		   	   
				if (Ext.isFunction(action.error)) {
					Ext.util.Functions.createDelegate(action.error, this, [xhr, opt], false)();
				}
				var message  = String.format('Status code: {0} <br /> Message: {1}', xhr.status, xhr.statusText || 'none'),
					msgTitle = "Server communication failure";
					
				afStudio.Msg.error(msgTitle, message);
			}
		   //eo failure
		});
	}
	//eo executeAction
	
	//TODO add supporting of all Ext.Ajax.request parameters
	//TODO add success message instead using of server-side msg
	//TODO add masking container - mask: {ctn: String|Ext.Element|Container}
};