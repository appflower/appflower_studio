Ext.ns('afStudio.dbQuery');

afStudio.dbQuery.QueryResultsGrid = Ext.extend(Ext.grid.GridPanel, {
	/**
	 * @cfg {Object} metaData required
	 * The metaData object contains model's structure
	 */
	
	/**
	 * @cfg {Object} queryResults required
	 * This grid's data store
	 */
	
	//private
	_beforeInitComponent : function() {
		var   _this = this,
	       metaData = _this.metaData,
		storeFields = [],
			  store,
		  pagingBar, 
			columns = [];
		
		if (metaData.length > 0) {
			columns = [new Ext.ux.grid.PagingRowNumberer({header: 'Rec #', width: 50})];
			
			for (var i = 0; i < metaData.length; i++) {
				columns.push({
					header: metaData[i],
					dataIndex: metaData[i],
					width: 80
				});
				storeFields.push({name: metaData[i]});
			}
		}

		store = new Ext.data.JsonStore({
			fields: storeFields            
		});
		
//		pagingBar = new Ext.PagingToolbar({
//	        store: store,
//	        displayInfo: true,	        
//	        displayMsg: 'Displaying records {0} - {1} of {2}',
//	        pageSize: _this.recordsPerPage
//    	});
		
		return {
			title: 'Query Result',
			iconCls: 'icon-database-table',
		    loadMask: true,
		    store: store,
		    columns: columns,
	        columnLines: true,
	        viewConfig: {
	            forceFit: true
	        }
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
			cmp.getStore().loadData(_this.queryResults);
		});
	}//eo _afterInitComponent
	
});