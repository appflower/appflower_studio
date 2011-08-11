/**
 * Boolean data type description. 
 * 
 * @class afStudio.data.type.Boolean
 * @extends afStudio.data.type.Type
 * @author Nikolai Babinski
 */
afStudio.data.type.Boolean = Ext.extend(afStudio.data.type.Type, {
	/**
	 * Type name.
	 * @property type
	 * @type {String}
	 */
	type : "boolean",
	
	restrictions : {
		enumeration: [true, false]
	},
	
	/**
	 * Converts value to boolean type if value cannot be converted returns null. 
	 * @override
	 * @param {Mixed} v The value being converted
	 * @return {Boolean}
	 */
	convert : function(v) {
		return v === true || v === 'true' || v == 1 ? true : false;
	},
	
	/**
	 * Validates value. Details {@link afStudio.data.type.Type#validate} 
	 * @override
	 */
	validate : function(value) {
		if (Ext.isBoolean(value)) {
			return afStudio.data.type.Boolean.superclass.validate.call(this, value);
		}
		
		return this.invalidMessage;
	},
	
	/**
	 * @override
	 */
	editor : function(cfg) {
		cfg = Ext.apply(cfg || {}, {
			editable: false,
			forceSelection: true
		});
		
		return afStudio.data.type.Boolean.superclass.editor.call(this, cfg);
	}
	
});