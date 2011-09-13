/**
 * Floating point data type description. 
 * 
 * @class afStudio.data.type.Float
 * @extends afStudio.data.type.Number
 * @author Nikolai Babinski
 */
afStudio.data.type.Float = Ext.extend(afStudio.data.type.Number, {
	/**
	 * Type name.
	 * @property type
	 * @type {String}
	 */
	type : "float",
	
	/**
	 * Converts value to float type if value cannot be converted returns null. 
	 * @override
	 * @param {Mixed} value The value being converted
	 * @return {Number}
	 */
	convert : function(value) {
		return (value !== undefined && value !== null && value !== '') ? parseFloat(value, 10) : null;
	}
});