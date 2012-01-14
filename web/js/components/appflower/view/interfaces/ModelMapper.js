Ext.ns('afStudio.view');

/**
 * ModelMapper mixin provides base mapping <u>component <---> model</u> functionality for any view. 
 * Every view component should have <u>modelMapper</u> object property to be able to use model mapper mixin.
 * 
 * @dependency {afStudio.view.ModelInterface} model interface mixin
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.view.ModelMapper = (function() {
    
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
         * @property modelMapper The store of view components -> model nodes relations
         * @type {Object} 
         */
        
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
        
        /**
         * Returns model node by a component associated with it. 
         * If node was not found returns null/undefined.
         * @param {Ext.Component} cmp The component
         * @return {Node|Array} node or array [node, property's value]
         */
        getModelByCmp : function(cmp) {
            var nodeId = cmp[this.NODE_ID_MAPPER],
                node, property;
            
            var hashPos = nodeId.indexOf('#');
            if (hashPos != -1) {
                property = nodeId.substr(hashPos + 1);
                nodeId = nodeId.substring(0, hashPos);
            }
            
            node = this.getModelNode(nodeId);
            
            if (property) {
                return [node, node.getPropertyValue(property)];
            }
            
            return node;
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
         * Creates the mapper function. 
         * All passed in parameters except the first one(mapper function) are added to the mapper.
         * @param {Function} fn The mapper function
         * @return {Funtion} mapper
         */
        createMapper : function(fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            return fn.createDelegate(this, args);
        },
        
		/**
		 * Dumps components & model nodes relations.
		 */
		dumpMapper : function() {
			afStudio.Logger.info('afStudio.view.ModelMapper', this.modelMapper);
			afStudio.Logger.info('----------dump-----------');
			Ext.iterate(this.modelMapper, function(k, v, o){
			    afStudio.Logger.info('\t', k, v);
			});
			afStudio.Logger.info('-------------------------');
		}
    };
})();