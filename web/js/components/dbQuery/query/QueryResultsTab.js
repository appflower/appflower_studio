Ext.ns('afStudio.dbQuery');

/**
 * QueryResultsTab
 * 
 * @class afStudio.dbQuery.QueryResultsTab
 * @extends Ext.TabPanel
 * @author Nikolai Babinski
 */
afStudio.dbQuery.QueryResultsTab = Ext.extend(Ext.TabPanel, {
	/**
	 * @cfg {Object} (Required) metaData
	 * The query result data-set object.
	 */
		
	/**
	 * Creates query result container.
	 * 
	 * @private
	 * @param {Object} r The query result object
	 * @param {Object} param The query parameters.
	 * @return {Ext.Container}
	 */
	createQueryResult : function(r, param) {
		var ctn = {
			closable: true
		};
		ctn.title = r.query;
		
		if (r.success === false) {
			var msg = Ext.isArray(r.message) ? r.message.join(', ') : r.message;
			ctn.html = String.format('<div>Query: <i><b>{0}</b></i><br /><br />Error: {1}</div>', r.query, msg);			
		} else {
			param.query = r.query;			
			Ext.apply(ctn, {
				xtype: 'afStudio.dbQuery.queryResultsGrid',
				queryParam: param,
				queryResult: r
			});			
		}
		
	   	return ctn;
	}//eo createQueryResult
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */	
	,_beforeInitComponent : function() {
		var _this = this,
			tabs  = [];				
		
		Ext.iterate(this.metaData.dataset, function(item, idx) {
			var ctn = _this.createQueryResult(item, Ext.apply({}, _this.metaData.queryParam));
			tabs.push(ctn);
		});
		
		return {			
			activeTab: 0,
			enableTabScroll: true,
			items: tabs
		}		
	}//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.dbQuery.QueryResultsTab.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
	}//eo _afterInitComponent
	
});

/**
 * @type 'afStudio.dbQuery.queryResultsTab'
 */
Ext.reg('afStudio.dbQuery.queryResultsTab', afStudio.dbQuery.QueryResultsTab);