Ext.ns('afStudio.wd.edit');

/**
 * @mixin EditModelInterface
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.edit.EditModelInterface = (function() {
	
	//shortcut to nodes list
	var nodes = afStudio.ModelNode;
	
	return {
	
		/**
		 * Returns array of field(s) (i:fields->i:field) properties.
		 * @param {Array|Object|Function} (optional) filter The fields filter, details {@link afStudio.wd.ModelInterface#getModelChildrenProperties}
		 * @return {Array} fields
		 */
		getFields : function(filter) {
			return this.getModelChildrenProperties(nodes.FIELDS, nodes.FIELD, filter);
		},

		/**
		 * Returns array of i:fields->i:button properties.
		 * @return {Array} buttons
		 */
		getFieldsButtons : function() {
			return this.getModelChildrenProperties(nodes.FIELDS, nodes.BUTTON);
		},
		
		/**
		 * Returns field-sets (i:grouping->i:set) properties.
		 * @param {Array|Object|Function} (optional) filter The field-sets filter, details {@link afStudio.wd.ModelInterface#getModelChildrenProperties} 
		 * @return {Array} field-sets
		 */
		getFieldSets : function(filter) {
			return this.getModelChildrenProperties(nodes.GROUPING, nodes.SET, filter);
		},
		
		/**
		 * Returns fields-sets with not empty "tabtitle" property.
		 * @return {Array} field-sets
		 */
		getTabbedFieldSets : function() {
			return this.getFieldSets(['tabtitle']);
		},
		
		/**
		 * Returns fields-sets with empty "tabtitle" property.
		 * @return {Array} field-sets
		 */
		getPlainFieldSets : function() {
			return this.getFieldSets(function(prop){
				return Ext.isEmpty(prop.tabtitle);
			});				
		},
		
		/**
		 * Returns references and fields properties from a field-set.
		 * @param {String|Node} setNode The field-set node or it's id
		 * @return {Array} references & fields :
		 *  [
		 *    "ref" - i:ref definition object,
		 *    "field" - i:field definition object mapped to i:ref->to property
		 *  ]
		 */
		getFieldsFromSet : function(setNode) {
			var refNodes = this.getModelChildrenProperties(setNode, nodes.REF),
				fields = [];
			
			Ext.each(refNodes, function(ref){
				var fs = this.getFields({name: ref.to});
				if (fs.length == 0) {
					afStudio.Msg.warning('Widget Designer', String.format('Field with name "{0}" does not exists. <br />' + 
					'Please correct "to" property value.', ref.to));
					return;
				}
				
				fields.push({ref: ref, field: fs[0]});
			}, this);
			
			return fields;
		},
		
		/**
		 * Returns fields from the default field-set.
		 * @return {Array} fields in default set
		 */
		getFieldsFromDefaultSet : function() {
			var mpr = this.getModelNodeMapper();
			
			var fldSets = this.getFieldSets(),
				fieldsInSets = [],
				defFields = [];
			
			Ext.each(fldSets, function(fs){
				var refs = this.getFieldsFromSet(fs[mpr]);
				Ext.each(refs, function(ref){
					fieldsInSets.push(ref.field.name);
				});
			}, this);

			var fields = this.getFields();
			Ext.each(fields, function(f){
				if (fieldsInSets.indexOf(f.name) == -1) {
					defFields.push(f);
				}
			});
			
			return defFields;
		}
		
	};
})();

/**
 * Extends base mixin {@link afStudio.wd.ModelInterface} class.
 */
Ext.apply(afStudio.wd.edit.EditModelInterface, afStudio.wd.ModelInterface);