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
	
	/**
	 * @property {afStudio.console} console
	 */
	
	return {
		
		initAjaxRedirect: function() {			
			Ext.Ajax.on('requestcomplete', function(conn, xhr, opt) {
				var response = Ext.decode(xhr.responseText);				
				if (!Ext.isEmpty(response) && !Ext.isEmpty(response.redirect)) {
					location.href = response.redirect;
				}
			});
		}		
		
		,setConsole : function(content) {
			if(content){
				this.console.body.dom.innerHTML = content;
				this.console.body.scroll("bottom", 1000000, true );
			}
		}
		
		,updateConsole : function(content) {
			if (content) {
				this.console.body.dom.innerHTML += content;
				this.console.body.scroll("bottom", 1000000, true );
			}
		}
		
		,log : function(message, messageType) {
			messageType = messageType || false;
			
			Ext.Ajax.request({
				url: window.afStudioWSUrls.getNotificationsUrl(),
				method: 'POST',
				params: {
					cmd: 'set',
					message: message,
					messageType: messageType
				},
				callback: function(options, success, response) {				
					
					response = Ext.decode(response.responseText);
					
					if (!success) {
						Ext.Msg.alert('Failure','Server-side failure with status code: ' + response.status);
					}else{
						Ext.getCmp('console').loadNotifications();
					}					
				}
				
			});		
		}//eo log
		
		,getViewport : function() {
			return this.vp;
		}
		
		,getRecentProjects: function()
		{
			var recentProjects = Ext.decode(Ext.util.Cookies.get('appFlowerStudioRecentProjects')) || [];
						
			recentProject = recentProjects.reverse();
			
			return recentProjects;
		}
		
		,addCurrentProject: function()
		{
			var recentProjects = Ext.decode(Ext.util.Cookies.get('appFlowerStudioRecentProjects')) || [];
			
			Ext.Ajax.request({
			   url: window.afStudioWSUrls.getConfigureProjectUrl(),
			   success: function(response, opts) {
			      var response = Ext.decode(response.responseText);
			      var project = {};
			      project.text = response.data.name;
			      project.url = document.location.protocol+'//'+document.location.host+'/studio';			      
			      
			      if((recentProjects[recentProjects.length-1]&&recentProjects[recentProjects.length-1].url != project.url)||(!recentProjects[recentProjects.length-1]))
					{
						recentProjects.push(project);
					
						var expirationDate=new Date();
						expirationDate.setDate(expirationDate.getDate()+30);
					
						Ext.util.Cookies.set('appFlowerStudioRecentProjects',Ext.encode(recentProjects),expirationDate);
					}
			   }
			});
		}
		
		,showWidgetDesigner : function(widget, action, security) {
  			//FIXME should be used afStudio.vp.mask({region: 'center'}) or afStudio.vp.mask(), read the jsdocs
			var mask = new Ext.LoadMask(afStudio.vp.layout.center.panel.body, {msg: 'Loading, please Wait...', removeMask:true});
			mask.show();
			
			//FIXME should not pass mask in the component just to have ability to remove it in the component
			afStudio.vp.addToPortal({
				title: widget + ' Widget Designer',
				collapsible: false,
				draggable: false,
				layout: 'fit',
				items: [{
					xtype: 'afStudio.widgetDesigner',
					actionPath: action,
					securityPath: security,
	                widgetUri: widget,
					mask: mask
				}]
			}, true);
		}

		,init : function () { 
		    Ext.QuickTips.init();
		    Ext.apply(Ext.QuickTips.getQuickTip(), {
			    trackMouse: true
			});
			Ext.form.Field.prototype.msgTarget = 'side';
			
			this.initAjaxRedirect();
			
			this.tb = new afStudio.viewport.StudioToolbar();
			this.vp = new afStudio.viewport.StudioViewport();						  
			
			this.console = Ext.getCmp('console-console-tab');
			
			afApp.urlPrefix = '';
			GLOBAL_JS_VAR = GLOBAL_CSS_VAR = new Array();
			
			/**
			* this will add current project's url to the recent projects cookie
			*/
			this.addCurrentProject();
		}
	}
}();