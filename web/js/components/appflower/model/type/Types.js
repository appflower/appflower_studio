Ext.ns('afStudio.model');

afStudio.model.Types = new function() {
	
    Ext.apply(this, {
        
        /**
         * @property AUTO
         * @type Object.
         */
        AUTO : {
            validate: function(v) { return true; }
        },

        /**
         * @type Object.
         * @property STRING
         * This data type means that the raw data is converted into a String before it is placed into a Record.
         */
        STRING: {
            validate: Ext.isString
        },

        /**
         * @property INT
         * @type Object.
         * This data type represents integer.
         */
        INTEGER: {
            validate: Ext.isNumber
        },
        
        /**
         * @property BOOLEAN
         * @type Object.
         */
        BOOLEAN: {
            validate: Ext.isBoolean
        },
        
        /**
         * @property DATE
         * @type Object.
         */
        DATE: {
            validate: Ext.isDate
        }       
    });
};

afStudio.model.Types.VIEWTYPE = {
	validate: function(v) {
		return this.values.indexOf(v) != -1;
	},
	
	values: ['edit', 'list', 'show', 'layout', 'html', 'wizard', 'info', 'menu']
};

afStudio.model.Types.VALUETYPE = {
	validate: function(v) {
		return this.values.indexOf(v) != -1;
	},
	
	values: ['orm', 'file', 'static']
};