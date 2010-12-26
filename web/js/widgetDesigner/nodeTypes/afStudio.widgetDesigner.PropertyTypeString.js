(function(){
	afStudio.widgetDesigner.PropertyTypeString = function(config){
		config = config || {};
		Ext.apply(this, config);
	};
})();

// private
afStudio.widgetDesigner.PropertyTypeString.type = 'STRING';
Ext.apply(afStudio.widgetDesigner.PropertyTypeString.prototype, {});


/**
afStudio.widgetDesigner.PropertyTypeString = function(fieldLabel, value){
    var config = {'fieldLabel': fieldLabel, 'value': value};
    Ext.apply(this, config);
    afStudio.widgetDesigner.PropertyTypeString.superclass.constructor.call(this);
    this.initComponent();
};

// private
afStudio.widgetDesigner.PropertyTypeString.type = 'STRING';

Ext.extend(afStudio.widgetDesigner.PropertyTypeString, Ext.util.Observable, {
	initComponent: function(){
		var fieldLabel = this.fieldLabel;
//		return {fieldLabel : this.value};
//		return {this.fieldLabel : this.value};
	}
});*/