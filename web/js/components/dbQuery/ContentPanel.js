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
	
	,showTableData : function(modelData) {	
		var _this = this,
			    m = modelData.model,
			    s = modelData.schema;

		_this.maskContent('loading metadata...');	    
			    
		Ext.Ajax.request({
		   url: '/appFlowerStudio/models',
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
			'render': function(cmp) {
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