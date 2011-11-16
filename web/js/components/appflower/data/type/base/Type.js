Ext.ns('afStudio.data.type');

/**
 * Base abstract class for data type description.
 * @dependency {afStudio.data.type.TypeRestrictions} Restrictions
 * @dependency {Ext.form} Form components
 * 
 * @abstract
 * 
 * @class afStudio.data.type.Type
 * @extends Object
 * @author Nikolai Babinski
 */
afStudio.data.type.Type = Ext.extend(Object, {
	/**
	 * Type name.
	 * @property type
	 * @type {String}
	 */
	type : null,
	
	/**
	 * Extends type by defining its union.
	 * @property union
	 * @type {Array} The array of type names or types.
	 * Example: ['String', 'AbsoluteUriType'] or [afStudio.data.Types.String, afStudio.data.Types.AbsoluteUriType]
	 */
	union : null,
	
	/**
	 * Editor field component.
	 * @property editorField 
	 * @type {Ext.form.Field} 
	 */
	editorField : null,
	
	/**
	 * Invalid message. Defaults to 'The value is invalid'.
	 * @property invalidMessage
	 * @type {String}
	 */
	invalidMessage : 'The value is invalid',
	
	/**
	 * Type restrictions. For more details look at {@link afStudio.data.type.TypeRestrictions}
	 * @property restrictions
	 * @type {Object} 
	 */
	restrictions : null,
	
	/**
	 * Converts value to the data type if possible else returns null.
	 * @abstract
	 * @param {Mixed} value The value being converted to this type.
	 */
	convert : function(value) {
		return null;
	},
	
	/**
	 * Type validation method. If value is valid for this data type this method returns true,
	 * otherwise it returns the validation error message. 
	 * @param {Mixed} value The value being validated
	 * @return {Boolean|String} true if value is valid
	 */
	validate : function(value) {
		var tr = afStudio.data.type.TypeRestrictions,
			rest = this.restrictions;
		
		if (this.union) {
			//if union is not valid and type itself doesn't has any restrictions then value is invalid	
			if (!this.validateUnion(value) && !rest) {
				return this.invalidMessage;
			} else if (this.validateUnion(value)) {
				return true;
			}
		}
		
		var valid = true;
		
		for (var r in rest) {
			var restriction = tr[r],
				facet = rest[r],
				valid = restriction.validate(value, facet);
			
			if (valid !== true) {
				valid = false;
				break;
			}
		}
		
		return valid ? true : this.invalidMessage;
	},
	
	/**
	 * Checks if value is one of union types.
	 * @param {Mixed} value The value being validated
	 * @return {Boolean}
	 */
	validateUnion : function(value) {
		var un = this.union,
			t = afStudio.data.Types;
		
		if (!Ext.isArray(un)) {
			throw String.format('Type.union: The union "{0}" is not an array.', un);
		}
		
		for (var i = 0, l = un.length; i < l; i++) {
			var type = Ext.isString(un[i]) ? t.getType(un[i]) : un[i];
			if (type.validate(value) === true) {
				return true;
			}
		}
		
		return false;
	},
	
	/**
	 * Returns default editor for values of this type. Editor is is one of the {@link Ext.form} fields.
	 * @param {Object} (Optional) cfg The configuration object being applied to the editor being created and returned.
	 * Configuration object can containes <i>editorField</i> property defining the editor component constructor, if this property is defined 
	 * then it is used instead the default type's editorField.
	 * @param {Boolean} (Optional) convert Convert value inside editor's validator method before validation (defaults to true).
	 * The value type is String inside editor's validator method that is why for some types as Number, Date it must be 
	 * converted before validation process.
	 *  
	 * @return {Ext.form.Field} editor
	 */
	editor : function(cfg, convert) {
		//convert is true by default
		convert = Ext.isDefined(convert) ? Boolean(convert) : true;
		
		var cfg = cfg || {},
			vls = this.restrictions ? this.restrictions.enumeration : [],
			editor;
		
		var validator = function(v) {
			if (v == '') {
				return true;
			}
			v = convert ? this.convert(v) : v;
			return this.validate(v);
		}.createDelegate(this);
		
		cfg.validator = validator;
		
		if (!Ext.isEmpty(vls)) {
			var store = [];
			for (var i = 0, l = vls.length; i < l; i++) {
				store.push([vls[i], vls[i]]);
			}
			editor = new Ext.form.ComboBox(Ext.apply({
				editable: true,
				typeAhead: true,
				lazyRender: true,
				local: true,
				store: store,
				triggerAction: 'all'
			}, cfg));
		} else {
			var edField = this.editorField;
			if (cfg.editorField) {
				edField = cfg.editorField;
				delete cfg.editorField;
			}
			editor = new edField(cfg);
		}
		
		return editor;
	}
});