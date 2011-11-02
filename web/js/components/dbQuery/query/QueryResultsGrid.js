Ext.ns('afStudio.dbQuery');

/**
 * afStudio.dbQuery.QueryResultsGrid
 * 
 * @class afStudio.dbQuery.QueryResultsGrid
 * @extends Ext.grid.GridPanel
 * @author Nikolai Babinski
 */
afStudio.dbQuery.QueryResultsGrid = Ext.extend(Ext.grid.GridPanel, {
	/**
	 * @cfg {Object} (Required) queryParam
	 * The Query metaData object contains query's parameters
	 */
	
	/**
	 * @cfg {Object} (Required) queryResult
	 * Contains query's result data-set (first result set limited by "recordsPerPage") and meta data 
	 */
	
	/**
	 * @cfg {Number} recordsPerPage (defaults to 50)
	 */
	recordsPerPage : 50
	
	/**
	 * @cfg {String} queryUrl required (defaults to 'afsDatabaseQuery/query')
	 * Query URL
	 */
	,queryUrl : afStudioWSUrls.dbQueryQueryUrl	
	
	/**
	 * Loads query result set data
	 * @param {Object} data The data set to be loaded
	 */
	,loadResultsData : function(data) {
		this.getStore().loadData(data);
	}//eo loadResultsData
	
	//private
	,_beforeInitComponent : function() {
		var   _this = this,
	       metaData = this.queryResult.meta || [],
	       	  title = this.title || 'Query Result',
	          store,
		storeFields = [],
			columns = [],
		  pagingBar;	
		  
		if (metaData.length > 0) {
			columns = [new Ext.ux.grid.PagingRowNumberer({header: 'Rec #', width: 50})];
			
			for (var i = 0, len = metaData.length; i < len; i++) {
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
			title: title,
			iconCls: 'icon-database-table',
		    loadMask: true,
		    store: store,
		    columns: columns,
	        columnLines: true,
	        viewConfig: {
	            forceFit: true,
	            emptyText: "Empty data-set"
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
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on({
			scope: _this,
			afterrender: function() { 
				_this.loadResultsData(_this.queryResult ? _this.queryResult : []);
			}
		});
	}//eo _afterInitComponent	
});

/**
 * @type 'afStudio.dbQuery.queryResultsGrid'
 */
Ext.reg('afStudio.dbQuery.queryResultsGrid', afStudio.dbQuery.QueryResultsGrid);