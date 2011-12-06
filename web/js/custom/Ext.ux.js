Ext.override(Ext.BoxComponent, {
	initComponent : function() {
		Ext.BoxComponent.superclass.initComponent.apply(this, arguments);
		
		this.addEvents(
			'resize',
			
			'move',
			
			'logmessage'
		);
		
		this.on("logmessage", this.onLogMessage, this);
	},
	
	onLogMessage : function(cmp, message) {
		afStudio.log(message, "afStudioChange");
	} 
});