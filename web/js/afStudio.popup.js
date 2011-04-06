afStudio.Logs = Ext.extend(Ext.Window, { 
	form: null,
	initComponent: function(){
		var config = {
			title: 'Logs', width: 463,
			autoHeight: true, closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
			buttons: [
				{text: 'Save',  scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Logs.superclass.initComponent.apply(this, arguments);	

	},
	cancel:function(){
		this.close();
	}
});

afStudio.Help = Ext.extend(Ext.Window, { 
	form: null,
	initComponent: function(){
		var config = {
			title: 'Help', width:720,height:600,
			closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        html:'<iframe style="height:100%;width:100%;" frameborder=0 src="http://www.appflower.com/docs/index.html" id="help-iframe"></iframe>',
			buttons: [
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Help.superclass.initComponent.apply(this, arguments);	
		this._initEvents();
	},
	
	/**
	 * Function _initEvents
	 * Initialize events
	 */
	_initEvents: function(){
		this.on('show', function(cmp){
			Ext.get('help-iframe').on('load', function(){
				cmp.body.unmask()
			});
		 	(function(){
				 	cmp.body.mask('Loading, please Wait...', 'x-mask-loading');
				 	
		 	}).defer(100);
		})
	},
	
	/**
	 * Function cancel
	 * Closes window
	 */
	cancel:function(){
		this.close();
	}
});

afStudio.Welcome = Ext.extend(Ext.Window, { 
	form: null,
	initComponent: function(){
		
		var config = {
			title: 'Welcome to AppFlower Studio', width:810,height:545,
			closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        html: '<div id="welcome-box"> </div>',
	        buttonAlign: 'left',
	        buttons: [{ xtype:'checkbox',
	    	            boxLabel:'Do not show this popup next time',
	    	            handler:  function(f,c){
	        				if (c) {
	        					Ext.util.Cookies.set("appFlowerStudioDontShowWelcomePopup", "true", new Date('12/22/2099'));
	        				} else {
	        					Ext.util.Cookies.set("appFlowerStudioDontShowWelcomePopup", "");
	        				}
	        			}
	        }]
	    	         
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Help.superclass.initComponent.apply(this, arguments);
		
		this.getHtmlData();
	},
	
	getHtmlData : function() {
		var popupWindow = this;
		
		Ext.Ajax.request({
		   url: afStudioWSUrls.buildUrlFor('/appFlowerStudio/Welcome'),
		   failure: function (xhr, request) {
			   var message = String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText);
			   afStudio.Msg.error('Server side error', message);
		   },
		   success: function (result, request) {
			   var obj = Ext.decode(result.responseText);
			   Ext.get('welcome-box').update(obj.message);
			   jQuery("a[rel^='prettyPhoto']").prettyPhoto();
			   
			   setTimeout(function() {jQuery('#studio_video_tours ul').jScrollPane()} , 500); // requred for firefox
			   
			   Ext.get('create-project').on('click',  function(){  
				   popupWindow.close();
				   (new afStudio.CreateProject()).show();
			   }, this);
			   Ext.get('open-project').on('click',  function(){  
				   popupWindow.close();
				   (new afStudio.LoadProject()).show(); 
			   }, this);
			   Ext.get('start-welcome-popup').on('click',  function(){  
				   popupWindow.close();
			   }, this);
		   }
		});

	}
	
});