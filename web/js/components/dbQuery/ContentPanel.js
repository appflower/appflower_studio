Ext.ns('afStudio.dbQuery');

/**
 * ContentPanel, the query result/table data output panel placed in central region of DBQuery window. 
 * 
 * @class afStudio.dbQuery.ContentPanel
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.dbQuery.ContentPanel = Ext.extend(Ext.Panel, {
	
	/**
	 * Masks this panel
	 * @param {String} msg
	 */
	maskContent : function(msg) {
		this.body.mask(msg ? msg : 'loading', 'x-mask-loading');
		
		return this;
	}//eo maskContent
	
	/**
	 * Unmasks this panel
	 * @return this for chaining
	 */
	,unmaskContent : function() {
		this.body.unmask();
		
		return this;
	}//eo unmaskContent
	
	/**
	 * Removes all panel's components.
	 * @return this for chaining
	 */
	,clearPanel : function() {			
		this.removeAll(true);
		
		return this;
	}//eo clearPanel
	
	/**
	 * Creates DataBase tables list
	 * @param {Object} tables The tables 
	 * @return {Ext.grid.GridPanel} db tables list grid
	 */
	,createTableListGrid : function(tables) {
		
		return new Ext.grid.GridPanel({
			title: 'Tables',
			autoScroll: true,
			columns:[{
				header: 'Name'
			}],
			store: new Ext.data.JsonStore({
	        	fields: [{name: 'text'}],
	         	data: tables
			}),
			viewConfig: {
				forceFit: true
			}
		});		
	}//eo createTableListGrid

	/**
	 * Shows query's result data-set.
	 * @param {Object} data The result meta-object:
	 * <ul>
	 *   <li><b>result</b>: The query's result Array object, array item corresponds to each query result set:
	 *     <ul>
	 *       <li><b>message</b>: {String} The result message.</li>
	 *       <li><b>success</b>: {Boolean} The complete run queries status.</li>
	 *       <li><b>dataset</b>: {Array} The complex query's result data-set:
	 *       	<ul>
	 *       		<li><b>success</b>: {Boolean} Run query success status.</li>
	 *       		<li><b>query</b>: {String} The run over query.</li>
	 *              <li><b>meta</b>: {Array} The query metada describing fields.</li>
	 *              <li><b>data</b>: {Array} The data-set.</li>
	 *       		<li><b>total</b>: {Number} Total records number</li>
	 *       		<li><b>message</b>: {String} If error occured this property contains error message for a query.</li>
	 *       	</ul> 
	 *       </li>
	 *     </ul> 
	 *   </li>
	 *   <li><b>queryParam</b>: The query's parameters.</li>
	 * </ul>
	 */
	,showQueryResult : function(data) {
		var ds = data.result.dataset,
			success = data.result.success,
			resultCtn = {};
		
		this.maskContent();
		
		if (success) {
			if (Ext.isArray(ds) && ds.length > 1) {
		    	resultCtn = new afStudio.dbQuery.QueryResultsTab({  	
					metaData: {
						dataset: ds,
						queryParam: data.queryParam
					}
		    	});			    	
			} else {
				if (ds[0].data.length && ds[0].meta.length) {
			    	resultCtn = new afStudio.dbQuery.QueryResultsGrid({
						queryResult: ds[0],
						queryParam: data.queryParam
			    	});					
				} else {
					var msg = Ext.isArray(ds[0].message) ? ds[0].message.join(', ') : ds[0].message;
					resultCtn.html = String.format('<div>Query: <i><b>{0}</b></i><br /><br />{1}</div>', ds[0].query, msg);					
				}
			}
		} else {
			var msg = '';			
			Ext.iterate(ds, function(q) {
				msg += String.format('<div>Query: <i>{0}</i><br />Error: {1}</div> <hr />', q.query, q.message);
			});
		
			Ext.apply(resultCtn, {
				html: data.result.message + '<br /><br />' + msg
			});	
		}			
		
		this.unmaskContent()
			.clearPanel()
			.add(resultCtn);
		this.doLayout();
	}//eo showQueryResult
	
	/**
	 * Shows table's data
	 * @param {Object} modelData
	 */
	,showTableData : function(modelData) {
		var _this = this,
			    m = modelData.model,
			    s = modelData.schema;

		_this.maskContent('loading metadata...');	    
			    
		Ext.Ajax.request({
		   url: afStudioWSUrls.getModelsUrl(),
		   params: {
			   xaction: 'read',
			   model: m,
			   schema: s
		   },
		   success: function(result, request) {
		       _this.unmaskContent();		
		       var response = Ext.decode(result.responseText);
		       
		       if (response.success) {
			       var tableTab = new afStudio.dbQuery.TableModelTab({
					   metaData: response.rows,
					   modelName: m,
					   schemaName: s
			       });
			       _this.clearPanel();
			       _this.add(tableTab);
			       _this.doLayout();
		       }			   
		   }
		});
	}//eo showTableData
	
	/**
	 * Shows DataBase tables list
	 * @param {Object} tables
	 */
	,showDatabaseTables : function(tables) {
		this.maskContent();
		
		var grid = this.createTableListGrid(tables);
			
		this.unmaskContent()
		    .clearPanel()
		 	.add(grid);
		this.doLayout();		
	}//eo showDatabaseTables
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	,_beforeInitComponent : function() {
	
		return {
			region: 'center',
			margins: '0 5 0 0',
			layout: 'fit',			
			border: true,
			bodyBorder: true,
			hideBorders: true
		}
	}//eo _beforeInitComponent
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.applyIf(this.initialConfig,	this._beforeInitComponent())
		);
		afStudio.dbQuery.ContentPanel.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on({
			render: function(cmp) {
				(function() {
					_this.maskContent('Please select table...');
				}).defer(100);
			}
		});
	}//eo _afterInitComponent	
});

/**
 * @type 'afStudio.dbQuery.contentPanel'
 */
Ext.reg('afStudio.dbQuery.contentPanel', afStudio.dbQuery.ContentPanel);