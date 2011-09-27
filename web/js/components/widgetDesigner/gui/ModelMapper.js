Ext.ns('afStudio.wd');

/**
 * ModelMapper mixin provides base mapping component <---> model functionality for any view. 
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
		 * Returns grid's component by a model.
		 * @public
		 * @interface
		 * @param {String|Node} node The model node or model node's id
		 * @param {String} property The model node's property
		 * @return {Ext.Component} node
		 */
		getCmpByModel : function(node, property) {
			var nId = Ext.isString(node) ? node : node.id;
			var mapping = this.modelMapper[nId] || (property ? this.modelMapper[nId + '#' + property] : false);
			if (mapping) {
				return  Ext.isFunction(mapping) ? mapping() : mapping;
			}
			
	    	return null;
		},
		//eo getCmpByModel	
		
		/**
		 * Returns model node by component associated with it. If node was not found returns null/undefined.
		 * @public
		 * @interface
		 * @param {Ext.Component} cmp The grid's component associated with a model node
		 * @return {Node} model node
		 */
		getModelByCmp : function(cmp) {
			var nodeId = cmp[this.NODE_ID_MAPPER];
				
			return this.getModelNode(nodeId);
		},
		
		
		/**
		 * Maps this grid's component to a model node.
		 * @protected
		 * @param {String} node The model node ID
		 * @param {Component/Function} cmp The component being mapped to the model node or a function returning a mapped component
		 */
		mapCmpToModel : function(node, cmp) {
			this.modelMapper[node] = cmp;
		},
		
		/**
		 * Unmaps the grid's component from the model node.
		 * @protected
		 * @param {String/Node} node The model node's ID or model node
		 */
		unmapCmpFromModel : function(node) {
			node = Ext.isString(node) ? node : node.id;
			delete this.modelMapper[node];
		},
		
		/**
		 * Creates the mapper function. All passed in parameters except the first one(mapper function) are added to the mapper.
		 * @protected
		 * @param {Function} fn The function mapper
		 * @return {Funtion} mapper
		 */
		createMapper : function(fn) {
			var args = Array.prototype.slice.call(arguments, 1);
			return fn.createDelegate(this, args);
		}
	};
})();