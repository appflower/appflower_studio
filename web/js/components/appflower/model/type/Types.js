Ext.ns('afStudio.model');

afStudio.model.Types = new function() {
	
	/**
	 * Returns type by its string name
	 * @param {String} type The type string.
	 * @return {Object} type
	 */
	this.getType = function(type) {
		return this[type.toUpperCase()];
	},
	
    Ext.apply(this, {
        
        /**
         * @property AUTO
         * @type Object.
         */
        AUTO : {
        	type: 'auto',
            validate: function(v) { return true; }
        },

        /**
         * @type Object.
         * @property STRING
         * This data type means that the raw data is converted into a String before it is placed into a Record.
         */
        STRING: {
        	type: 'string',
            validate: Ext.isString
        },

        /**
         * @property INT
         * @type Object.
         * This data type represents integer.
         */
        INTEGER: {
        	type: 'integer',
            validate: Ext.isNumber
        },
        
        /**
         * @property BOOLEAN
         * @type Object.
         */
        BOOLEAN: {
        	type: 'boolean',
            validate: function(v) {
            	return Ext.isBoolean(v);
            }
        },
        
        /**
         * @property DATE
         * @type Object.
         */
        DATE: {
        	type: 'date',
            validate: Ext.isDate
        }       
    });
};

afStudio.model.Types.POSITIVEINTEGER = {
	type: 'positiveInteger',
	
	validate: function(v) {
		return Ext.isNumber(v) && (v >= 0);
	}
};

afStudio.model.Types.PERMISSIONTYPE = {
	type: 'permissionType',
	
	pattern: /^(\w+|\*)(\s*,\s*\w+)*$/,
	
	validate: function(v) {
		if (!Ext.isString(v)) {
			return false;
		}
		v = v.trim();
		
		return this.pattern.test(v);
	}
};

afStudio.model.Types.INTERNALURITYPE = {
	type: 'internalUriType',
		
	pattern: new RegExp("^(/[\\w\\-.]+)*/?(\\?[\\w\\-.~%!$&'()*+,;=:@/?]*)?(\\#[\\w\\-.~%!$&'()*+,;=:@/?]*)?$"),
	
	validate: function(v) {
		if (!Ext.isString(v)) {
			return false;
		}
		v = v.trim();
		
		// (/[\w\-.]+)*/? - path
		// (\?[\w\-.~%!$&'()*+,;=:@/?]*)? - query
		// (\#[\w\-.~%!$&'()*+,;=:@/?]*)? - fragment
		// ^(/[\w\-.]+)*/?(\?[\w\-.~%!$&'()*+,;=:@/?]*)?(\#[\w\-.~%!$&'()*+,;=:@/?]*)?$
		
		return this.pattern.test(v);
	}
};

afStudio.model.Types.ABSOLUTEURITYPE = {
	type: 'absoluteUriType',
		
	pattern: /^\/?[\w/-]+\.[a-z]{1,4}$/,
	
	validate: function(v) {
		if (!Ext.isString(v)) {
			return false;
		}
		v = v.trim();
		
		return this.pattern.test(v);
	}
};

afStudio.model.Types.VIEWTYPE = {
	type: 'viewType',
	
	values: ['edit', 'list', 'show', 'layout', 'html', 'wizard', 'menu'],
	
	validate: function(v) {
		return this.values.indexOf(v) != -1;
	}
};

afStudio.model.Types.VALUETYPE = {
	type: 'valueType',
	
	values: ['orm', 'file', 'static'],
	
	validate: function(v) {
		return this.values.indexOf(v) != -1;
	}
};

afStudio.model.Types.FETCHTYPE = {
	type: 'fetchType',
	
	values: ['static', 'instance'],	
	
	validate: function(v) {
		return this.values.indexOf(v) != -1;
	}
};

afStudio.model.Types.ALIGNTYPE = {
	type: 'alignType',
	
	values: ['left', 'center', 'right'],	
	
	validate: function(v) {
		return this.values.indexOf(v) != -1;
	}
};

afStudio.model.Types.SORTTYPE = {
	type: 'sortType',
	
	values: ['ASC', 'DESC'],	
	
	validate: function(v) {
		return this.values.indexOf(v) != -1;
	}
};

afStudio.model.Types.DBNAMETYPE = {
	type: 'dbNameType',
	
	pattern: /^\w+$/,
	
	validate: function(v) {
		if (!Ext.isString(v)) {
			return false;
		}
		v = v.trim();
		
		return this.pattern.test(v);
	}
};

afStudio.model.Types.ARRAYTYPE = {
	type: 'arrayType',
	
	pattern: /^\[\w+\s*:\s*["'\w]+?(\s*,\s*\w+\s*:\s*["'\w]+?)*\]$/,
	
	validate: function(v) {
		if (!Ext.isString(v)) {
			return false;
		}
		v = v.trim();
		
		return this.pattern.test(v);
	}
};
