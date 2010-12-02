afStudio.CssEditor = Ext.extend(Ext.Window, { 

	initComponent: function(){
		var config = {
			title: 'CSS Editor', width: 463,
			height: 250, closable: true,
	        draggable: true, 
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        layout: 'fit',
	        items: [],
			buttons: [
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.CssEditor.superclass.initComponent.apply(this, arguments);	
	},
	
	cancel:function(){
		this.close();
	}
});