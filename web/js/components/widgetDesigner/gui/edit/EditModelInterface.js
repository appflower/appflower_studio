Ext.ns('afStudio.wd.edit');

/**
 * @mixin EditModelInterface
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.edit.EditModelInterface = (function() {
	
	return {
	
		/**
		 * Checks if the view is grouped: has i:grouping node and at least one i:set node. 
		 */
		isGrouped : function() {
			var setNode = this.getModelNodeByPath([this.NODES.GROUPING, this.NODES.SET]);
			
			return setNode ? true : false;
		},
		
		/**
		 * Returns array of field(s) (i:fields->i:field) properties.
		 * @param {Array|Object|Function} (optional) filter The fields filter, details {@link afStudio.wd.ModelInterface#getModelChildrenProperties}
		 * @return {Array} fields
		 */
		getFields : function(filter) {
			return this.getModelChildrenProperties(this.NODES.FIELDS, this.NODES.FIELD, filter);
		},

		/**
		 * Returns array of i:fields->i:button properties.
		 * @return {Array} buttons
		 */
		getFieldsButtons : function() {
			return this.getModelChildrenProperties(this.NODES.FIELDS, this.NODES.BUTTON);
		},
		
		/**
		 * Returns field-sets (i:grouping->i:set) properties.
		 * @param {Array|Object|Function} (optional) filter The field-sets filter, details {@link afStudio.wd.ModelInterface#getModelChildrenProperties} 
		 * @return {Array} field-sets
		 */
		getFieldSets : function(filter) {
			return this.getModelChildrenProperties(this.NODES.GROUPING, this.NODES.SET, filter);
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
			var refNodes = this.getModelChildrenProperties(setNode, this.NODES.REF),
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
			var nodeIdMpr = this.NODE_ID_MAPPER;
			
			var fldSets = this.getFieldSets(),
				fieldsInSets = [],
				defFields = [];
			
			Ext.each(fldSets, function(fs){
				var refs = this.getFieldsFromSet(fs[nodeIdMpr]);
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
		},
		
		/**
		 * Returns field index inside the default field-set or null if field doesn't exits in default field-set.
		 * @return {Number} index or null 
		 */
		getDefaultSetFieldIndex : function(fld) {
			var nodeIdMpr = this.NODE_ID_MAPPER,
				fs = this.getFieldsFromDefaultSet();
			
			var pos = Ext.each(fs, function(f){
				return f[nodeIdMpr] == fld[nodeIdMpr] ? false : true;
			});
			
			return Ext.isDefined(pos) ? pos : null;
		}
		
	};
})();

/**
 * Extends base mixin {@link afStudio.wd.ModelInterface} class.
 */
Ext.apply(afStudio.wd.edit.EditModelInterface, afStudio.wd.ModelInterface);