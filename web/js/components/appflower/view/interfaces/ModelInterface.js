Ext.ns('afStudio.view');

/**
 * ModelInterface mixin provides communication interface between a view and a model.
 * @singleton
 * 
 * @dependency {afStudio.view.ModelMapper} mapper mixin The view which uses ModelInterface must use ModelMapper mixin
 * 
 * @author Nikolai Babinski
 */
afStudio.view.ModelInterface = (function() {
    
    return {
        
        /**
         * Returns model node based on its relative path from the root node.
         * Path is based on node's id or partial id (tag name without trailing "-xxx", where xxx are numbers).
         * Node searching first is based on exact id if failed is used id's partial version.
         * For example: <code>i:datasource/i:method/i:param</code> 
         * or <code>[i:datasource, i:method, i:param]</code> returns parameter model node.
         * @param {String|Array} nodePath The node path
         * @return {Node} node or null if searching failed
         */
        getModelNodeByPath : function(nodePath) {
            var c = this.controller;
            
            var path = Ext.isArray(nodePath) ? nodePath : nodePath.split(c.pathSeparator),
                m = this.controller.getRootNode(),
                node;
            for (var i = 0, l = path.length; i < l; i++) {
                node = m.findChildById(path[i]);
                node = !node ? m.findChildById(path[i], false, true) : node;
                if (!node) {
                    break;
                }
                m = node;
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
         * Returns model node properties + model node's id in {@link afStudio.view.ModelMapper#NODE_ID_MAPPER} property.
         * @param {String|Node} node
         * @return {Object} properties
         */
        getModelNodeProperties : function(node) {
            var node = this.getModelNode(node),
                ps = node.getPropertiesHash(true);
            ps[this.NODE_ID_MAPPER] = node.id;
            
            return ps;
        },
    
        /**
         * Returns model node property.
         * @param {String|Node} node
         * @param {String} property The property's name
         * @return {Mixed} property or undefined if property was not found
         */
        getModelNodeProperty : function(node, property) {
            var ps = this.getModelNodeProperties(node);
            
            return ps[property];
        },
        
        /**
         * Returns model node data-value(_content).
         * @param {String|Node} node
         * @return {Object} value + model node's id in {@link afStudio.view.ModelMapper#NODE_ID_MAPPER} property 
         */
        getModelNodeValue : function(node) {
            var node = this.getModelNode(node),
                nv = {};
            nv[this.NODE_VALUE_MAPPER] = node.getNodeDataValue();
            nv[this.NODE_ID_MAPPER] = node.id;
            
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
                
            return  c.getNodeById(node) ? true 
                    : (notExact ? (m.findChildById(node, true, true) != null ? true : false) : false);
        },
        
        /**
         * Returns the child nodes properties of specified model node. 
         * Children nodes are filtered by tag name. 
         * 
         * @param {String|Node} parent The parent model node's ID OR object
         * 
         * @param {String|Node} child The child node's tag name OR node object
         * 
         * @param {Array|Object|Function} (optional) childProp Will be returned only children:
         * <ul>
         *  <li><b>Array</b>: If specified in array properties are not "empty" {@link Ext.isEmpty}</li>
         *  <li><b>Object</b>: Having equal to specified in childProp object properties</li>
         *  <li><b>Function</b>: When a function returns true</li>
         * </ul>
         * By default all children are returned.
         * 
         * @return {Array} child nodes properties
         */
        getModelChildrenProperties : function(parent, child, childProp) {
            if (this.isModelNodeExists(parent)) {
                var parent = this.getModelNode(parent),
                    childTag = Ext.isString(child) ? child : child.tag;
                
                var ns;
                if (Ext.isDefined(childProp)) {
                    ns = parent.filterChildrenBy(function(n){
                        if (n.tag != childTag) {
                            return false
                        }
                        
                        var np = n.getPropertiesHash(true),
                            match = true;
                    
                        if (Ext.isArray(childProp)) {
                            
                            Ext.each(childProp, function(p){
                                return match = (Ext.isEmpty(np[p]) ? false : true);
                            });
                            
                        } else if (Ext.isObject(childProp)) {
                            
                            Ext.iterate(childProp, function(k, v){
                                return match = (np[k] != v ? false : true); 
                            });
                            
                        } else if (Ext.isFunction(childProp)) {
                            if (childProp.apply(this, [np]) === false) {
                                match = false;
                            }
                        }
                        
                        return match;
                    });
                } else {
                    ns = parent.filterChildren(childTag);
                }
                
                var ps = [];    
                for (var i = 0, len = ns.length; i < len; i++) {
                    ps[i] = this.getModelNodeProperties(ns[i]);
                }
                
                return ps;
            }
            
            return [];
        },
        //eo getModelChildrenProperties
        
        /**
         * Checks model node existence and properties status.
         * @param {String|Node} node The model id or the model node object
         * @param {Object|Function} st The model node status object, key/value pairs of properties
         * @return {Boolean} returns true if the node is present in the model with properties whose values equal to status object
         */
        isModelStatus : function(node, st, scope) {
            if (this.isModelNodeExists(node)) {
                node = this.getModelNode(node);
                
                if (Ext.isFunction(st)) {
                    return st.call(scope || this, node);
                } else {
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
            }
            
            return false;
        }
    };
})();