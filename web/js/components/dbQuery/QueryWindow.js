Ext.ns('afStudio.dbQuery');

/**
 * QueryWindow
 * 
 * @class afStudio.dbQuery.QueryWindow
 * @extends Ext.Window
 * @author Nick
 */
afStudio.dbQuery.QueryWindow = Ext.extend(Ext.Window, {
	
	onDBNodeClick : function(node, e, type) {
		//console.log(node, e, type);
//		if (node.leaf) {
//			var grid = new Ext.grid.GridPanel({
//				columns:[
//					{header:'column1',width:100},
//					{header:'column2',width:100},
//					{header:'column3',width:100}
//				],
//				store:new Ext.data.ArrayStore({
//		        	fields: [
//		        		{name: 'company'},
//		            	{name: 'price', type: 'float'},
//		            	{name: 'change', type: 'float'},
//		            	{name: 'pctChange', type: 'float'},
//		            	{name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
//		         	]
//				}),
//				viewConfig: {
//					forceFit: true
//				}
//			});            			
//			var tp = new Ext.TabPanel({
//				activeTab: 0,
//				items: [
//					{xtype: 'panel', title: 'Content'},
//					{xtype: 'panel', title: 'Settings', items: grid, layout: 'fit', hideBorders: true}
//				]
//			});
//			
//			this.centerPanel.body.unmask();
//			
//			this.centerPanel.removeAll(true);
//			this.centerPanel.add(tp);
//			this.centerPanel.doLayout();
//		}		
		
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
				{text: 'Query',  scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
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