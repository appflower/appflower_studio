Ext.ns('afStudio.theme.desktop.menu.view.inspector');

/**
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.theme.desktop.menu.view.inspector.InspectorTree = Ext.extend(afStudio.view.inspector.InspectorTree, {
    
    /**
     * Initializes component
     * @private
     * @return {Object} The configuration object 
     */
    _beforeInitComponent : function() {
        var root = this.controller.getRootNode(),
            view = this.controller.widget;
        
        this.enableDD = true;
        
        this.root = {
            expanded: true,
            modelNode: root,
            properties: {
                name: 'Menu'
            }
        };
        
        var l = this.loader;
        if (!l) {
            l = new afStudio.view.inspector.InspectorLoader();
        } else if (Ext.isObject(l) && !l.load) {
            l = new afStudio.view.inspector.InspectorLoader(l);
        }
        this.loader = l;
    }
});