Ext.ns('afStudio.wd.list');

/**
 * @mixin ListModelInterface
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.list.ListModelInterface = (function() {
	
	var nodes = afStudio.ModelNode;
	
	return {
	
		/**
		 * Returns columns properties.
		 * @return {Array} columns properties
		 */
		getColumns : function() {
			return this.getModelChildrenProperties(nodes.FIELDS, nodes.COLUMN);
		},
		
		/**
		 * Returns row actions properties.
		 * @return {Array} row actions properties
		 */
		getRowActions : function() {
			return this.getModelChildrenProperties(nodes.ROW_ACTIONS, nodes.ACTION);
		}
	};
})();

/**
 * Extends base mixin {@link ModelProcessor} class.
 */
Ext.apply(afStudio.wd.list.ListModelInterface, afStudio.wd.ModelInterface);