Ext.ns('afStudio');

afStudio.toolbar = Ext.extend(Ext.Toolbar, { 

	initComponent: function(){
		
		var config = {
			id: "toolbar",
			items: [
				{
					text: "File",
					menu: {
						items: [
							{ 
								text: "Model",
								menu: {
									items: [
										{
											text: "Add",
											handler: function (b,e)
											{
												
											}
										},
										{
											text: "Refresh",
											handler: function (b,e)
											{
												afStudio.vp.layout.west.items[0].root.reload();
											}
										}
									]
								}
							},
							{ 
								text: "Module",
								menu: {
									items: [
										{
											text: "Add",
											handler: function (b,e)
											{
												
											}
										},
										{
											text: "Refresh",
											handler: function (b,e)
											{
												
											}
										}
									]
								}
							},
							{
								text: 'New button',
								menu: {
									items: [
										{
											text: 'Create new project',
											handler: function (b,e)
											{
												var form = new Ext.FormPanel({
												    url: '', defaultType: 'textfield', width: 450, frame: true, 
													labelWidth: 100, title: false,
													items: [
														{xtype:'textfield', fieldLabel: 'Project name', anchor: '96%', name: 'project_name', allowBlank: false},
														{xtype:'textfield', fieldLabel: 'Path to prohect', anchor: '96%', name: 'project_path', allowBlank: false}
													]
												});
														
												var wnd = new Ext.Window({
													title: 'Create new project', width: 463,
													autoHeight: true, closable: true,
										            draggable: true, plain:true,
										            modal: true, resizable: false,
										            bodyBorder: false, border: false,
										            items: form,
													buttons: [
														{text: 'Create project'},
														{text: 'Cancel', handler: function(){wnd.close}}
													],
													buttonAlign: 'center'
												});
												wnd.show()												
											}
										},
										{
											text: 'Load project',
											handler: function (b,e)
											{
												Ext.MessageBox.alert('Load project', 'Load project option')
											}
										},
										{
											text: 'Save project',
											handler: function (b,e)
											{
												Ext.MessageBox.alert('Save project', 'Save project option')
											}
										}										
									]
								}
							}
						]
					}
				},
				{
					text: 'Widget Designer',
					handler: function (b, e) {
						afStudio.vp.addToPortal({
							title: 'Widget Designer',
							collapsible: false,
							draggable: false,
							items: [{
								xtype: 'afStudio.widgetDesigner'
							}]
						}, true);	
					}
				},
				
				{
					text: 'Database Connection Settings',
					handler: function (b, e) {
						var dcs = new afStudio.databaseConnectionSettings();
					}
				},				
				
				{
					xtype: "tbfill"
				},
				{
					text: "<img src=\"\/images\/famfamfam\/user_go.png\" border=\"0\">",
					handler: function () { window.location.href="/logout"; },
					tooltip: { text: "Click to log out",
					title: "admin" }
				}
			]
		};
		
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.toolbar.superclass.initComponent.apply(this, arguments);	
	},	
	init: function ()
	{
		this.render(document.body);
	}
});