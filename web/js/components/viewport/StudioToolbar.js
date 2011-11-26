Ext.namespace('afStudio.viewport');

afStudio.viewport.StudioToolbar = Ext.extend(Ext.Toolbar, { 

	/**
	 * ExtJS template method
	 * @private
	 */
	initComponent : function() {			
		var _self = this;
				
		var config = {
			items: [
			{
				id: 'mstudio',
				text: "Studio BETA",
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
						hidden: (afStudioUser.is_admin) ? false : true,				
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
				text: 'Theme Designer',
				iconCls: 'icon-theme',
				handler: function(){
					(new afStudio.Theme()).show();
			    }
			},{
				
				text: 'Tools',
				iconCls: 'icon-tools',
				menu: {
					items: [
					{
						text: 'Console',
						iconCls: 'icon-tools-console',
						handler: function() {
							afStudio.Cli.showConsole();
						}
					},{
						text: 'DB Query',
						iconCls: 'icon-data',
						handler: function (b, e) {
							(new afStudio.dbQuery.QueryWindow()).show();
						}
					},{
						text: 'Code Browser',
						iconCls: 'icon-code-editor',
						handler: function (b, e) {
							(new afStudio.CodeEditor()).show();
						}
					}
					/*
					For the future release.  
					{
						text: 'Git',
						iconCls: 'icon-tools-git'
					},{
						text: 'Snapshots',
						iconCls: 'icon-tools-snapshot'
					}*/]
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
						iconCls: 'icon-debug-auditlog',
						handler: function() {
							afStudio.Cli.showAuditLog();
						}
					},{
						text: 'Debug',
						iconCls: 'icon-debug-run',
						handler: function() {
							afStudio.Cli.showDebug();
						}
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
					}
					/*{
						text: 'Re-build', 
						iconCls: 'icon-run-rebuild', 
						handler: function() { 
							afStudio.Msg.info('Re-build button pressed'); 
						}
					}*/]
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
		var _self = this;
		

		if (menuItem.menu) {
			menuItem.menu.removeAll();
		} else {	
			menuItem.menu = new Ext.menu.Menu({
				ignoreParentClicks: true
			});
		}	
		if (afStudioProjectsManagementEnabled) {
            menuItem.menu.addMenuItem({
                text: 'Create new project',
                iconCls: 'icon-studio-create-project',
                handler: function (b, e) {
                    Ext.Ajax.request({
                        url: Ext.urlAppend(afStudioWSUrls.project, Ext.urlEncode({cmd: 'checkConfig'})),
                        success: function(result){
                            var obj = Ext.decode(result.responseText);
                            if (obj.success) {
                                (new afStudio.CreateProjectWizard(obj['dataset'])).show();
                            } else {
                                afStudio.Msg.error('Sorry but your local environment looks like not configured for "Create New Project" functionality to work');
                            }
                        }
                    });
                }
            });
        }
		
		menuItem.menu.addMenuItem({
			text: 'Export project',
			iconCls: 'icon-studio-export-project',
			menu: {
				ignoreParentClicks: true,
				items: [
				{
					text: 'Sources',
					iconCls: 'icon-studio-export-project-source',
					handler: function() {
						var url = Ext.urlAppend(afStudioWSUrls.exportUrl, Ext.urlEncode({type: 'project'}));
						window.open(url, 'export-win');
					}
				},{
					text: 'DB',
					iconCls: 'icon-studio-export-project-sql',
					menu: {
						items: [
						{
							text: 'structure',
							iconCls: 'icon-studio-export-project-sql',
							handler: function (b, e) {
								var url = Ext.urlAppend(afStudioWSUrls.exportUrl, Ext.urlEncode({type: 'db'}));
								window.open(url, 'export-win');
							}
						},{
							text: 'structure + data (for mysql)',
							iconCls: 'icon-studio-export-project-sql',
							handler: function (b, e) {
								var url = Ext.urlAppend(afStudioWSUrls.exportUrl, Ext.urlEncode({by_os: true, type: 'db'}));
								window.open(url, 'export-win');
							}
						}]
					}
				}]
			}
		});
        if (afStudioProjectsManagementEnabled) {
            var recentProjects = afStudio.getRecentProjects();
            if (recentProjects.length > 0) {
                menuItem.menu.addSeparator();			
                menuItem.menu.addMenuItem({
                    text: 'Recent projects',
                    iconCls: 'icon-studio-recent-projects',
                    menu: _self.getRecentProjectsMenu(recentProjects)
                });
            }
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
		var runUrl = Ext.urlAppend(afStudioWSUrls.project, Ext.urlEncode({cmd: 'run'}));
		
		afStudio.xhr.executeAction({
			url: runUrl,
			mask: {msg: 'Run command...'},
			showNoteOnSuccess: false,
			run: function(response){
				window.open(response.query, 'runProject');
			}
		});
	}
});

/**
 * @type 'afStudio.viewport.studioToolbar'
 */
Ext.reg('afStudio.viewport.studioToolbar', afStudio.viewport.StudioToolbar);