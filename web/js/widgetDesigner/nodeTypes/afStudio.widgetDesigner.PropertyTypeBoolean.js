afStudio.widgetDesigner.PropertyTypeBoolean = Ext.extend(afStudio.widgetDesigner.PropertyBaseType, {
	type: 'BOOLEAN',
	defaultValue: false,
	
	getPropertyRecordCfg: function(){
		return {fieldLabel: this.fieldLabel, value: this.getValue(), required: this.required}
	},
	
	getValue: function(){
		if(Ext.isDefined(this.value)){
			return this.value;
		} else {
			return this.defaultValue;
		}
	}
});