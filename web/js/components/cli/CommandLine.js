Ext.namespace('afStudio.cli');

/**
 * CLI (Command Line Interface) components base class.
 * 
 * @class afStudio.cli.CommandLine
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.cli.CommandLine = Ext.extend(Ext.Panel, {
	
	/**
	 * @cfg {String} (Required) baseUrl
	 */		
	
	/**
	 * @cfg {Boolean} autoScroll (defaults to true) 
	 */
	autoScroll : true
			
	/**
	 * @cfg {String} bodyStyle (defaults to 'background-color: black; font-family: monospace; font-size: 11px; color: #88ff88;')
	 */
	,bodyStyle : 'background-color: black; font-family: monospace; font-size: 11px; color: #88ff88;'
	
	/**
	 * @property cliWrapper
	 * Container which wraps this cli component.
	 * @type {afStudio.cli.WindowWrapper}
	 */
	
	/**
	 * CLI tool constructor.
	 * @param {Object} config The configuration object.
	 */
	,constructor : function(config) {
		Ext.apply(this, config);
		
		afStudio.cli.CommandLine.superclass.constructor.call(this, config);
	}//eo constructor
	
	/**
	 * Ext Template method.
	 * @private
	 */
	,afterRender : function() {
		afStudio.cli.CommandLine.superclass.afterRender.call(this);
		
		this.cliWrapper = this.ownerCt;
		
		this.on({
			scope: this,
			afterrender: this.onCliAfterRender
		});
	}//eo afterRender
	
	/**
	 * Masking this CLI component
	 * @param {String} message The massage to show.
	 * @protected
	 */
	,maskCli : function(message) {
		this.el.mask(message ? message : 'loading...');
	}//eo maskCli
	
	/**
	 * Unmasking this CLI component
	 * @protected
	 */
	,unmaskCli : function() {
		this.el.unmask();
	}//eo unmaskCli
	
	/**
	 * Scrolls down cli component's body.
	 * @param {Number} (optional) distance How far to scroll the element in pixels.
	 * 					Defaults to 1000000 px.
	 */
	,scrollCliDown : function(distance) {
		distance = distance ? distance : 1000000;
		this.body.scroll("bottom", distance, true);
	}//eo scrollCliDown 
	
	/**
	 * Called when cli tool was rendered.
	 * afStudio.cli.CommandLine <u>afterrender</u> event listener 
	 * @protected
	 */
	,onCliAfterRender : Ext.emptyFn 
	
	/**
	 * Abstract method.
	 * Responsible for loading CLI component.
	 * @protected
	 */
	,loadCli : Ext.emptyFn
	
	,refreshCli : function() {
		this.loadCli();
	}
	
	/**
	 * Abstract method.
	 * Sets up CLI component.
	 * @protected
	 */
	,setCli : Ext.emptyFn
	
	/**
	 * Abstract method.
	 * Updates CLI component.
	 * @protected
	 */	
	,updateCli : Ext.emptyFn
	
	/**
	 * Abstract method.
	 * Clears CLI component.
	 * @protected
	 */	
	,clearCli : Ext.emptyFn
	
	/**
	 * Runs action 
	 * @protected
	 * 
	 * @param {Object} action:
	 * <ul>
	 * <li><b>url</b>: {String} (Required) The action URL.</li>
	 *    
	 * <li><b>params</b>: {Object} (Optional) ajax request parameters</li>
	 * 
	 * <li><b>run</b>: {Function} (Required) The action function to be run on success
	 * 			     	accepts result (response) object. Function accepts response parameter.
	 * </li>
	 *   
	 * <li><b>error</b>: {Function} (Optional) The error callback function</li>
	 *    
	 * <li><b>loadingMessage</b>: {String} (Optional) mask loading message</li>
	 *    
	 * <li><b>scope</b>: {Object} (Optional) The {@link #run}/{@link #error} callback functions execution context.
	 * 					 If it is not specified the default execution context is <tt>item's</tt> context. 
	 * </li>
	 * </ul>
	 */
	,executeAction : function(action) {
		var _this = this;		
		
		this.maskCli(action.loadingMessage ? action.loadingMessage : false);
		
		Ext.Ajax.request({
		   url: action.url,
		   
		   params: action.params,
		   
		   scope: action.scope ? action.scope : _this,
		   
		   success: function(xhr, opt) {
			   this.unmaskCli();
			   var response = Ext.decode(xhr.responseText);
			   
			   if (response.success) {
			   	   //runs action
			   	   Ext.util.Functions.createDelegate(action.run, this, [response], false)();
			       
			   } else {
			   	   //runs error action	
			   	   if (Ext.isFunction(action.error)) {
				   	   Ext.util.Functions.createDelegate(action.error, this, [response], false)();
			   	   }
			   	   var message = response.content || response.message || 'Operation was successfully processed!',
			   	       msgTitle = this.cliWrapper.title || '';
			   	   
			   	   afStudio.Msg.error(msgTitle, message);
			   }
		   },
		   
		   failure: function(xhr, opt) {
		   	   this.unmaskCli();
		   	   
			   if (Ext.isFunction(action.error)) {
			       Ext.util.Functions.createDelegate(action.error, this, [xhr], false)();
			   }
			   
			   var message = String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText),
			   	   msgTitle = String.format("Server Error {0}", this.cliWrapper.title || '');
		   	   afStudio.Msg.error(msgTitle, message);
		   }
		});
	}//eo executeAction
	
});