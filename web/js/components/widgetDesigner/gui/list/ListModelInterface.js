Ext.ns('afStudio.wd.list');

/**
 * @mixin ListModelInterface
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.list.ListModelInterface = (function() {
	
	return {
	
		/**
		 * Returns columns properties.
		 * @return {Array} columns properties
		 */
		getColumns : function() {
			var N = this.NODES;
			
			return this.getModelChildrenProperties(N.FIELDS, N.COLUMN);
		},
		
		/**
		 * Returns row actions properties.
		 * @return {Array} row actions properties
		 */
		getRowActions : function() {
			var N = this.NODES;
			
			return this.getModelChildrenProperties(N.ROW_ACTIONS, N.ACTION);
		}
	};
})();

/**
 * Extends base mixin {@link afStudio.wd.ModelInterface} class.
 */
Ext.apply(afStudio.wd.list.ListModelInterface, afStudio.wd.ModelInterface);