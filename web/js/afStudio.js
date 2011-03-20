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
		
		initAjaxRedirect : function() {			
			Ext.Ajax.on('requestcomplete', function(conn, xhr, opt) {
				var response = Ext.decode(xhr.responseText);				
				if (!Ext.isEmpty(response) && !Ext.isEmpty(response.redirect)) {
					location.href = response.redirect;
				}
			});
		}		
		
		,setConsole : function(content) {
			if (content) {
				this.console.body.dom.innerHTML = content;
				this.console.body.scroll("bottom", 1000000, true);
			}
		}
		
		,updateConsole : function(content) {
			if (content) {
				this.console.body.dom.innerHTML += content;
				this.console.body.scroll("bottom", 1000000, true);
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
			
			//timeout 5 minutes
			Ext.Ajax.timeout = 300000;
			
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
		
        ,getWidgetsTreePanel: function() {
            var components = this.vp.findByType('afStudio.widgets.treePanel');
            if (components.length > 0) {
                return components[0];
            }
        }
        
        ,getWidgetInspector: function() {
            var components = this.vp.findByType('afStudio.widgetDesigner.inspector');
            if (components.length > 0) {
                return components[0];
            }
        }
        //user to create a slug from some content
        ,createSlug: function(slugcontent)
        {
		    // convert to lowercase (important: since on next step special chars are defined in lowercase only)
		    slugcontent = slugcontent.toLowerCase();
		    // convert special chars
		    var   accents={a:/\u00e1/g,e:/u00e9/g,i:/\u00ed/g,o:/\u00f3/g,u:/\u00fa/g,n:/\u00f1/g}
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