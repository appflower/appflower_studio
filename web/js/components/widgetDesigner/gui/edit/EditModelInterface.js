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
		 * Returns array of field(s) properties.
		 * @return {Array} fields
		 */
		getFields : function() {
			return this.getModelChildrenProperties(nodes.FIELDS, nodes.FIELD);
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
		 * @param {Array|Object} (optional) withProp Return field-sets having specific properties 
		 * @return {Array} field-sets
		 */
		getFieldSets : function(withProp) {
			return this.getModelChildrenProperties(nodes.GROUPING, nodes.SET, withProp);
		},
		
		getTabbedFieldSets : function() {
			return this.getFieldSets(['tabtitle']);
		},
		
		getPlainFieldSets : function() {
			return this.getFieldSets(function(prop){
				return Ext.isEmpty(prop.tabtitle);
			});				
		}
		
	};
})();

/**
 * Extends base mixin {@link afStudio.wd.ModelInterface} class.
 */
Ext.apply(afStudio.wd.edit.EditModelInterface, afStudio.wd.ModelInterface);