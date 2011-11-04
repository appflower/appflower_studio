Ext.ns('afStudio.dbQuery');

/**
 * QueryWindow
 * 
 * @class afStudio.dbQuery.QueryWindow
 * @extends Ext.Window
 * @author Nikolai
 */
afStudio.dbQuery.QueryWindow = Ext.extend(Ext.Window, {
	
	/**
	 * Relayed {@link afStudio.dbQuery.QueryForm#executequery} event listener
	 * @param {Object} queryResult The query result
	 */
	onExecuteQuery : function(queryResult) {
		this.centerPanel.showQueryResult(queryResult);
	}//eo onExecuteQuery
	
	/**
	 * Relayed {@link afStudio.dbQuery.DBStructureTree#dbnodeclick} event listener
 	 * @param {Ext.data.node} node The clicked node
	 * @param {Ext.EventObject} e This event object
	 * @param {String} nodeType The node's type - "table"/"database"
	 */
	,onDBNodeClick : function(node, e, nodeType) {
		var me = this;
		
		switch (nodeType) {
			case 'table':
				me.centerPanel.showTableData(node.attributes);	
			break;
			
			case 'database':
				me.centerPanel.showDatabaseTables(node.childNodes);
			break;
		}		
	}//eo onDBNodeClick
	
	/**
	 * Masksing window
	 * @param {String} msg The message (defaults to 'Querying...')
	 */
	,maskDbQuery : function(msg) {
		this.body.mask('Querying...', 'x-mask-loading');
	}
	
	/**
	 * Unmasks window
	 */
	,unmaskDbQuery : function() {
		this.body.unmask();
	}
	
	,cancelBtnPressed : function() {
		this.close();
	}
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var me = this;
		
		me.westPanel = new afStudio.dbQuery.DBStructureTree({
			region: 'west',
			split: true,
			width: 250
		});		
		
		me.northPanel = new afStudio.dbQuery.QueryForm({
			dbQueryWindow: me
		});
		
		me.centerPanel = new afStudio.dbQuery.ContentPanel();
		
		return {
			title: 'Database Query', 
			width: 1007,
			height: 600, 
			closable: true,
	        draggable: true, 
	        plain: true,
	        modal: true, 
	        maximizable: true,
	        bodyBorder: false, 
	        border: false,
	        
	        items: [
	        	me.northPanel,
	        	me.westPanel,
	        	me.centerPanel
	        ],
	        
	        layout:'border'
		};
	}//eo _beforeInitComponent
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));				
		afStudio.dbQuery.QueryWindow.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	,_afterInitComponent : function() {
		var me = this;
		
		me.relayEvents(me.westPanel, ['dbnodeclick']);
		me.relayEvents(me.northPanel, ['executequery']);
		
		me.on({
			scope: me,
			dbnodeclick: me.onDBNodeClick,
			executequery: me.onExecuteQuery
		})
	}//eo _afterInitComponent	
});