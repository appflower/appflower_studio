Ext.ns('afStudio.theme.desktop.menu.model');

/**
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
                    var nt = d.type;
                    nt = Ext.isEmpty(nt) ? (modelType == 'main' ? 'item' : 'tool') : nt;
                    me.createNode(nt, d);
	            });
            }
        }
        
        silent ? this.resumeEvents() : null;
    },
    //eo applyNodeDefinition
    
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
    }
});