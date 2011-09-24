Ext.ns('afStudio.data.type');

/**
 * Defines numbers.
 * 
 * @abstract
 * 
 * @class afStudio.data.type.Number
 * @extends afStudio.data.type.Type
 * @author Nikolai Babinski
 */
afStudio.data.type.Number = Ext.extend(afStudio.data.type.Type, {
	/**
	 * Type name.
	 * @property type
	 * @type {String}
	 */
	type : "number",
	
	/**
	 * Editor field component.
	 * @property editorField 
	 * @type {Ext.form.Field} 
	 */
	editorField : Ext.form.NumberField,

	/**
	 * @override
	 */
	validate : function(value) {
		if (Ext.isNumber(value)) {
			return afStudio.data.type.Number.superclass.validate.call(this, value);
		}
		
		return this.invalidMessage;
	}
});