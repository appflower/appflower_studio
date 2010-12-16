
/**
 * afStudio south region panel
 * @class afStudio.southPanel
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.southPanel = Ext.extend(Ext.Panel, { 

	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	_initCmp : function() {
		return {
			id: 'south_panel',
			region: "south",
			layout: 'fit',
			height: 215,
			split: true,			
			collapseMode: 'mini',
			items: [
				new afStudio.console()
			]
		}		
	}
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent: function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.southPanel.superclass.initComponent.apply(this, arguments);
	}
});