/**
 * @class 		afStudio.viewport.WestPanel
 * @extends		Ext.Panel
 * Creates west side panel and initializes Layouts, Models, Widgets, Plugins
 */
afStudio.viewport.WestPanel = Ext.extend(Ext.Panel, {
	/**
	 * Function initComponent
	 * Initializes config for the WestSide panel and creates needful components(Layouts, Models, Widgets, Plugins)
	 */
	initComponent: function(){
		//Handle global variables
		var name = afStudioUser.name || 'user';
		var username = afStudioUser.username || 'user';
		
		//Create config option
		var config = {
			id: "west_panel",
			title: "Navigation",
			region: "west",
			split: true,
			layout: "accordion",
			layoutConfig: { 
				animate: true 
			},
			width: 220,
			minWidth: 220,
			collapsible: true,
			activeItem: 'models',
			listeners: {
				afterlayout: {
					fn: function() {				
						var ai = this.layout.activeItem;
						ai.fireEvent('activate', ai);
					},
					single: true
				}
			},
			defaults: {
				border: false
			},
			items: [
			{
				id: 'models',
				xtype: 'afStudio.navigation.modelItem'
			},{
				id: 'layoutdesigner',
				xtype: 'afStudio.navigation.layoutItem'
			},{
				id: 'widgets',
				xtype: 'afStudio.navigation.widgetItem'
			},{
		    	id: 'plugins',
		    	xtype: 'afStudio.navigation.pluginItem'
		    },{
				id: "profile",
				title: "My Profile",
				autoScroll: true,
				iconCls: "user",
				html: "<div id='westpanel_link'>" +
						"<div style='background-color:#f8f8f8; border:1px solid #ddd;font-size:11px;'>" +
							"<b>Welcome, " + name + "</b><br>" +
							"Username: " + username + "<br>" +
							"<a href='#'>[Edit My Profile]</a>" +
						"</div>" +
					"</div>"
			}]
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.viewport.WestPanel.superclass.initComponent.apply(this, arguments);
		
		//Attach additional events
		this._initEvents();
	},
	
	/**
	 * Function onEditProfileLinkClick
	 * Shows user edit form
	 */
	onEditProfileLinkClick : function() {
		(new afStudio.UserWindow({mode: 'edit', username: afStudioUser.username})).show();
	},
	
	/**
	 * Function onProfilePanelShow
	 * Creates handler for the "Edit profile" link
	 * @param {Object} cmp - MyProfile panel
	 */
	onProfilePanelShow : function(cmp) {
		cmp.body.child('A').on('click', this.onEditProfileLinkClick, this);
	},
	
	/**
	 * Function _initEvents
	 * Attaches additional events to the component
	 */
	_initEvents : function() {
		Ext.getCmp('profile').on('afterrender', this.onProfilePanelShow, this);
	}
});