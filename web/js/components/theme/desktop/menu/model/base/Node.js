Ext.ns('afStudio.theme.desktop.menu.model');

/**
 * Menu base model node.
 * 
 * @class afStudio.theme.desktop.menu.model.Node
 * @extends afStudio.model.Node
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.theme.desktop.menu.model.Node = Ext.extend(afStudio.model.Node, {
    /**
     * Node has no value data.
     */
    _content : null,
    
    /**
     * Applies node definition object.
     * Sets properties and instantiates children nodes.
     * @overrride
     * @protected
     * @param {Mixed} definition The node definition object
     * @param {Boolean} silent If silent is true all node's events are suspended
     */
    applyNodeDefinition : function(definition, silent) {
        var me = this,
            ns = afStudio.theme.desktop.menu.model;

        if (!Ext.isDefined(definition)) {
            return;
        }
        
        silent ? this.suspendEvents() : null;
        
        if (Ext.isObject(definition)) {
            var def = Ext.apply({}, definition);
            
            if (def.attributes) {
                this.applyProperties(def.attributes);
            }
            
            var modelType = me.getModelType();
            
            if (def.children) {
	            Ext.iterate(def.children, function(n, d) {
                    var nt = Ext.isObject(d.attributes) ? d.attributes.type : null;
                    nt = Ext.isEmpty(nt) ? (modelType == 'main' ? ns.Nodes.ITEM : ns.Nodes.TOOL) : nt;
                    
                    //set service name property
                    if (nt != ns.Nodes.TOOL) {
	                    if (d.attributes) {
	                        d.attributes.name = n;
	                    } else {
	                        d.attributes = {
	                            name: n
	                        };
	                    }
                    } else {
                        d.name = n;                        
                    }
                    
                    me.createNode(nt, d);
	            });
            }
        }
        
        silent ? this.resumeEvents() : null;
    },
    //eo applyNodeDefinition
    
    /**
     * Fetches node's definition object.
     * @protected
     * @return {Object} definition
     */
    fetchNodeDefinition : function() {
        var ns = afStudio.theme.desktop.menu.model,
            def = {};

        if (this.properties.getCount() > 0) {
            def.attributes = this.getPropertiesHash(true);
            
            //remove service properties
            delete def.attributes.name;
            if (def.attributes.type != ns.Nodes.BUTTON) {
                delete def.attributes.type;
            }
        }
        
        if (this.hasChildNodes()) {
            def.children = {};
            
	        this.eachChild(function(n){
	            def.children[n.getPropertyValue('name')] = n.fetchNodeDefinition();
	        }, this);
        }
        
        return def;
    },
    
    /**
     * Returns node constructor function by node type.
     * @override
     * @protected
     * @param {String} nodeName The node type name
     * @return {Function} node class constructor or null if failed
     */
    getNodeConstructorByName : function(nodeName) {
        var mt = this.getModelType(),
            nCls = String(nodeName).trim().ucfirst(),
            modelNs = [afStudio.theme.desktop.menu.model, afStudio.model];
        
        Ext.iterate(modelNs, function(ns) {
            if (Ext.isFunction(ns[nCls])) {
                nCls = ns[nCls];
                return false;
            }
        });

        return Ext.isFunction(nCls) ? nCls : null;
    },
    
    /**
     * Returns node text presentation in validation process.
     * @protected
     * @override
     * @return {String} node 
     */
    getNodeValidationName : function() {
        return this.toString();  
    },
    
    /**
     * Returns node's string representation.
     * @override
     * @return {String} node
     */
    toString : function() {
        var tpl = new Ext.XTemplate(
            '[node: "{tag}", properties: {[this.toJson(values.properties.map)]} ]',
            {
                compiled: true,
                disableFormats: true,
                toJson: function(ps) {
                    var prop = {};
                    Ext.iterate(ps, function(k, v){
                        if (v.required === true && !Ext.isEmpty(v.value)) {
                            prop[k] = v.value;
                        }
                    });
                    return Ext.encode(prop);
                }
            });
        
        return tpl.apply(this);
    }    
});