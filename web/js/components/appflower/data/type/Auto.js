/**
 * Default type for a data which type is not explicitly set up.
 * 
 * @class afStudio.data.type.Auto
 * @extends afStudio.data.type.Type
 * @author Nikolai Babinski
 */
afStudio.data.type.Auto = Ext.extend(afStudio.data.type.Type, {
	
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
	type : "auto",
			
	/**
	 * Returns the same value without any change.
	 * @override
	 */
	convert : function(value) {
		return value;
	}	
});