Ext.ns('afStudio.wd.edit');


afStudio.wd.edit.EditView = Ext.extend(Ext.FormPanel, {

	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		
		return {
			
		}
	},
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.wd.edit.EditView.superclass.initComponent.apply(this, arguments);
		
		//this._afterInitComponent();
	},	
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initEvents : function() {
		afStudio.wd.edit.EditView.superclass.initEvents.call(this);
	}
	
});