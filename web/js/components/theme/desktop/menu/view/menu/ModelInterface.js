Ext.ns('afStudio.theme.desktop.menu.view');

/**
 * afStudio.theme.desktop.menu.view.ModelInterface extends base afStudio.view.ModelInterface mixin. 
 * @singleton
 * 
 * @dependency {afStudio.theme.desktop.menu.model.Nodes} model nodes
 * 
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.menu.view.ModelInterface = (function() {
    
    return {
        /**
         * The reference to model nodes {@link afStudio.theme.desktop.menu.model.Nodes}
         * @constant {Object} NODES
         */
        NODES : afStudio.theme.desktop.menu.model.Nodes,
        
        /**
         * Returns menu nodes properties.
         * If an item has children items(subitems) then they are set to its "children" {Array} property.
         * @return {Array} menu items
         */
        getMenuItems : function(node) {
            var items = [],
                ns = node.childNodes;

            for (var i = 0, len = ns.length; i < len; i++) {
                var n = ns[i];
                items[i] = this.getModelNodeProperties(n);
                if (n.hasChildNodes()) {
                    items[i].children = this.getMenuItems(n);    
                }
            }

            return items;
        }
    };
})();

/**
 * Extends base mixin {@link afStudio.view.ModelInterface}
 */
Ext.applyIf(afStudio.theme.desktop.menu.view.ModelInterface, afStudio.view.ModelInterface);
