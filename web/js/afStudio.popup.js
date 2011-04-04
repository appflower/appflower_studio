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
			title: 'Welcome to AppFlower Studio', width:810,height:520,
			closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: true,
	        bodyBorder: false, border: false,
	        html: '<div id="welcome-box"> </div>',
	        buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Help.superclass.initComponent.apply(this, arguments);
		
		this.getHtmlData();
	},
	
	getHtmlData: function(){
		Ext.Ajax.request({
		   url: window.afStudioWSUrls.buildUrlFor('/appFlowerStudio/Welcome'),
		   failure: function ( result, request) {
				var obj = Ext.decode(result.responseText);
				Ext.MessageBox.alert('Failed', result.responseText); 
		   },
		   success: function ( result, request) {
			   var obj = Ext.decode(result.responseText);
			   Ext.get('welcome-box').update(obj.message);
		   }
		});

	},
	
});