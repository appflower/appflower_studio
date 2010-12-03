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
	        html:'<iframe style="height:100%;width:100%;" frameborder=0 src="http://www.appflower.com/docs/index.html"></iframe>',
			buttons: [
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Help.superclass.initComponent.apply(this, arguments);	

	},
	cancel:function(){
		this.close();
	}
});