Ext.ns('afStudio.models');

/**
 * TypeComboBox represents Model's types
 * 
 * @class afStudio.models.TypeComboBox
 * @extends Ext.ux.form.GroupingComboBox
 */
afStudio.models.TypeComboBox = Ext.extend(Ext.ux.form.GroupingComboBox, {
	
	_beforeInitComponent : function() {
		var _this = this;
		
		var comboStore = new Ext.data.SimpleStore({
			fields: ['group', 'value', 'text'],
			data: [
				['TEXT', 'char', 'char'],
				['TEXT', 'varchar', 'varchar'],     
				['TEXT', 'longvarchar', 'longvarchar'],	
				['TEXT', 'clob', 'clob'],
				['NUMBERS', 'numeric',  'numeric'],  
				['NUMBERS', 'decimal',  'decimal'],  
				['NUMBERS', 'tinyint',  'tinyint'],					
				['NUMBERS', 'smallint', 'smallint'], 
				['NUMBERS', 'integer',  'integer'],  
				['NUMBERS', 'bigint',   'bigint'],
				['NUMBERS', 'real',     'real'],
				['NUMBERS', 'float',    'float'],    
				['NUMBERS', 'double',   'double'],
				['NUMBERS', 'boolean',  'boolean'],
				['BINRAY', 'binary',    'binary'],	 
				['BINRAY', 'varbinary', 'varbinary'], 
				['BINRAY', 'longvarbinary', 'longvarbinary'], 
				['BINRAY', 'blob', 'blob'],
				['TEMPORA DATE/TIME', 'date', 'date'],	 
				['TEMPORA DATE/TIME', 'time', 'time'], 
				['TEMPORA DATE/TIME', 'timestamp', 'timestamp'], 
				['TEMPORA DATE/TIME', 'integer', 'integer']
			]
		});
		
		return {
			triggerAction: 'all',
			forceSelection: true,
			groupField: 'group',
			valueField: 'value',
			displayField: 'text',			
			mode: 'local',
			store: comboStore
		}
	}
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.applyIf(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.models.TypeComboBox.superclass.initComponent.apply(this, arguments);		
	}
});


Ext.reg('afStudio.models.typeCombo', afStudio.models.TypeComboBox);
