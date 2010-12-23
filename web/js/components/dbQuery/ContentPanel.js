Ext.ns('afStudio.dbQuery');

afStudio.dbQuery.ContentPanel = Ext.extend(Ext.Panel, {
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	_beforeInitComponent : function() {
	
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
				    cmp.body.mask('Please select table...');
				}).defer(100);
			}
		});
	}
	
});

/**
 * @type 'afStudio.dbQuery.contentPanel'
 */
Ext.reg('afStudio.dbQuery.contentPanel', afStudio.dbQuery.ContentPanel);