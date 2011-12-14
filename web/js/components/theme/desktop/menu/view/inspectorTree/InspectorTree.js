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
            iconCls: 'icon-tb-menu',
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
    },
    
    /**
     * <u>nodedragover</u> event listener. 
     * More details {@link Ext.tree.TreePanel#nodedragover}.
     * @override
     * @protected 
     */
    onNodeDragOver : function() {
        return true;
    },

    /**
     * <u>nodedrop</u> event listener.
     * More details {@link Ext.tree.TreePanel#nodedrop}.
     * @override
     * @protected
     */
    onNodeDrop : function(de) {
        var n = de.dropNode.modelNode, p = de.point, t = de.target.modelNode;

        switch (p) {
            case "above":
                t.parentNode.insertBefore(n, t);
            break;
            
            case "below":
                t.parentNode.insertBefore(n, t.nextSibling);
            break;
            
            case "append":
                t.appendChild(n);
            break;
        }
    }    
});

afStudio.theme.desktop.menu.view.inspector.nodeType = {}