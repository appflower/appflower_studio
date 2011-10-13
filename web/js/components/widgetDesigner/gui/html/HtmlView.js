Ext.ns('afStudio.wd.html');

afStudio.wd.html.HtmlView = Ext.extend(Ext.FormPanel, {
	
	initComponent: function() {
		afStudio.wd.html.HtmlView.superclass.initComponent.apply(this, arguments);
		
		this.messageBox = new afStudio.layoutDesigner.view.ViewMessageBox({
			viewContainer: this,
			viewMessage: '<p>"Html" widget GUI is under development</p> <span style="font-size:10px;">You can work with widget, to see the results use "Preview" button.</span>'
		});			
		this.add(this.messageBox);
		
		this.on('afterlayout', function(){
			this.messageBox.onAfterRender();		
		}, this);
	}
	
});