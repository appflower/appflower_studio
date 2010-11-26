Ext.ns('afStudio.models');

N = afStudio.models;

N.RelationCombo = Ext.extend(Ext.form.ComboBox, {
	/**
	 * @cfg {String} relationUrl required
	 * store Url 
	 */	
	
	_beforeInitComponent : function() {
		var _this = this;
		
		var cbStore = new Ext.data.JsonStore({
			url: _this.relationUrl,
			baseParams: {
				xaction: 'readrelation'
			},
			root: 'data',
			fields: ['id', 'value']
		});
		
		return {
			maskRe: /[\w\.]/,
			triggerClass: 'x-form-relation-trigger',
			typeAhead: true,
			lazyRender: true,
			queryParam: 'query',
			mode: 'remote',
			minChars: 1,
			editable: true,
			forceSelection : true,
			store: cbStore,
			valueField: 'id',
			displayField: 'value',
			hiddenName: 'relation',
			name: 'relation'
		}
		
	}//eo _beforeInitComponent 	
	
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));
		afStudio.models.RelationCombo.superclass.initComponent.apply(this, arguments);
	}
	
});

Ext.reg('relationcombo', N.RelationCombo);

delete N;