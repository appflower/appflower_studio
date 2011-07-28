Ext.ns('afStudio.model');

/**
 * @class afStuio.model.Property
 * <p>This class encapsulates the property definition information specified in the {@link afStuio.model.Node#properties}.</p>
 * <p>Developers do not need to instantiate this class. Instances are created by {@link afStuio.model.Node#initProperties}</p>
 * 
 * @dependency
 * Types: {@link afStudio.model.Types}
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.Property = Ext.extend(Object, {
    /**
     * @cfg {String} (Required) name
     * The name by which the property is referenced within the Model Node.
     * For properties inside a model node <i>name</i> should be unique.
     */
    /**
     * @cfg {Mixed} (Optional) value
     * The property value.
     */
    /**
     * @cfg {Mixed} (Optional) type (defaults to {@link afStudio.model.Types.AUTO}, if is not specified)
     * The data type. Look at {@link afStudio.model.Types} class.
     */
	/**
	 * @cfg {Boolean} (Optional) required (defaults to false)
	 */
	required : false,
	/**
	 * @cfg {Boolean} (Optional) readOnly (defaults to false)
	 * The readOnly flag states that a property value should not be editable outside the model.
	 */
	readOnly : false,
    /**
     * @cfg {Mixed} (Optional) defaultValue
     * The default value.
     */
    
    /**
     * @constructor
     * @param {Object} config The configuration object
     */
    constructor : function(config) {
        Ext.apply(this, config);

        var types = afStudio.model.Types;

        if (this.type) {
            if (Ext.isString(this.type)) {
                this.type = types[this.type.toUpperCase()] || types.AUTO;
            }
        } else {
            this.type = types.AUTO;
        }
    },
    
    /**
     * Validates passed in value against property's type.
     * @param {Mixed} v The value to be validated.
     * @return {Boolean}
     */
    validate : function(v) {
    	return this.type.validate(v);
    },
    
    /**
     * Validates property value.
     * @return {Boolean} true if valid otherwise false.
     */
    isValid : function() {
    	return this.required && this.value ? this.validate(this.value) : true;
    },
    
    /**
     * Returns property value.
     * @return {Mixed} value
     */
    getValue : function() {
    	return this.value ? this.value : this.defaultValue;
    },
    
    /**
     * Sets property value. If the passed in value is invalid returns false.
     * @param {Mixed} v The new value being set
     */
    setValue : function(v) {
    	if (!this.validate(v)) {
    		return false;
    	}
		this.value = v;    	
    },
    
    /**
     * Returns property's data object.
     * @return {Object} property
     */
    getPropertyHash : function() {
    	var pr = {};
    	for(var p in this) {
    		if (!Ext.isFunction(this[p])) {
    			pr[p] = this[p];
    		}
    	}
    	
    	return pr;
    }
});