(function(){
	afStudio.widgetDesigner.PropertyTypeBoolean = function(fieldLabel, value){
		var config = {'fieldLabel': fieldLabel, 'value': value};
		Ext.apply(this, config);
	};
})();

// private
afStudio.widgetDesigner.PropertyTypeBoolean.type = 'BOOLEAN';
Ext.apply(afStudio.widgetDesigner.PropertyTypeBoolean.prototype, {});