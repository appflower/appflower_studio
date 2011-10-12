Ext.BLANK_IMAGE_URL = '/appFlowerPlugin/extjs-3/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.ns('afStudio');

var afStudio = function () {
	/**
	 * @property {afStudio.viewport.StudioToolbar} tb
	 * Studio toolbar
	 */	
	
	/**
	 * @property {afStudio.viewport.StudioViewport} vp
	 * Studio view port
	 */
	
	return {
		/**
		 * Adds <u>requestcomplete</u> listener to global {@link Ext.Ajax} request class.
		 * If XHR response is JSON and it contains <i>redirect</i> property - holding redirect URL 
		 * then browser is redirected to specified URL.
		 */
		initAjaxRequestComplete : function() {
			Ext.Ajax.on('requestcomplete', function(conn, xhr, opt) {
                var response;
				try {
					response = Ext.decode(xhr.responseText);
				} catch(e) {
					if (opt.jsonResponse) {
						afStudio.Msg.error('Response cannot be decoded', 
							String.format('<u>url</u>: <b>{0}</b> <br/>{1}', opt.url, xhr.responseText));
					}
					return;
				}
				if (!Ext.isEmpty(response) && !Ext.isEmpty(response.redirect)) {
					location.href = response.redirect;
				}
			});
		}
		//eo initAjaxRequestComplete
		
		/**
		 * Adds <u>exception</u> listener to {@link Ext.data.DataProxy} and handles it.
		 */
		,initDataProxyErrorsHandling : function() {
			var getMessage = function(obj) {
				var m = obj.message || obj.content || obj.msg || obj.errors;				
				return Ext.isArray(m) ? m.join('') : m;
			}
			
			Ext.data.DataProxy.on('exception', function(proxy, type, action, options, response, arg) {
				var message,
					title = String.format('Request Failed {0}', options.url);
				
				if (type == 'response') {
					var r = Ext.decode(response.responseText);
					if (response.status == 200) {
						message = getMessage(r) || 'The remote-request succeeded but the reader could not read the response';
					} else {
						message = String.format('Server side error <br/> status code: {0}, message: {1}', r.status, r.statusText || '---');
					}		
				} else {
					message = getMessage(response.raw);
				}
				
				afStudio.Msg.error(title, message);
			});						
		}//eo initDataProxyErrorsHandling
	
		/**
		 * Sets CLI console text.
		 * @param {String} content The content being set, it can as plain as well as html content. 
		 */
		,setConsole : function(content) {
			afStudio.cli.CommandLineMgr.setConsole(content);
		}
		
		/**
		 * Appends content to the end of the console CLI.
		 */
		,updateConsole : function(content) {
			afStudio.cli.CommandLineMgr.updateConsole(content);
		}
 
		/**
		 * Logs messages.
		 * @param {String} message The message being logged.
		 * @param {String} messageType The message type
		 */
		,log : function(message, messageType) {
			messageType = messageType || false;
			
			Ext.Ajax.request({
				url: afStudioWSUrls.getNotificationsUrl(),
				method: 'POST',
				params: {
					cmd: 'set',
					message: message,
					messageType: messageType
				},
				callback: function(options, success, response) {
					response = Ext.decode(response.responseText);					
					if (!success) {
						afStudio.Msg.error('Failure', 'Server-side failure with status code: ' + response.status);
					}
				}
			});		
		}//eo log
		
		/**
		 * Returns studio's viewport.
		 * @return {@link afStudio.viewport.StudioViewport} viewport
		 */
		,getViewport : function() {
			return this.vp;
		}
		
		,getRecentProjects : function() {
			var recentProjects = Ext.decode(Ext.util.Cookies.get('appFlowerStudioRecentProjects')) || [];
			
			recentProject = recentProjects.reverse();
			
			return recentProjects;
		}
		
		,addCurrentProject : function() {
			var recentProjects = Ext.decode(Ext.util.Cookies.get('appFlowerStudioRecentProjects')) || [];
			
			Ext.Ajax.request({
			   url: window.afStudioWSUrls.getConfigureProjectUrl(),
			   success: function(response, opts) {
			      var response = Ext.decode(response.responseText);
			      var project = {};
			      project.text = response.data.name;
			      project.url = response.data.url+'/studio';			      
			      
			      Ext.each(recentProjects, function(recentProject, index) {
				  		if(recentProject.url == project.url)
				  		{
				  			delete recentProjects[index];
				  		}
			      });
			      
			      recentProjects[recentProjects.length] = project;
					
				  var expirationDate=new Date();
				  expirationDate.setDate(expirationDate.getDate()+30);
					
				  Ext.util.Cookies.set('appFlowerStudioRecentProjects',Ext.encode(recentProjects),expirationDate,'/','');
			   }
			});
		}//eo addCurrentProject	
		
		/**
		 * Instantiates afStudio.
		 * Main method.
		 */
		,init : function () {
		    Ext.QuickTips.init();
		    Ext.apply(Ext.QuickTips.getQuickTip(), {
			    trackMouse: true
			});
			Ext.form.Field.prototype.msgTarget = 'side';
			
			this.initAjaxRequestComplete();
			this.initDataProxyErrorsHandling();
			
			//timeout 5 minutes
			Ext.Ajax.timeout = 300000;
			
			this.tb = new afStudio.viewport.StudioToolbar();
			this.vp = new afStudio.viewport.StudioViewport();						  
			
			afStudio.Cli.init();
			
			//set up logger mode
			afStudio.Logger.mode = afStudio.Logger.DEBUG;
			
			
			/**
			 * this will add current project's url to the recent projects cookie
			 */
			this.addCurrentProject();
			
			if (Ext.util.Cookies.get('appFlowerStudioDontShowWelcomePopup') != 'true') {
				new afStudio.Welcome().show();
			}			
		}//eo init
		                
        //user to create a slug from some content
        ,createSlug : function(slugcontent) {
		    // convert to lowercase (important: since on next step special chars are defined in lowercase only)
		    slugcontent = slugcontent.toLowerCase();
		    // convert special chars
		    var   accents = {a:/\u00e1/g,e:/u00e9/g,i:/\u00ed/g,o:/\u00f3/g,u:/\u00fa/g,n:/\u00f1/g};
		    for (var i in accents) slugcontent = slugcontent.replace(accents[i],i);
		
			var slugcontent_hyphens = slugcontent.replace(/\s/g,'-');
			var finishedslug = slugcontent_hyphens.replace(/[^a-zA-Z0-9\-\_]/g,'');
		    finishedslug = finishedslug.toLowerCase();
		    finishedslug = finishedslug.replace(/-+/g,'-');
			finishedslug = finishedslug.replace(/(^-)|(-$)/g,'');
		    return finishedslug;
        }
	}
}();


/**
 * @class Array
 */
Ext.applyIf(Array.prototype, {
	
	/**
	 * Drags up array's element.
	 * @param {Number} from The beginning position to drag from. 
	 * @param {Number} to The destination element position.
	 */
	dragUp : function(from, to) {
		if (from < to) {
			throw new RangeError('"dragUp": "from" index should be greater than "to"');
		}		
		var draggedEl = this[from];
		for (var i = 0, iterNum = from - to, j = from; i < iterNum; i++, j--) {
			this[j] = this[j-1];
		}
		this[to] = draggedEl;
	}//eo dragUp
	
	/**
	 * Drags down array's element.
	 * @param {Number} from The beginning position to drag from.
	 * @param {Number} to The destination element position.
	 */
	,dragDown : function(from, to) {
		if (from > to) {
			throw new RangeError('"dragDown": "from" index should be less than "to"');
		}		
		var draggedEl = this[from];
		for (var i = 0, iterNum = to - from, j = from; i < iterNum; i++, j++) {
			this[j] = this[j+1];
		}
		this[to] = draggedEl;
	}//eo dragDown
});

/**
 * @class String
 */
Ext.applyIf(String.prototype, {
	
	/**
	 * Makes a string's first character uppercase.
	 * @return {String} string with first letter in uppercase
	 */
	ucfirst : function() {
    	return this.substr(0, 1).toUpperCase() + this.substr(1);
	}	
	
	/**
	 * Checks if string value represents boolean <tt>true</tt> value.  
	 * Case insensitive. 
	 * @return {Boolean} true if string value equals to "true" otherwise false.
	 */
	,bool : function() {
		return (/^true$/i).test(this);
	}	
});
