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
	 * The Query metaData object contains query's parameters.
	 * @cfg {Object} (required) queryParam 
	 */
	
	/**
	 * Contains query's result data-set (first result set limited by "recordsPerPage") and meta data. 
	 * @cfg {Object} (required) queryResult
	 */
	
	/**
	 * The result grid's records per page number, defaults to 50.
	 * @cfg {Number} (required) recordsPerPage 
	 */
	recordsPerPage : 50,
	
	/**
	 * Query URL, defaults to "afsDatabaseQuery/query"
	 * @cfg {String} (required) queryUrl
	 * 
	 */
	queryUrl : afStudioWSUrls.dbQueryQueryUrl,
	
	/**
	 * Loads query result set data
	 * @param {Object} data The data set to be loaded
	 */
	loadResultsData : function(data) {
		this.getStore().loadData(data);
	},
	
	/**
	 * @private
	 * @return {Object} configuration object
	 */
	_beforeInitComponent : function() {
		var      me = this,
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

		//update "query" parameter, in not select clauses should be used right query after applying modifications
		Ext.apply(me.queryParam, {
			query: me.queryResult.query
		});
		
		store = new Ext.data.JsonStore({
			url: me.queryUrl,
			root: 'data',
			totalProperty: 'total',
			baseParams: me.queryParam,
			fields: storeFields
		});
		
		pagingBar = new Ext.PagingToolbar({
	        store: store,
	        displayInfo: true,	        
	        displayMsg: 'Displaying records {0} - {1} of {2}',
	        pageSize: me.recordsPerPage
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
	},
	//eo beforeInit
	
	/**
	 * Template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.dbQuery.DataGrid.superclass.initComponent.apply(this, arguments);
		
		this._afterInitComponent();
	},
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	_afterInitComponent : function() {
		var me = this;
		
		me.on({
			scope: me,
			afterrender: function() { 
				me.loadResultsData(me.queryResult ? me.queryResult : []);
			}
		});
	}	
});

/**
 * @type 'afStudio.dbQuery.queryResultsGrid'
 */
Ext.reg('afStudio.dbQuery.queryResultsGrid', afStudio.dbQuery.QueryResultsGrid);