Ext.BLANK_IMAGE_URL = '/appFlowerPlugin/extjs-3/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
Ext.ns('afStudio');

// application: afStudio
var afStudio = function () { 

	return {
		
		initAjaxRedirect: function() {			
			Ext.Ajax.on('requestcomplete', function(conn, xhr, opt) {
				var response = Ext.decode(xhr.responseText);				
				if (!Ext.isEmpty(response) && !Ext.isEmpty(response.redirect)) {
					location.href = response.redirect;
				}
			});
		}		
		
		,setConsole: function(content)
		{
			if(content)
			{
				this.console.body.dom.innerHTML = content;
				this.console.body.scroll("bottom", 1000000, true );
			}
		}
		
		,updateConsole: function(content)
		{
			if(content)
			{
				this.console.body.dom.innerHTML += content;
				this.console.body.scroll("bottom", 1000000, true );
			}
		}
		
		,log: function(message, messageType)
		{
			messageType = messageType || false;
			
			Ext.Ajax.request({
				url: '/appFlowerStudio/notifications',
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
					}					
				}
				
			});		
		}
				
		,init: function () { 
		    Ext.QuickTips.init();
		    Ext.apply(Ext.QuickTips.getQuickTip(), {
			    trackMouse: true
			});
			Ext.form.Field.prototype.msgTarget = 'side';
			
			this.initAjaxRedirect();
			
			this.tb=new afStudio.toolbar();
			this.tb.init();
			this.vp=new afStudio.viewport();
			
			this.console = Ext.getCmp('console-console-tab');
		}
	}
}();