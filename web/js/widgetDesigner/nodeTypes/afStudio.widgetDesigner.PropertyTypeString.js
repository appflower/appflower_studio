afStudio.widgetDesigner.PropertyTypeString = Ext.extend(afStudio.widgetDesigner.PropertyBaseType, {
	type: 'STRING',
	defaultValue: 'empty',
	
	getPropertyRecordCfg: function(){
		return {fieldLabel: this.fieldLabel, value: this.getValue(), required: this.required}
	},
	
	getValue: function(){
		return this.value || this.defaultValue;
	}
});