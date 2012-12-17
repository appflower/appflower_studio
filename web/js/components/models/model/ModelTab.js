Ext.ns('afStudio.models.model');

/**
 *
 *
 * @class afStudio.models.model.ModelTab
 * @extends Ext.TabPanel
 * @author Nikolai Babinski
 */
afStudio.models.model.ModelTab = Ext.extend(Ext.TabPanel, {

	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */	
	_beforeInitComponent : function() {
		var me = this,
			fData = me.fieldsStructure,
			mdl = me.modelName,
			shm = me.schemaName;
		
	   	this._modelConfig = me.createModelConfigGrid(fData);
	   	this._modelData   = me.createModelDataGrid(fData); 
		
		return {			
			activeTab: 0,
			items: [
				me._modelData,
				me._modelConfig
			]
		};	
	},
	
	/**
	 * Template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);

		afStudio.models.model.ModelTab.superclass.initComponent.apply(this, arguments);

		this._afterInitComponent();
	}
});

/**
 * @type 'afStudio.models.modelTab'
 */
Ext.reg('afStudio.models.modelTab', afStudio.models.model.ModelTab);


/**
 * Applies {@link afStudio.models.model.ModelContainer} mixin.
 */
Ext.applyIf(afStudio.models.model.ModelTab.prototype, afStudio.models.model.ModelContainer);