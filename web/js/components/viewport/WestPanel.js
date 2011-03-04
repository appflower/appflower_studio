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
		var name = userinfo.name || 'user';
		var username = userinfo.username || 'user';
		
		//Create config option
		var config = {
			id: "west_panel",
			region: "west",
			title: "Navigation",
			width: 220,
			minWidth: 220,
			split: true,
			layoutConfig: { 
				animate: true 
			},
			collapsible: true,
			layout: "accordion",
			listeners: {
				beforerender: function() {
					this.activeItem = this.findById("models")
				}
			},
			defaults: {
				border: false
			},
			items: [				
				new afStudio.models.treePanel({id:'models'}),
				new afStudio.navigation.LayoutItem({id:'layoutdesigner'}),
			    new afStudio.widgets.treePanel({id:'widgets'}),
			    new afStudio.plugins.treePanel({id:'plugins'}),			    
			    {
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
				}
			]
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
	onEditProfileLinkClick: function(){
		(new afStudio.UserWindow({mode: 'edit', username: userinfo.username})).show();
	},
	
	/**
	 * Function onProfilePanelShow
	 * Creates handler for the "Edit profile" link
	 * @param {Object} cmp - MyProfile panel
	 */
	onProfilePanelShow: function(cmp){
		cmp.body.child('A').on('click', this.onEditProfileLinkClick, this);
	},
	
	/**
	 * Function _initEvents
	 * Attaches additional events to the component
	 */
	_initEvents: function(){
		Ext.getCmp('profile').on('afterrender', this.onProfilePanelShow, this);
	}
});