Ext.ns('afStudio.wd');

/**
 * ModelMapper mixin provides base mapping <u>component <---> model</u> functionality for any view. 
 * Every view component should have <u>modelMapper</u> object property to be able to use model mapper mixin.
 * 
 * @dependency {afStudio.wd.ModelInterface} model interface mixin
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.ModelMapper = (function() {
	
	return {
		
		/**
		 * The key name holding the model node's id value.
		 * @constant {String} NODE_ID_MAPPER
		 */
		NODE_ID_MAPPER : '_model_',
		
		/**
		 * The key name holding the model node's data-value.
		 * @constant {String} NODE_VALUE_MAPPER
		 */
		NODE_VALUE_MAPPER : 'value',
		
		/**
		 * Returns component by a model node and property associated with it.
		 * @param {String|Node} node The node or node's id
		 * @param {String} (optional) property The node's property if a component is mapped to a node and its specific property
		 * @return {Object} component or null if component was not found
		 */
		getCmpByModel : function(node, property) {
			var nodeId = Ext.isString(node) ? node : node.id,
				mapping = null;
			
			if (Ext.isDefined(property)) {
				mapping = this.modelMapper[nodeId + '#' + property];
			}
			
			if (Ext.isEmpty(mapping)) {
				mapping = this.modelMapper[nodeId];
			}
				
			if (mapping) {
				return  Ext.isFunction(mapping) ? mapping() : mapping;
			}
			
	    	return null;
		},
		//eo getCmpByModel	
		
		/**
		 * Returns model node by a component associated with it. 
		 * If node was not found returns null/undefined.
		 * @param {Ext.Component} cmp The component
		 * @return {Node} node
		 */
		getModelByCmp : function(cmp) {
			var nodeId = cmp[this.NODE_ID_MAPPER];
				
			return this.getModelNode(nodeId);
		},
		
		/**
		 * Creates association (mapping) between component and model node.
		 * @param {String} node The model node ID
		 * @param {Object|Function} cmp The component or function returning it
		 */
		mapCmpToModel : function(node, cmp) {
			var nodeId = Ext.isString(node) ? node : node.id;
			
			this.modelMapper[nodeId] = cmp;
		},
		
		/**
		 * Removes association (unmapping) between component and model node.
		 * @param {String|Node} node The node or its id
		 */
		unmapCmpFromModel : function(node) {
			node = Ext.isString(node) ? node : node.id;
			delete this.modelMapper[node];
		},
		
		/**
		 * Creates the mapper function. All passed in parameters except the first one(mapper function) are added to the mapper.
		 * @param {Function} fn The mapper function
		 * @return {Funtion} mapper
		 */
		createMapper : function(fn) {
			var args = Array.prototype.slice.call(arguments, 1);
			return fn.createDelegate(this, args);
		}
	};
})();