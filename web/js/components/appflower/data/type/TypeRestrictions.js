Ext.ns('afStudio.data.type');

/**
 * Type restrictions.
 * @singleton
 * 
 * @param {Mixed} value The value being validated
 * @param {Mixed} facet The restriction's value
 * @return {Boolean|String} true when validation succeeded otherwise returns invalid {@link #message} message
 * 
 * @author Nikolai Babinski
 */
afStudio.data.type.TypeRestrictions = (function() {
	return {
		
		/**
		 * The exact number of characters allowed.
		 * Facet's type is Number.
		 */
		length : {
			message : "length: The value's length must be {0}",
			validate : function(value, facet) {
				return value.length == facet ? true : String.format(this.message, facet); 
			}
		},
		
		/**
		 * Specifies the minimum length allowed.
		 * Facet's type is Number, must be 0 or greater.
		 */
		minLength : {
			message : "minLength: The value's length must not be less than {0}",
			validate : function(value, facet) {
				return value.length >= facet ? true : String.format(this.message, facet);
			}
		},
		
		/**
		 * Specifies the maximum length allowed.
		 * Facet's type is Number, must be 0 or greater.
		 */
		maxLength : {
			message : "minLength: The value's length must not be more than {0}",
			validate : function(value, facet) {
				return value.length <= facet ? true : String.format(this.message, facet);
			}
		},
		
		/**
		 * Pattern determines what characters are allowed and in what order.
		 * Facet's type is RegExp.
		 */
		pattern : {
			message : "pattern: The value contains invalid characters",
			validate : function(value, facet) {
				if (!(facet instanceof RegExp)) {
					throw String.format('TypeRestrictions.pattern: The facet "{0}" is not a regular expression.', facet);
				}
				return facet.test(value) ? true : this.message;
			}
		},
		
		/**
		 * Specifies a list(enumeration) of all valid values for a type. Constrains value space by an enumeration list.
		 * Facet's type is Array.
		 */
		enumeration : {
			message : 'enum: value "{0}" is not in enumeration list "{1}"',
			validate : function(value, facet) {
				if (!Ext.isArray(facet)) {
					throw String.format('TypeRestrictions.enumeration: The facet "{0}" is not an array.', facet);
				}
				return facet.indexOf(value) != -1 ? true : String.format(this.message, value, facet);
			}
		},
		
		/**
		 * The lower range for numerical values.
		 * The value must be <i>greater than or equal to</i> minInclusive facet.
		 * Facet's type is Number.
		 */
		minInclusive : {
			message : 'minInclusive: value {0} must be greater than or equal to {1}',
			validate : function(value, facet) {
				if (!Ext.isNumber(facet)) {
					throw String.format('TypeRestrictions.minInclusive: The facet "{0}" is not a number.', facet);
				}
				return value >= facet ? true : String.format(this.message, value, facet);
			}
		},
		
		/**
		 * The upper range for numerical values.
		 * The value must be <i>less than or equal to</i> maxInclusive facet.
		 * Facet's type is Number.
		 */
		maxInclusive : {
			message : 'maxInclusive: value {0} must be less than or equal to {1}',
			validate : function(value, facet) {
				if (!Ext.isNumber(facet)) {
					throw String.format('TypeRestrictions.maxInclusive: The facet "{0}" is not a number.', facet);
				}
				return value <= facet ? true : String.format(this.message, value, facet);
			}
		},
		
		/**
		 * The lower range for numerical values.
		 * The value must be <i>greater</i> than minExclusive facet.
		 * Facet's type is Number.
		 */
		minExclusive : {
			message : 'minExclusive: value {0} must be greater than {1}',
			validate : function(value, facet) {
				if (!Ext.isNumber(facet)) {
					throw String.format('TypeRestrictions.minExclusive: The facet "{0}" is not a number.', facet);
				}
				return value > facet ? true : String.format(this.message, value, facet);
			}
		},
		
		/**
		 * The upper range for numerical values.
		 * The value must be <i>less</i> than maxExclusive facet.
		 * Facet's type is Number.
		 */
		maxExclusive : {
			message : 'maxExclusive: value {0} must be less than {1}',
			validate : function(value, facet) {
				if (!Ext.isNumber(facet)) {
					throw String.format('TypeRestrictions.maxExclusive: The facet "{0}" is not a number.', facet);
				}
				return value < facet ? true : String.format(this.message, value, facet);
			}
		}
		
		/**
		 * TODO implement the following restrictions:
		 * totalDigits
		 * fractionDigits
		 * Their meaning is the same as for corresponding restrictions in xml xsd schema.
		 * @link http://www.w3.org/TR/xmlschema-0/#SimpleTypeFacets
		 */
	}
})();