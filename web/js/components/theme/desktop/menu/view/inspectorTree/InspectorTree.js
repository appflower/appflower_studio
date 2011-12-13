Ext.ns('afStudio.theme.desktop.menu.view.inspector');

/**
 * Menu editor's InspectorTree.
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.theme.desktop.menu.view.inspector.InspectorTree = Ext.extend(afStudio.view.inspector.InspectorTree, {
    
    /**
     * Initializes component
     * @override
     * @private
     * @return {Object} The configuration object 
     */
    _beforeInitComponent : function() {
        var root = this.controller.getRootNode(),
            ns = afStudio.theme.desktop.menu.view.inspector;

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
            l = new ns.InspectorLoader();
        } else if (Ext.isObject(l) && !l.load) {
            l = new ns.InspectorLoader(l);
        }
        this.loader = l;
    }
});

afStudio.theme.desktop.menu.view.inspector.nodeType = {}