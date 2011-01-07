afStudio.widgetDesigner.PropertyTypeChoice = Ext.extend(afStudio.widgetDesigner.PropertyBaseType, {
	type: 'choice',
	defaultValue: '',
	
	setChoices: function(store){
		this.store = store;
		return this;
	}
});