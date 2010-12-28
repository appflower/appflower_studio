/**
 * This class wraps creation of Ext.data.Record objects
 */
(function(){
	afStudio.widgetDesigner.PropertyBaseType = function(fieldId, fieldLabel){
		this.id = fieldId;
        this.label = fieldLabel;
	};
})();

Ext.apply(afStudio.widgetDesigner.PropertyBaseType.prototype, {
	/**
	 * @var {Mixed} value
	 * Property value
	 */
	value: undefined,
    id: undefined,
    label: undefined,
	
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
	},
    create: function(){
        return new afStudio.widgetDesigner.PropertyRecord({
            name: this.label,
            value: this.value,
            required: this.required ? "Mandatory" : 'Optional'
        }, this.label);
    }
});