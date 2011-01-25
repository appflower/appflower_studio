Ext.ns('afStudio.dbQuery');

afStudio.dbQuery.TableModelTab = Ext.extend(Ext.TabPanel, {
	/**
	 * @cfg {Object} metaData required
	 * The metaData object contains model's structure
	 */
	
	/**
	 * @cfg {String} modelName required
	 * Model name corresponding to the working Table 
	 */

	/**
	 * @cfg {String} schemaName required
	 * Schema name corresponding to the working Table
	 */
	
	/**
	 * @cfg {String} modelGridDataUrl required (defaults to '/afsModelGridData')
	 * Base URL for modelData grid 
	 */
	modelGridDataUrl : '/afsModelGridData'
	
	/**
	 * @cfg {String} modelUrl required (defaults to '/appFlowerStudio/models')
	 * Base URL for models 
	 */
	,modelUrl : window.afStudioWSUrls.getModelsUrl()
	
	,createStructureGrid : function(metaData) {
	   	return new afStudio.dbQuery.StructureGrid({	   		
			itemId: 'structure-grid',
			storeDataUrl: this.modelUrl,
			metaData: metaData,
			model: this.modelName,
			schema: this.schemaName
		});		
	}//eo createStructureGrid
	
	/**
	 * Creates {@link afStudio.dbQuery.DataGrid} grid
	 * @private
	 * @param {Object} metaData The metaData object contains model's structure
	 * @return {afStudio.dbQuery.DataGrid} modelData grid
	 */
	,createDataGrid : function(metaData) {
	   	return new afStudio.dbQuery.DataGrid({	   		
			itemId: 'data-grid',
			storeDataUrl: this.modelGridDataUrl + '/read?model=' + this.modelName,
			metaData: metaData,
			model: this.modelName,
			schema: this.schemaName
		});
	}//eo createDataGrid
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */	
	,_beforeInitComponent : function() {
		var _this = this;
		
	   	this._structureGrid = _this.createStructureGrid(_this.metaData);
	   	this._dataGrid      = _this.createDataGrid(_this.metaData); 
		
		return {			
			activeTab: 0,
			items: [
				_this._dataGrid,
				_this._structureGrid
			]
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
		afStudio.dbQuery.TableModelTab.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this,
		       mc = _this._modelConfig,
		       md = _this._modelData;

	}//eo _afterInitComponent
	
});

/**
 * @type 'afStudio.dbQuery.tableModelTab'
 */
Ext.reg('afStudio.dbQuery.tableModelTab', afStudio.dbQuery.TableModelTab);