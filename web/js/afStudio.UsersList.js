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
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.UsersList.superclass.initComponent.apply(this, arguments);
		
		this._initEvents();
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
			remoteSort: true
	    });		
		
		//
		var renderActionsClmn = function(v, md, r){
			return '<img ext:qtip="Delete User" style="cursor: pointer;" src="appFlowerStudioPlugin/images/delete.png">' +
					'<img ext:qtip="Edit User" style="cursor: pointer;margin-left: 5px" src="appFlowerStudioPlugin/images/delete.png">';
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
		
		//Creat  grid
		this.usersGrid = new Ext.grid.GridPanel({
			store: ds,
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
		this.usersGrid.getStore().load({params: {'start': 0, 'limit': 10}});
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