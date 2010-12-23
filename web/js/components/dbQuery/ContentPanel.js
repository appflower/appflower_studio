Ext.ns('afStudio.dbQuery');

/**
 * ContentPanel
 * 
 * @class afStudio.dbQuery.ContentPanel
 * @extends Ext.Panel
 * @author Nick
 */
afStudio.dbQuery.ContentPanel = Ext.extend(Ext.Panel, {
	
	/**
	 * Masks this panel
	 * @param {String} msg
	 */
	maskContent : function(msg) {
		this.body.mask(msg ? msg : 'loading');
	}
	
	/**
	 * Unmasks this panel
	 */
	,unmaskContent : function() {
		this.body.unmask();
	}
	
	/**
	 * Removes all panel's components
	 */
	,clearPanel : function() {			
		this.removeAll(true);
	}
	
	,createTableDataGrid : function() {
		var _this = this;
		
		var grid = new Ext.grid.GridPanel({
			columns:[
				{header:'column1', width:100},
				{header:'column2', width:100},
				{header:'column3', width:100}
			],
			store: new Ext.data.ArrayStore({
	        	fields: [
	        		{name: 'company'},
	            	{name: 'price', type: 'float'}
	         	]
			}),
			viewConfig: {
				forceFit: true
			}
		});
		
		return grid;
	}//eo createTableDataGrid	
	
	,createTableListGrid : function(tables) {
		var grid = new Ext.grid.GridPanel({
			title: 'Tables',
			autoScroll: true,
			columns:[
				{header:'Name'}
			],
			store: new Ext.data.JsonStore({
	        	fields: [
	        		{name: 'text'}
	         	],
	         	data: tables
			}),
			viewConfig: {
				forceFit: true
			}
		});
		
		return grid;		
	}
	
	,showTableData : function() {
		this.maskContent();
		
		var grid = this.createTableDataGrid();
		var tp = new Ext.TabPanel({
			activeTab: 0,
			items: [
				{xtype: 'panel', title: 'Data', items: grid, layout: 'fit', hideBorders: true},
				{xtype: 'panel', title: 'Structure'}
			]
		});
			
		this.unmaskContent();
		this.clearPanel();
		this.add(tp);
		this.doLayout();
	}
	
	,showDatabaseTables : function(tables) {
		this.maskContent();
		
		var grid = this.createTableListGrid(tables);
			
		this.unmaskContent();
		this.clearPanel();
		this.add(grid);
		this.doLayout();		
	}
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
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
	
	//private
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));				
		afStudio.dbQuery.ContentPanel.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on({
			'render': function(cmp){
				(function(){
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