Ext.namespace('afStudio.viewport');

afStudio.viewport.StudioToolbar = Ext.extend(Ext.Toolbar, { 

	initComponent : function() {
			
		_self = this;
				
		var config = {
			items: [
			{
				text: "File",
				menu: {
					items: [
					{
						text: 'Project',
						listeners: {
							added: function(menuItem)
							{
								_self.setProjectMenu(menuItem);
							},
							activate: function(menuItem)
							{
								_self.setProjectMenu(menuItem);
							}
						}						
					},{
						text: 'Settings',
						handler: function(){
							(new afStudio.Settings()).show();
						}
					},'-',{
						text:'Help',
						handler:function(b,e){
							(new afStudio.Help()).show();
						}
					}]
				}
				
			},{
				text: 'Theme',
				menu: {
					items: [
					{
						text: 'Template Selector',
						handler: function(){
							(new afStudio.TemplateSelector()).show();
						}
					},{
						text: 'CSS Editor',
						handler: function (b, e) {
							(new afStudio.CssEditor()).show();
						}
					},{
						text: 'Toolbar Editor',
						handler: function (b, e) {
							(new afStudio.ToolbarEditor()).show();
						}
					}]
				}
			},{
				xtype: 'tbseparator'
			},{
				text: 'DB Query',
				iconCls: 'icon-dbquery',
				handler: function (b, e) {
					(new afStudio.dbQuery.QueryWindow()).show();
				}
			},
				/*{xtype: 'tbseparator'},
				{
					text:'Logs',
					iconCls: 'icon-logs',
					handler:function(b,e){
						(new afStudio.Logs()).show();
					}
				},
				*/
			{
				xtype: 'tbseparator'
			},{
				text: 'Users', 
				iconCls: 'icon-users',
				
				hidden: (is_visible_users)?false:true,
				
				handler: function(){
					(new afStudio.UsersList).show();
				}
			},{
				xtype: 'tbseparator'
			},{
				text: 'Run', 
				iconCls: 'icon-run', 
				handler: function() { alert('Run button pressed'); }
			},{
				xtype: 'tbseparator'
			},{
				text: 'Re-build', 
				iconCls: 'icon-rebuild', 
				handler: function() { alert('Re-build button pressed'); }
			},{
				xtype: "tbfill"
			},{
				text: "<img src=\"\/images\/famfamfam\/user_go.png\" border=\"0\">",
				handler: function () { window.location.href="/afsAuthorize/signout"; },
				tooltip: {
					text: "Click to log out", 
					title: "admin"
				}
			}]
		};
		
		//Ext.util.Observable.capture(this, function(e){console.info(e)});
		
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.viewport.StudioToolbar.superclass.initComponent.apply(this, arguments);
		
	}//eo initComponent
	
	/**
	 * Function setProjectMenu
	 * creates the project menu dynamically
	 */
	,setProjectMenu: function(menuItem)
	{
		var recentProjects = afStudio.getRecentProjects();
		_self = this;
		
		if(menuItem.menu)
		{
			menuItem.menu.removeAll();
		}
		else
		{	
			menuItem.menu = new Ext.menu.Menu();
		}	
		
		menuItem.menu.addMenuItem({
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
							});
							
		menuItem.menu.addMenuItem({
								text: 'Load project',
								handler: function (b,e)
								{
									//TODO: another name?
									(new afStudio.LoadProject()).show();
									
//									Ext.MessageBox.alert('Load project', 'Load project option')
								}
							});
				
				
		if(recentProjects.length>0)
		{
			menuItem.menu.addSeparator();			
			menuItem.menu.addMenuItem({
								text: 'Recent projects',
								menu: _self.getRecentProjectsMenu(recentProjects)
							});
		}
		
		menuItem.menu.doLayout();
	}
	/**
	 * Function getRecentProjectsMenu
	 * creates the recent projects menu dynamically
	 */
	,getRecentProjectsMenu: function(recentProjects){
		recentProjectsMenu = new Ext.menu.Menu();
		
		for(key in recentProjects)
		{
			if(recentProjects[key].url)
    		recentProjectsMenu.add({text: recentProjects[key].text, href: recentProjects[key].url});
		}
		
		return recentProjectsMenu;
	}
	
});

/**
 * @type 'afStudio.viewport.studioToolbar'
 */
Ext.reg('afStudio.viewport.studioToolbar', afStudio.viewport.StudioToolbar);