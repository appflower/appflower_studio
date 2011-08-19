Ext.ns('afStudio.wd');

/**
 * Mixin.  
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.ModelInterface = (function() {
	
	/**
	 * Holds model's node key name.
	 * @constant modelNodeMapper
	 */
	var modelNodeMapper = '_model_';
	
	/**
	 * The key name of model node's data-value.
	 * @constant modelNodeValue
	 */
	var modelNodeValue = 'value';
	
	return {

		/**
		 * Returns modelNodeMapper constant.
		 * @return {string} mapper name
		 */
		getModelNodeMapper : function() {
			return modelNodeMapper;
		},
		
		/**
		 * Returns modelNodeValue constant.
		 */
		getValueKey : function() {
			return modelNodeValue;
		},
		
		/**
		 * Returns model node based on its relative path from the root node.
		 * Path is based on node's id or partial id (tag name without trailing "-xxx", where xxx are numbers).
		 * Node searching first is based on exact id if failed is used id's partial version.
		 * For example: <code>i:datasource/i:method/i:param</code> returns parameter model node.
		 * @param {String} nodePath The node path
		 * @return {Node} node or null if searching failed
		 */
		getModelNodeByPath : function(nodePath) {
			var c = this.controller,
				m = this.controller.getRootNode(),
				node;
			
    		var path = nodePath.split(c.pathSeparator);
	    	for (var i = 0, l = path.length; i < l; i++) {
		    	var n = m.findChildById(path[i]);
		    	node = !n ? m.findChildById(path[i], false, true) : n;
		    	if (!node) {
		    		break;
		    	}
	    	}
	    	
	    	return node;
		},
		
		/**
		 * Returns model node.
		 * @param {String|Node} node The node id or node's relative path 
		 * @return {Node} model node 
		 */
		getModelNode : function(node) {
			var c = this.controller;
			if (Ext.isString(node)) {
				node = (node.indexOf(c.pathSeparator) != -1) ? this.getModelNodeByPath(node) : c.getNodeById(node);
			}
			
			return node;
		},
		
		/**
		 * Returns model node properties + model node's id in modelNodeMapper property {@link #getModelNodeMapper}.
		 * @param {String|Node} node
		 * @return {Object} properties
		 */
		getModelNodeProperties : function(node) {
			var node = this.getModelNode(node),
				ps = node.getPropertiesHash(true);
			ps[modelNodeMapper] = node.id;
			
			return ps;
		},
	
		/**
		 * Returns model node data-value(_content).
		 * @param {String|Node} node
		 * @return {Object} value + model node's id in modelNodeMapper property {@link #getModelNodeMapper} 
		 */
		getModelNodeValue : function(node) {
			var node = this.getModelNode(node),
				nv = {};
			nv[modelNodeValue] = node.getNodeDataValue();
			nv[modelNodeMapper] = node.id;
			
			return nv;
		},
		
		/**
		 * Returns node's property editor field.
		 * @param {Node} node The model node
		 * @param {String} property The property which type's editor is returned
		 * @param {Object} (Optional) edCfg The editor configuration object
		 * @return {Ext.form.Field} editor
		 */
		getPropertyEditor : function(node, property, edCfg) {
			var edCfg = edCfg || {},
				p = node.getProperty(property);
			return p.type.editor(edCfg);
		},
		
		/**
		 * Checks model's node existence.
		 * @param {String|Node} node The model id or the model node object
		 * @param {Boolean} (Optional) notExact Checking not exact match, 
		 * removes "-x" part, where x is a number from ID. (defaults to false)
		 * @return {Boolean}
		 */
		isModelNodeExists : function(node, notExact) {
			var c = this.controller,
				m = c.getRootNode();
			
			node = !Ext.isString(node) ? node.id : node;	
				
			return 	c.getNodeById(node) ? true 
					: (notExact ? (m.findChildById(node, true, true) != null ? true : false) : false);
		},
		
		/**
		 * Returns the child nodes properties of specified model node. 
		 * Children nodes are filtered by tag name. 
		 * @param {String|Node} parent The parent model node, ID or object
		 * @param {String|Node} child The child node's tag name or node object
		 * @return {Array} child nodes properties
		 */
		getModelChildrenProperties : function(parent, child) {
			if (this.isModelNodeExists(parent)) {
				var parent = this.getModelNode(parent),
					childTag = Ext.isString(child) ? child : child.tag,				
					ns = parent.filterChildren(childTag);
				
				var ps = [];	
				for (var i = 0, len = ns.length; i < len; i++) {
					ps[i] = this.getModelNodeProperties(ns[i]);
				}
				
				return ps;
			}
			
			return [];
		},
		
		/**
		 * Checks model node existence and properties status.
		 * @param {String|Node} node The model id or the model node object
		 * @param {Object} st The model node status object, key/value pairs of properties
		 * @return {Boolean} returns true if the node is present in the model with properties whose values equal to status object
		 */
		isModelStatus : function(node, st) {
			if (this.isModelNodeExists(node)) {
				node = this.getModelNode(node);
				
				var status = true;
				for (var p in st) {
					var pv = node.getPropertyValue(p);
					if (pv != st[p]) {
						status = false;
						break;
					}
				}
				return status;
			}
			
			return false;
		},
		
		/**
		 * Returns action nodes properties.
		 * @return {Array} actions properties
		 */
		getActions : function() {
			var n = afStudio.ModelNode;
			return this.getModelChildrenProperties(n.ACTIONS, n.ACTION);
		},
		
		/**
		 * Returns more-action nodes properties.
		 * @return {Array} actions properties
		 */
		getMoreActions : function() {
			var n = afStudio.ModelNode;
			return this.getModelChildrenProperties(n.MORE_ACTIONS, n.ACTION);
		}
		
	};
})();