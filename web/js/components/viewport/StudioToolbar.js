Ext.namespace('afStudio.viewport');

afStudio.viewport.StudioToolbar = Ext.extend(Ext.Toolbar, { 

	/**
	 * ExtJS template method
	 * @private
	 */
	initComponent : function() {			
		_self = this;
				
		var config = {
			items: [
			{
				text: "Studio",
				iconCls: 'icon-studio',
				menu: {
					ignoreParentClicks: true,
					items: [
					{
						text: 'Project',
						iconCls: 'icon-studio-project',
						listeners: {
							added: function(menuItem) {
								_self.setProjectMenu(menuItem);
							},
							activate: function(menuItem) {
								_self.setProjectMenu(menuItem);
							}
						}
					},{
						text: 'Users', 
						iconCls: 'icon-users',				
						hidden: (is_visible_users) ? false : true,				
						handler: function() {
							(new afStudio.UsersList).show();
						}
					},{
						text: 'Settings',
						iconCls: 'icon-studio-settings',
						handler: function(){
							(new afStudio.Settings()).show();
						}
					},'-',{
						text:'Help',
						iconCls: 'icon-studio-help',
						handler:function(b,e){
							(new afStudio.Help()).show();
						}
					}]
				}
			},{
				text: 'Theme',
				iconCls: 'icon-theme',
				ignoreParentClicks: true,
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
				
				text: 'Tools',
				iconCls: 'icon-tools',
				menu: {
					items: [
					{
						text: 'Console',
						iconCls: 'icon-tools-console'
					},{
						text: 'DB Query',
						iconCls: 'icon-dbquery',
						handler: function (b, e) {
							(new afStudio.dbQuery.QueryWindow()).show();
						}
					},{
						text: 'Git'
					},{
						text: 'Snapshots'
					}]
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
				text: 'Debug',
				iconCls: 'icon-debug',
				menu: {
					items: [
					{
						text: 'AuditLog',
						iconCls: 'icon-notifications'
					},{
						text: 'Debug',
						iconCls: 'icon-debug-run'
					}]
				}
			},{
				text: 'Run',
				iconCls: 'icon-runs',
				menu: {
					items: [
					{
						text: 'Run',
						iconCls: 'icon-run-run',
						scope: _self,
						handler: _self.runProject
					},{
						text: 'Re-build', 
						iconCls: 'icon-run-rebuild', 
						handler: function() { 
							afStudio.Msg.info('Re-build button pressed'); 
						}
					}]
				}
			},{
				xtype: "tbfill"
			},{
				text: '<img src="/images/famfamfam/user_go.png" border="0">',
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
	,setProjectMenu: function(menuItem) {
		var recentProjects = afStudio.getRecentProjects();
		_self = this;
		

		if (menuItem.menu) {
			menuItem.menu.removeAll();
		} else {	
			menuItem.menu = new Ext.menu.Menu({
				ignoreParentClicks: true
			});
		}	
		
		menuItem.menu.addMenuItem({
			text: 'Create new project',
			iconCls: 'icon-studio-create-project',
			handler: function (b, e) {
				(new afStudio.CreateProject()).show();
			}
		});
							
		menuItem.menu.addMenuItem({
			text: 'Load project',
			iconCls: 'icon-studio-load-project',
			handler: function (b,e) {									
				(new afStudio.LoadProject()).show();
			}
		});
				
		if (recentProjects.length > 0) {
			menuItem.menu.addSeparator();			
			menuItem.menu.addMenuItem({
				text: 'Recent projects',
				iconCls: 'icon-studio-recent-projects',
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
	
	/**
	 * Runs projects commands and opens project in a new browser's tab
	 */
	,runProject : function() {	
		var runUrl = window.afStudioWSUrls.getProjectRunUrl();
		
		afStudio.vp.mask({
			msg: 'Run command...'
		});
		
		Ext.Ajax.request({
		   url: runUrl,
		   success: function(xhr, opt) {
			   afStudio.vp.unmask();
			   
			   var response = Ext.decode(xhr.responseText);
			   
			   if (response.success) {			   	
			   	   afStudio.updateConsole(response.content);
			   	   window.open(response.homepage, 'runProject');
			   } else {
			   	   Ext.Msg.alert('Failure', response.content);
			   }
		   }, 
		   failure: function(xhr, opt) {
		   	   afStudio.vp.unmask();
		       Ext.Msg.alert('Error', String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText));
		   }
		});
	}//eo runProject
	
});

/**
 * @type 'afStudio.viewport.studioToolbar'
 */
Ext.reg('afStudio.viewport.studioToolbar', afStudio.viewport.StudioToolbar);