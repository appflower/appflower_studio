/**
 * Date data type description. 
 * 
 * @class afStudio.data.type.Date
 * @extends afStudio.data.type.Type
 * @author Nikolai Babinski
 */
afStudio.data.type.Date = Ext.extend(afStudio.data.type.Type, {
	/**
	 * Type name.
	 * @property type
	 * @type {String}
	 */
	type : "date",
	
	/**
	 * Editor field component.
	 * @property editorField 
	 * @type {Ext.form.Field} 
	 */
	editorField : Ext.form.DateField,	
	
	/**
	 * Converts value to date type if value cannot be converted returns null. 
	 * @override
	 * @param {Mixed} v The value being converted
	 * @return {Date}
	 */
	convert : function(v) {
        var formats = [
        	'm/d/Y', 'n/j/Y', 'n/j/y', 'm/j/y', 'n/d/y', 'm/j/Y', 'n/d/Y', 'm-d-y', 
        	'm-d-Y', 'm/d', 'm-d', 'md', 'mdy', 'mdY', 'd', 'Y-m-d', 'n-j', 'n/j'
        ];
        
        if (!v) {
            return null;
        }
        
        if (Ext.isDate(v)) {
            return v;
        }
        
        var date;
		for (var i = 0, len = formats.length; i < len && !date; i++) {
		    date = Date.parseDate(v, formats[i]);
		}
		if (date) {
			return date;
		}
		
        var parsed = Date.parse(v);
        return parsed ? new Date(parsed) : null;
	},
	
	/**
	 * Validates value. Details {@link afStudio.data.type.Type#validate} 
	 * @override
	 */
	validate : function(value) {
		if (Ext.isDate(value)) {
			return afStudio.data.type.Date.superclass.validate.call(this, value);
		}
		
		return this.invalidMessage;
	}	
});