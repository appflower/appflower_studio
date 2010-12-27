Ext.ns('afStudio.dbQuery');

/**
 * QueryWindow
 * 
 * @class afStudio.dbQuery.QueryWindow
 * @extends Ext.Window
 * @author Nick
 */
afStudio.dbQuery.QueryWindow = Ext.extend(Ext.Window, {
	
	/**
	 * Relayed {@link afStudio.dbQuery.DBStructureTree#dbnodeclick} event listener
 	 * @param {Ext.data.node} node The clicked node
	 * @param {Ext.EventObject} e This event object
	 * @param {String} nodeType The node's type - "table"/"database"
	 */
	onDBNodeClick : function(node, e, nodeType) {
		var _this = this;
		
		switch (nodeType) {
			case 'table':
				_this.centerPanel.showTableData();	
			break;
			case 'database':
				_this.centerPanel.showDatabaseTables(node.childNodes);
			break;
		}		
	}//eo onDBNodeClick
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		_this.westPanel = new afStudio.dbQuery.DBStructureTree({
			region: 'west',
			split: true,
			width: 250
		});		
		
		_this.northPanel = new afStudio.dbQuery.QueryForm();
		
		_this.centerPanel = new afStudio.dbQuery.ContentPanel();

		
		return {
			title: 'Database Query', 
			width: 800,
			height: 600, 
			closable: true,
	        draggable: true, 
	        plain: true,
	        modal: true, 
	        resizable: false,
	        bodyBorder: false, 
	        border: false,
	        
	        items: [
	        	_this.northPanel,
	        	_this.westPanel,
	        	_this.centerPanel
	        ],
	        
	        layout:'border',
			buttons: [				
			{
				text: 'Cancel', 
				iconCls: 'afs-icon-cancel',
				handler: this.cancel, 
				scope: this
			}],
			buttonAlign: 'right'
		};		
	}//eo _beforeInitComponent
	
	//private 
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));				
		afStudio.dbQuery.QueryWindow.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.relayEvents(_this.westPanel, ['dbnodeclick']);
		
		_this.on({
			'dbnodeclick': Ext.util.Functions.createDelegate(_this.onDBNodeClick, _this) 
		})
	}
	
	,cancel:function(){
		this.close();
	}
});