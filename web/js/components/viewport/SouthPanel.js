/**
 * South region panel
 * 
 * @class afStudio.viewport.SouthPanel
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.viewport.SouthPanel = Ext.extend(Ext.Panel, { 

	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	_beforeInitComponent : function() {
		return {
			region: "south",
			layout: 'fit',
			height: 215,
			split: true,			
			collapseMode: 'mini',
			items: [
			]
		}		
	}
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent: function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._beforeInitComponent()));
		afStudio.viewport.SouthPanel.superclass.initComponent.apply(this, arguments);
	}
});