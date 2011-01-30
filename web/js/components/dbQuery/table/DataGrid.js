Ext.ns('afStudio.dbQuery');

afStudio.dbQuery.DataGrid = Ext.extend(Ext.grid.GridPanel, {
	/**
	 * @cfg {Object} metaData required
	 * The metaData object contains model's structure
	 */	
	
	/**
	 * @cfg {String} model required
	 * This model name
	 */
	
	/**
	 * @cfg {String} schema required
	 * This model's schema name
	 */
	
	/**
	 * @cfg {String} storeDataUrl required
	 * Data fetching URL
	 */
	
	/**
	 * @cfg {Number} recordsPerPage required (defaults to 50)
	 * The number of displaying records per page
	 */
	recordsPerPage : 50
	
	//private
	,_beforeInitComponent : function() {
		var   _this = this,
	       metaData = _this.metaData,
		storeFields = ['id'],
			  store, 
		  pagingBar, 
			columns = [];
		
		if (metaData.length > 0) {
			columns = [new Ext.ux.grid.PagingRowNumberer({header: 'Rec #', width: 50})];
			
			for (var i = 0; i < metaData.length; i++) {
				columns.push({
					header: metaData[i].name,
					dataIndex: 'c' + i,
					width: 80,				
					renderer: afStudio.models.TypeBuilder.createRenderer(metaData[i].type)
				});
				
				storeFields.push({name: 'c' + i});
			}
		}

		store = new Ext.data.JsonStore({
			url: _this.storeDataUrl,
			root: 'rows',
			idProperty: 'id',
			fields: storeFields            
		});
		
		pagingBar = new Ext.PagingToolbar({
	        store: store,
	        displayInfo: true,	        
	        displayMsg: 'Displaying records {0} - {1} of {2}',
	        pageSize: _this.recordsPerPage
    	});
		
		return {
			title: 'Data',
			iconCls: 'icon-database-table',
		    loadMask: true,
		    store: store,
		    columns: columns,
	        columnLines: true,
	        viewConfig: {
	            forceFit: true
	        },
	        bbar: pagingBar
		};
	}//eo beforeInit
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.dbQuery.DataGrid.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	,_afterInitComponent : function() {
		var _this = this;
		
		this.on('afterrender', function(cmp) {
			cmp.getStore().load({
				params: {
					start: 0, 
					limit: _this.recordsPerPage
				}
			});
		});
	}
});