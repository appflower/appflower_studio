Ext.ns('afStudio.model');

/**
 * @class afStuio.model.Property
 * <p>This class encapsulates the property definition information specified in the {@link afStuio.model.Node#properties}.</p>
 * <p>Developers do not need to instantiate this class. Instances are created by {@link afStuio.model.Node#initProperties}</p>
 * 
 * @dependency {afStudio.data.Types} types
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.Property = Ext.extend(Object, {
    /**
     * @cfg {String} name
     * The name by which the property is referenced within the Model Node.
     * For properties inside a model node <i>name</i> should be unique.
     */
    /**
     * @cfg {Mixed} (optional) value
     * The property value.
     */
    /**
     * @cfg {Mixed} (optional) type (defaults to {@link afStudio.model.Types.AUTO}, if is not specified)
     * The data type. Look at {@link afStudio.model.Types} class.
     */
	/**
	 * @cfg {Boolean} (optional) required (defaults to false)
	 */
	required : false,
	/**
	 * @cfg {Boolean} (optional) readOnly (defaults to false)
	 * The readOnly flag states that a property value should not be editable outside the model.
	 */
	readOnly : false,
    /**
     * @cfg {Mixed} (optional) defaultValue
     * The default value.
     */
    
    /**
     * @constructor
     * @param {Object} config The configuration object
     */
    constructor : function(config) {
        Ext.apply(this, config);

        //TODO should be possible to configure types namespace & object
        var types = afStudio.data.Types;

        if (this.type) {
            if (Ext.isString(this.type)) {
                this.type = types.getType(this.type) || types.AUTO;
            }
        } else {
            this.type = types.AUTO;
        }
    },
    
    /**
     * Validates value against property's type.
     * Important: if property is not required and a value is "empty"(Ext.isEmpty) it's considered as valid.
     * @param {Mixed} v The value to be validated.
     * @return {Boolean}
     */
    validate : function(v) {
    	return (!this.required && Ext.isEmpty(v)) ? true : (this.type.validate(v) === true);
    },
    
    /**
     * Checks if a property is valid. 
     * Returns true if property is valid otherwise false. 
     * @return {Boolean}
     */
    isValid : function() {
        var v = this.getValue();
        
    	return this.required ? (!Ext.isEmpty(v) && this.type.validate(v) === true) : true;
    },
    
    /**
     * Returns property error message.
     * @return {String} message
     */
    getErrors : function() {
    	var errors = this.type.validate(this.value);
    	
    	if (this.required && Ext.isEmpty(this.value)) {
    		errors = 'This property is required.'; 
    	}
    	
    	return errors === true ? null : errors;
    },
    
    /**
     * Returns property's value. If {@link #value} property is not defined returns {@link #defaultValue}.
     * @return {Mixed} value
     */
    getValue : function() {
    	return Ext.isDefined(this.value) ? this.value : this.defaultValue;
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
     * Returns data object consists of all property's fields. 
     * @return {Object} property
     */
    getPropertyHash : function() {
    	var vl = ['name', 'value', 'type', 'required', 'readOnly', 'defaultValue'],
    		pr = {};
    	
    	for(var p in this) {
    		if (!Ext.isFunction(this[p]) && vl.indexOf(p) !== -1) {
    			pr[p] = this[p];
    		}
    	}

    	return pr;
    }
});