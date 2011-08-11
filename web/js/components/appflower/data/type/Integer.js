/**
 * Integer data type description. 
 * 
 * @class afStudio.data.type.Integer
 * @extends afStudio.data.type.Number
 * @author Nikolai Babinski
 */
afStudio.data.type.Integer = Ext.extend(afStudio.data.type.Number, {
	/**
	 * Type name.
	 * @property type
	 * @type {String}
	 */
	type : "integer",
	
	/**
	 * Converts value to integer type if value cannot be converted returns null. 
	 * @override
	 * @param {Mixed} value The value being converted
	 * @return {Number}
	 */
	convert : function(value) {
		return (value !== undefined && value !== null && value !== '') ? parseInt(value, 10) : null;
	},
	
	/**
	 * Validates value. Details {@link afStudio.data.type.Type#validate} 
	 * @override
	 */
	validate : function(value) {
		var valid = afStudio.data.type.Integer.superclass.validate.call(this, value);
		
		return ((valid === true) && (value % 1 == 0)) ? true : this.invalidMessage; 
	},
	
	/**
	 * Creates editor. Details {@link afStudio.data.type.Type#editor}
	 * @override
	 * @return {Ext.form.Field} editor
	 */
	editor : function(cfg) {
		cfg = Ext.apply(cfg || {}, {
			allowDecimals: false
		});
		
		return afStudio.data.type.Integer.superclass.editor.call(this, cfg);
	}
});