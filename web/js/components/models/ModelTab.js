Ext.ns('afStudio.models');

/** 
 * @class afStudio.models.ModelTab
 * @extends Ext.TabPanel
 * @author Nikolai
 */
afStudio.models.ModelTab = Ext.extend(Ext.TabPanel, {

	/**
	 * @cfg {Object} fieldsStructure required
	 * The fieldsStructure object contains model's fields structure metadata
	 */
	
	/**
	 * @cfg {String} modelName required
	 */

	/**
	 * @cfg {String} schemaName required
	 */
	
	/**
	 * @cfg {String} modelUrl required (defaults to '/appFlowerStudio/models')
	 * Base URL for models 
	 */
	modelUrl : afStudioWSUrls.modelListUrl

	/**
	 * Runs altering process and updates model's grids
	 * @private
	 * @param {Function} action
	 */
	,alterModelAction : function(action) {
		var _this = this;
		
		afStudio.vp.mask({region:'center', msg:'Updating ' + _this.modelName + ' model...'});
		
		Ext.Ajax.request({
		   url: _this.modelUrl,
		   params: { 
			   xaction: 'read',
			   model: _this.modelName,
			   schema: _this.schemaName
		   },
		   success: function(result, request) {
		       afStudio.vp.unmask('center');
		       var fData = Ext.decode(result.responseText);
			   action(fData);		       
		   }
		});
	}//eo alterModelAction
	
	/**
	 * {@link afStudio.models.FieldsGrid} modelConfig's <u>altermodel</u> event listener
	 * Updates modelData grid.
	 * This event is relayed to the ModelTab.
	 */
	,onAlterModel : function() {
		var _this = this,
			   md = _this._modelData;
			   
		_this.alterModelAction(function(fData) {
	       _this.remove(md, true);		   		
	       _this._modelData = _this.createModelDataGrid(fData);				
	       _this.insert(0, _this._modelData);
	       _this.doLayout();
		});
	}//eo onAlterModel
	
	/**
	 * {@link afStudio.models.ModelGrid} modelData's <u>alterfield</u> event listener
	 * Updates modelConfig grid.
	 * This event is relayed to the ModelTab. 
	 */
	,onAlterField : function() {
		var _this = this,
			   mc = _this._modelConfig;			
			   
		_this.alterModelAction(function(fData) {
			mc.loadModelData(fData);
		});		
	}//eo onAlterField
	
	/**
	 * Creates modelConfig grid
	 * @private
	 * @param {Object} fData The fData object contains model's fields structure information
	 * @return {afStudio.models.FieldsGrid} modelConfig grid
	 */
	,createModelConfigGrid : function(fData) {
		var _this = this;
		
		return new afStudio.models.FieldsGrid({	   		
			itemId: 'model-fields',
			_data: fData,
			model: _this.modelName,
			schema: _this.schemaName
		});		
	}
	
	/**
	 * Creates modelData grid
	 * @private
	 * @param {Object} fData The fData object contains model's fields structure information
	 * @return {afStudio.models.ModelGrid} modelData grid
	 */
	,createModelDataGrid : function(fData) {
		var _this = this,
			  mdl = _this.modelName;
			  
	   	return new afStudio.models.ModelGrid({	   		
			itemId: 'model-data',
			title: mdl,
			_data: fData,
			model: _this.modelName,
			schema: _this.schemaName,			
            storeProxy: new Ext.data.HttpProxy({
                api: {
                	read:    afStudioWSUrls.getModelGridDataReadUrl(mdl),
                    create:  afStudioWSUrls.getModelGridDataCreateUrl(mdl),
                    update:  afStudioWSUrls.getModelGridDataUpdateUrl(mdl),
                    destroy: afStudioWSUrls.getModelGridDataDeleteUrl(mdl)
                }
            })
		});
	}//eo createModelDataGrid
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */	
	,_beforeInitComponent : function() {
		var _this = this,
			fData = _this.fieldsStructure,
			  mdl = _this.modelName,
			  shm = _this.schemaName;
		
	   	this._modelConfig = _this.createModelConfigGrid(fData);
	   	this._modelData   = _this.createModelDataGrid(fData); 
		
		return {			
			activeTab: 0,
			items: [
				_this._modelData,
				_this._modelConfig
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
		afStudio.models.ModelTab.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this,
		       mc = _this._modelConfig,
		       md = _this._modelData;

		this.relayEvents(mc, ['altermodel']);
		this.relayEvents(md, ['alterfield']);
		
		_this.on({
			scope: _this,
			altermodel: _this.onAlterModel,
			alterfield: _this.onAlterField
		});	
	}//eo _afterInitComponent	
});

/**
 * @type 'afStudio.models.modelTab'
 */
Ext.reg('afStudio.models.modelTab', afStudio.models.ModelTab);