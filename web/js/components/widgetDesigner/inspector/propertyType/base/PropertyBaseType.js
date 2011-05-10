Ext.ns('afStudio.wi');

/**
 * Each node that is inside WI tree can have many properties.
 * Each of that property can be different type, one can be choice widget and other simple input field
 * This class defines base class for all concrete properties
 */
afStudio.wi.PropertyBaseType = Ext.extend(Object, {
    /**
     * @cfg {Stdung} (Required) id
     */    
	
	/**
     * @cfg {String} (Required) label
     */
	
	/**
	 * Property value
	 * @property value
	 * @type {Mixed}
	 */
	
    /**
     * @cfg {Mixed} defaultValue (defaults to '') 
     * Used when value was not set. 
     * This should be set by class implementing concrete type
     */
    defaultValue : ''
    
    ,type : 'string'	
    
	/**
	 * Contains flag if this field is required.
	 * @cfg {Boolean} required (defaults to false)  
	 */
	,required : false

	/**
	 * PropertyBaseType constructor.
	 * @constructor
	 */
	,constructor : function(config) {
		config = config || {};
		Ext.apply(this, config);
	}//eo constructor
	 	
	,setRequired : function() {
		this.required = true;
		return this;
	}//eo setRequired
	
	,setValue : function(v) {
		this.value = v;
		return this;
	}//eo setValue
	
	/**
	 * Creates record:
	 * <ul>
	 * <li><b>name</b>: The unique property-name inside properties records.</li>
	 * <li><b>value</b>: Property's value</li>
	 * <li><b>required</b>: This property is required or not.</li>
	 * </ul>
	 * @return {Ext.data.Record} record 
	 */
    ,create : function() {
        var recordConstructor = Ext.data.Record.create([
            {name: 'name', type: 'string'},
            {name: 'value', type: this.type},
            'required'
        ]);
        
        var r = new recordConstructor({
            name: this.label,
            value: Ext.isDefined(this.value) ? this.value : this.defaultValue,
            required: this.required ? "Mandatory" : 'Optional'
        }, this.id);
        
        r.type = this.type;
        r.originalStore = this.store;
        
        return r;
    }//eo create   
});