(function(){
	afStudio.widgetDesigner.PropertyBaseType = function(fieldId, fieldLabel){
		var config = {fieldId: fieldId, fieldLabel: fieldLabel};
		Ext.apply(this, config);
	};
})();

Ext.apply(afStudio.widgetDesigner.PropertyBaseType.prototype, {
	/**
	 * @var {Mixed} value
	 * Property value
	 */
	value: undefined,
	
	/**
	 * @var {Boolean} required
	 * Is field required
	 */
	required: false,
	 	
	setRequired: function(){
		this.required = true;
		return this;
	},
	
	setValue: function(v){
		this.value = v;
		return this;
	}
});