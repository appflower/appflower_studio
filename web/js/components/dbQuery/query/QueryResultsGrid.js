Ext.ns('afStudio.dbQuery');

afStudio.dbQuery.QueryResultsGrid = Ext.extend(Ext.grid.GridPanel, {
	/**
	 * @cfg {Object} queryParam required
	 * The Query metaData object contains query's parameters
	 */
	
	/**
	 * @cfg {Object} queryResult required
	 * Contains query's result set data(first result set limited by "recordsPerPage") and meta data 
	 */
	
	/**
	 * @cfg {Number} recordsPerPage (defaults to 50)
	 */
	recordsPerPage : 50
	
	/**
	 * @cfg {String} queryUrl required (defaults to 'afsDatabaseQuery/query')
	 * Query URL
	 */
	,queryUrl : window.afStudioWSUrls.getDBQueryQueryUrl()
	
	
	/**
	 * Loads query result set data
	 * @param {Object} data The data set to be loaded
	 */
	,loadResultsData : function(data) {
		this.getStore().loadData(data);
	}
	
	//private
	,_beforeInitComponent : function() {
		var   _this = this,
	       metaData = _this.queryResult.meta || [],
	          store,
		storeFields = [],
			columns = [],  
		  pagingBar;
		
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
			url: _this.queryUrl,
			root: 'data',
			totalProperty: 'total',
			baseParams: _this.queryParam,
			fields: storeFields           
		});
		
		pagingBar = new Ext.PagingToolbar({
	        store: store,
	        displayInfo: true,	        
	        displayMsg: 'Displaying records {0} - {1} of {2}',
	        pageSize: _this.recordsPerPage
    	});
		
		return {
			title: 'Query Result',
			iconCls: 'icon-database-table',
		    loadMask: true,
		    store: store,
		    columns: columns,
	        columnLines: true,
	        viewConfig: {
	            forceFit: true,
	            emptyText: "Empty!"
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
		
		_this.on({
			afterrender: function() { 
				_this.loadResultsData(_this.queryResult ? _this.queryResult : []);
			},
			scope: _this
		});
	}//eo _afterInitComponent
	
});