Ext.ns('afStudio.theme.desktop.menu.view.inspector');

/**
 * Menu InspectorTree loader.
 * @class afStudio.theme.desktop.menu.view.inspector.InspectorLoader
 * @extends afStudio.view.inspector.InspectorLoader
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.menu.view.inspector.InspectorLoader = Ext.extend(afStudio.view.inspector.InspectorLoader, {
    
    /**
     * Returns node's constructor function by its type.
     * @override
     * @protected
     * @param {String} type The model node tag 
     * @return {Function} node constructor or null if it was not found
     */
    resolveNodeType : function(type) {
        var nCls   = String(type).trim().ucfirst(),
            nodeNs = [afStudio.theme.desktop.menu.view.inspector.nodeType];
        
        nCls += 'Node';
        
        Ext.iterate(nodeNs, function(ns) {
            if (Ext.isFunction(ns[nCls])) {
                nCls = ns[nCls];
                return false;
            }
        });
        
        return Ext.isFunction(nCls) ? nCls : null;     
    }
});