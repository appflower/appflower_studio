Ext.ns('afStudio.wd');

/**
 * ModelInterface mixin provides communication interface between a view and a model.
 * @singleton
 * 
 * @dependency {afStudio.view.ModelMapper} mapper mixin The view which uses ModelInterface must use ModelMapper mixin
 * @dependency {afStudio.ModelNode} model nodes
 * 
 * @author Nikolai Babinski
 */
afStudio.wd.ModelInterface = (function() {
	
	return {
		/**
		 * The reference to model nodes {@link afStudio.ModelNode}
		 * @constant {Object} NODES
		 */
		NODES : afStudio.ModelNode,
		
		/**
		 * Returns action nodes properties.
		 * @return {Array} actions properties
		 */
		getActions : function() {
			var n = this.NODES;
			return this.getModelChildrenProperties(n.ACTIONS, n.ACTION);
		},
		
		/**
		 * Returns more-action nodes properties.
		 * @return {Array} actions properties
		 */
		getMoreActions : function() {
			var n = this.NODES;
			return this.getModelChildrenProperties(n.MORE_ACTIONS, n.ACTION);
		}
		
	};
})();


/**
 * Extends base mixin {@link afStudio.view.ModelInterface}
 */
Ext.applyIf(afStudio.wd.ModelInterface, afStudio.view.ModelInterface);
