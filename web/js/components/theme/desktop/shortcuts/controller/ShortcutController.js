Ext.ns('afStudio.theme.desktop.shortcut.controller');

/**
 * ShortcutController class serves desktop shortcuts/links editor. 
 * 
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.shortcut.controller.ShortcutController = Ext.extend(afStudio.controller.BaseController, {
    
    /**
     * @cfg {Object} viewDefinition
     */
    
    /**
     * ShortcutController
     * @constructor
     * @param {Object} config Controller configuration object
     */
    constructor : function(config) {
        config = config || {};
        
        afStudio.theme.desktop.shortcut.controller.ShortcutController.superclass.constructor.call(this, config);
        
        this.setupViews();
    },
    
    /**
     * Configures predefined views.
     * Two registered views by default: {@link afStudio.view.inspector.InspectorTree}
     * and {@link afStudio.view.property.PropertyGrid}.
     * @protected
     */
    setupViews : function() {
        Ext.apply(this.views, {
            inspectorTree: {
                view: afStudio.theme.desktop.shortcut.view.inspector.InspectorTree,
                cfg: {
                    border: false
                }
            },
            propertyGrid: {
                view: afStudio.view.property.PropertyGrid,
                cfg: {
                    border: false
                }
            }
        });
    },

    /**
     * @override
     * @protected
     * @param {Object} viewDef The view definition
     * @return {Function|NULL} root-node constructor
     */
    resolveRootNode : function(viewDef) {
        return afStudio.theme.desktop.shortcut.model.Root;
    },
    
    /**
     * Init model events.
     * @override 
     * @protected
     */
    initModelEvents : function() {
    },
    
    /**
     * Saves view definiton.
     * @override
     * @protected
     * @param {Object} (Optional) params The parameters
     */
    saveViewDefinition : function(params) {
    }
});