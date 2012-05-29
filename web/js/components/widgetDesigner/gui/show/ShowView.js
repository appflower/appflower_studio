Ext.ns('afStudio.wd.show');

afStudio.wd.show.ShowView = Ext.extend(Ext.FormPanel, {
	
	initComponent: function() {
		afStudio.wd.show.ShowView.superclass.initComponent.apply(this, arguments);
		
		this.messageBox = new afStudio.layoutDesigner.view.ViewMessageBox({
			viewContainer: this,
			viewMessage: '<p>"Show" widget GUI is under development</p> <span style="font-size:10px;">You can work with widget, to see the results use "Preview" button.</span>'
		});			
		this.add(this.messageBox);
	}
	
});