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
		}
	};
})();

/**
 * Extends base mixin {@link afStudio.wd.ModelInterface} class.
 */
Ext.apply(afStudio.wd.edit.EditModelInterface, afStudio.wd.ModelInterface);