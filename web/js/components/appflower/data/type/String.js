/**
 * String data type description.
 * 
 * @class afStudio.data.type.String
 * @extends afStudio.data.type.Type
 * @author Nikolai Babinski
 */
afStudio.data.type.String = Ext.extend(afStudio.data.type.Type, {
	/**
	 * Editor field component.
	 * @property editorField 
	 * @type {Ext.form.Field} 
	 */
	editorField : Ext.form.TextField,
	
	/**
	 * Type name.
	 * @property type
	 * @type {String}
	 */
	type : "string",
	
	/**
	 * @override
	 */
	convert : function(value) {
		return (value === undefined || value === null) ? '' : String(value);
	},
	
	/**
	 * @override
	 */
	validate : function(value) {
		if (Ext.isString(value) || Ext.isString(this.convert(value))) {
			return afStudio.data.type.String.superclass.validate.call(this, value);
		}
		
		return this.invalidMessage;
	}	
});