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
			tbar: [
				{text: 'Create user', iconCls: 'icon-add', handler: this.showDialog, scope: this}
			],
			title: 'Users Management', width: 813,
			layout: 'fit',
			height: 550, closable: true,
	        draggable: true, 
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        items: [this.usersGrid],
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
						url: afStudioWSUrls.userDeleteUrl,
						params: {
							username: username
						},
						
						callback: function(options, success, response) {				
							response = Ext.decode(response.responseText);
							if (!response.success) {
								Ext.Msg.alert('Failure','Server-side failure with status code: ' + response.status);
							}else{
								Ext.Msg.alert('System Message', 'User was successfully deleted');
								grid.getStore().load();
							}
						}
					});
				}
			}
			Ext.Msg.confirm('Delete user', 'Are you sure want delete selected user?', fn);
		}
	},

	/**
	 * Creates Edit dialog 
	 * @param {Event} event
	 * @param {Element} target
	 */	
	onUserEdit: function(e, t){
		var username = t.getAttribute('username');
		var fn = function(){
			Ext.getCmp('manage-users-grid').getStore().load();
		};
		(new afStudio.UserWindow(
			{mode: 'edit', username: username, onFormClose: fn}
		)).show();
	},
	
	/**
	 * Function refreshGrid
	 * Refresh grid store
	 */
	refreshGrid: function(){
		Ext.getCmp('manage-users-grid').getStore().load();
	},
	
	/**
	 * Shows user mange window
	 * @param {String} mode (add or edit)
	 * @param {Object} data
	 */
	showDialog: function(mode, data){
		(new afStudio.UserWindow(
			{mode: 'add', onFormClose: this.refreshGrid}
		)).show();
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
			proxy: new Ext.data.HttpProxy({ url: afStudioWSUrls.userListUrl }),
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
		
		//Render for actions column
		var renderActionsClmn = function(v, md, r){
			return '<img class="deleteUserEmptyCls" username="'+v+'" ext:qtip="Delete User" style="cursor: pointer;" src="/appFlowerStudioPlugin/images/delete.png">' +
					'<img class="editUserEmptyCls" username="'+v+'" ext:qtip="Edit User" style="cursor: pointer;margin-left: 5px" src="/appFlowerStudioPlugin/images/pencil.png">';
			return v;
		};
		
		//Create ColumnModel
		var cm = new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer(),
			{header: 'First Name', sortable: false, dataIndex: 'first_name'},
			{header: 'Last Name', sortable: false, dataIndex: 'last_name'},
			{header: 'Username', sortable: false, dataIndex: 'username'},
			{header: 'Email', sortable: false, dataIndex: 'email'},
			{header: 'Role', sortable: false, fixed: true, width: 75, dataIndex: 'role'},
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