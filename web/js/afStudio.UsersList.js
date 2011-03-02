/**
 * Users List
 * @class afStudio.UsersList
 * @extends Ext.Window
 * @author PavelK
 */
afStudio.UsersList = Ext.extend(Ext.Window, { 

	/**
	 * initComponent method
	 * ExtJS template method
	 * @private
	 */
	initComponent: function(){
		this.createUserGrid();
		var config = {
			title: 'Users Management', width: 813,
			layout: 'fit',
			height: 550, closable: true,
	        draggable: true, 
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        items: [this.usersGrid],
			buttons: [
				{text: 'Create user', handler: this.showDialog.createDelegate(this, ['add']), scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.UsersList.superclass.initComponent.apply(this, arguments);
		
		this._initEvents();
	},

	/**
	 * Shows confirm message and runs delete request 
	 * @param {Event} event
	 * @param {Element} target
	 */
	onUserDelete: function(e, t){
		var grid = Ext.getCmp('manage-users-grid');
		var username = t.getAttribute('username');
		if(username){
			var fn = function(btn){
				if('yes' == btn){
					//Send delete request
					Ext.Ajax.request({
						url: 'afsUserManager/delete',
						params: {
							username: username
						},
						
						callback: function(options, success, response) {				
							response = Ext.decode(response.responseText);
							if (!success) {
								Ext.Msg.alert('Failure','Server-side failure with status code: ' + response.status);
							}else{
								Ext.Msg.alert('System Message', 'User was successfully deleted');
								grid.getStore().load();
							}
						}
					});
				}
			}
			Ext.Msg.confirm('Delete user', 'Are you sure want delete selecetd user?', fn);
		}
	},

	/**
	 * Creates Edit dialog 
	 * @param {Event} event
	 * @param {Element} target
	 */	
	onUserEdit: function(e, t){
		var username = t.getAttribute('username');
		if(username){
			Ext.Ajax.request({
				url: 'afsUserManager/get',
				params: {
					username: username
				},
				
				callback: function(options, success, response) {				
					response = Ext.decode(response.responseText);
					if (!success) {
						Ext.Msg.alert('Failure','Server-side failure with status code: ' + response.status);
					}else{
						Ext.getCmp('manage-users-grid').showDialog('edit', response);
					}
				}
			});
		}
	},
	
	/**
	 * Shows user mange window
	 * @param {String} mode (add or edit)
	 * @param {Object} data
	 */
	showDialog: function(mode, data){
		//Window Title
		var title = ('edit' == mode)?'Edit user information':'Add new user';

		//Button handlers
		var save = function(){
			var f = form.getForm();
			if(f.isValid()){
				var params = f.getValues();
				Ext.Ajax.request({
					url: ('edit' == mode)?'afsUserManager/update':'afsUserManager/create',
					params: {
						username: params['username'],
						user: Ext.encode(params)
					},
					
					callback: function(options, success, response) {				
						response = Ext.decode(response.responseText);
						if (!success) {
							Ext.Msg.alert('Failure','Server-side failure with next message: ' + response.message);
						}else{
							Ext.Msg.alert('System Message', response.message);
							wnd.close()
							Ext.getCmp('manage-users-grid').getStore().load();
						}
					}
				});				
			}
		}
		var cancel = function(){
			wnd.close();
		}
		
		//Active form
		var form = new Ext.FormPanel({
		    url: '',
			defaultType: 'textfield',
			width: 450, labelWidth: 70,
			frame: true, title: false,
			defaults: {allowBlank: false, anchor: '95%'},
			items: [
				{name: 'first_name', fieldLabel: 'First Name'},
				{name: 'last_name', fieldLabel: 'Last Name'},
				{name: 'username', fieldLabel: 'Username'},
				{name: 'email', fieldLabel: 'Email', vtype: 'email'},
				{name: 'password', fieldLabel: 'Password', allowBlank: ('edit' == mode)?true:false},
				{xtype: 'combo', mode: 'local', triggerAction: 'all',
					fieldLabel: 'User role',
					emptyText: 'Please select user role...',
					store: [
						['admin', 'Admin'], ['user', 'User']
					],
//					name: 'role',
					hiddenName: 'role'
				}
			]
		});
		
		//Main window
		var wnd = new Ext.Window({
			width: 463,
			title: title,
			autoHeight: true, closable: true, draggable: true,
			plain:true, modal: true, resizable: false,
			bodyBorder: false, border: false,
			items: form,
			
			buttons: [
				{text: 'Save user data', handler: save, scope: this},
				{text: 'Cancel', handler: cancel, scope: this}
			],
			buttonAlign: 'center'			
		});
		wnd.show();
		
		//Set values
		if(data){
			form.getForm().setValues({
				first_name: data.first_name,
				last_name: data.last_name,
				username: data.username,
				email: data.email,
				role: data.role
			});
		}
	},
	
	/**
	 * Function createUserGrid
	 * This function creates users grid
	 */
	createUserGrid: function(){
		//Cretae record
		var r = Ext.data.Record.create([
			{name: 'id', type: 'int'}, {name: 'first_name'}, {name: 'last_name'}, 
			{name: 'email'}, {name: 'password'}, {name: 'role'}, {name: 'username'}
		]);
	
		//Create DatStore
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: 'afsUserManager/getList'}),
	        reader: new Ext.data.JsonReader(
				{root: 'data', totalProperty: 'total', id: 'id', fields: r}
			),
			remoteSort: true,
			
			listeners: {
				'load': function(){
					Ext.addBehaviors({
						'IMG.deleteUserEmptyCls@click': this.onUserDelete,
						'IMG.editUserEmptyCls@click': this.onUserEdit
					});
				}, scope: this
			}
	    });		
		
		//
		var renderActionsClmn = function(v, md, r){
			return '<img class="deleteUserEmptyCls" username="'+v+'" ext:qtip="Delete User" style="cursor: pointer;" src="appFlowerStudioPlugin/images/delete.png">' +
					'<img class="editUserEmptyCls" username="'+v+'" ext:qtip="Edit User" style="cursor: pointer;margin-left: 5px" src="appFlowerStudioPlugin/images/pencil.png">';
			return v;
		};
		
		//Create ColumnModel
		var cm = new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer(),
			{header: 'First Name', sortable: true, dataIndex: 'first_name'},
			{header: 'Last Name', sortable: true, dataIndex: 'last_name'},
			{header: 'Username', sortable: true, dataIndex: 'username'},
			{header: 'Email', sortable: true, dataIndex: 'email'},
			{header: 'Role', sortable: true, fixed: true, width: 75, dataIndex: 'role'},
			{header: 'Actions', sortable: false, fixed: true, width: 75, dataIndex: 'username', renderer: renderActionsClmn}
		]);
		
		//Create  grid
		this.usersGrid = new Ext.grid.GridPanel({
			id: 'manage-users-grid',
			store: ds,
			showDialog: this.showDialog,
			viewConfig: {scrollOffset: 19, forceFit: true},
			cm : cm,
			loadMask: true,
			border: true,
			autoScroll: true
		});
	},
	
	/**
	 * Function onWindowShow
	 * Runs when window showed
	 * Loads data into the grid
	 */
	onWindowShow: function(){
		this.usersGrid.getStore().load();
	},
	
	/**
	 * Inits events of the needful components
	 */
	_initEvents: function(){
		this.on({
			'show': this.onWindowShow,
			scope: this
		});
	},
	
	/**
	 * Function cancel
	 * Close active wimdow
	 */
	cancel: function(){
		this.close();
	}
});