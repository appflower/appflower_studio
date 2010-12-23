Ext.ns('afStudio.dbQuery');

/**
 * QueryForm
 * 
 * @class afStudio.dbQuery.QueryForm
 * @extends Ext.Panel
 * @author Nick
 */
afStudio.dbQuery.QueryForm = Ext.extend(Ext.Panel, {
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	_beforeInitComponent : function() {
		var _this = this;
		
		return {
			region: 'north',
			height: 140,
			layout: 'form',
			frame: true,
			iconCls: 'icon-sql', 
			margins: '0 5 5 5', 
			title: 'SQL',
			items: [
			{
				xtype: 'combo', 
				fieldLabel: 'Query type', 
				anchor: '100%', 
				triggerAction: 'all', 
				value: 1, 
				store: [[1, 'SQL'], [2, 'Propel']]
			},{
				xtype: 'textarea', 
				hideLabel: true, 
				height: 80, 
				anchor: '100% '
			}]			
		};		
	}//eo _beforeInitComponent
	
	//private 
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));				
		afStudio.dbQuery.QueryForm.superclass.initComponent.apply(this, arguments);
	}	
});

/**
 * @type 'afStudio.dbQuery.queryForm'
 */
Ext.reg('afStudio.dbQuery.queryForm', afStudio.dbQuery.QueryForm);