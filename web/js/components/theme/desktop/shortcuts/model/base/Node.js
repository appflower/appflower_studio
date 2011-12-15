Ext.ns('afStudio.theme.desktop.shortcut.model');

/**
 * Shortcuts base model node.
 * 
 * @class afStudio.theme.desktop.shortcut.model.Node
 * @extends afStudio.model.Node
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.theme.desktop.shortcut.model.Node = Ext.extend(afStudio.theme.desktop.menu.model.Node, {
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
            ns = afStudio.theme.desktop.shortcut.model;

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
                    nt = ns.Nodes.LINK;
                    //set service name property
                    d.name = n;                        
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
        var ns = afStudio.theme.desktop.shortcut.model,
            def = {};

        if (this.properties.getCount() > 0) {
            def.attributes = this.getPropertiesHash(true);
            //remove service properties
            delete def.attributes.name;
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
            modelNs = [afStudio.theme.desktop.shortcut.model, afStudio.model];
        
        Ext.iterate(modelNs, function(ns) {
            if (Ext.isFunction(ns[nCls])) {
                nCls = ns[nCls];
                return false;
            }
        });

        return Ext.isFunction(nCls) ? nCls : null;
    }
});