Ext.ns('afStudio.theme.desktop.menu.controller');

/**
 * MenuController class serves desktop "start" menu editor. 
 * 
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.menu.controller.MenuController = Ext.extend(afStudio.controller.BaseController, {
    
    /**
     * @cfg {Object} viewDefinition
     */
    
    /**
     * MenuController
     * @constructor
     * @param {Object} config Controller configuration object
     */
    constructor : function(config) {
        config = config || {};
        
        afStudio.theme.desktop.menu.controller.MenuController.superclass.constructor.call(this, config);
        
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
                view: afStudio.theme.desktop.menu.view.inspector.InspectorTree,
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
        return afStudio.theme.desktop.menu.model.Root;
    },
    
    /**
     * Registers a view.
     * @public
     * @param {String} id The view's ID inside {@link #views} object
     * @param {Function|Object} view The view / view constructor
     * @param {Object} (optional) cfg The view configuration object
     */
    registerView : function(id, view, cfg) {
        var me = this;
        
        cfg = Ext.apply(cfg || {}, {controller: me});
        
        if (Ext.isFunction(view)) {
	        view = me.views[id] = new view(cfg);
            
        } else if (view instanceof Ext.BoxComponent) {
            me.views[id] = view;
            view.init(cfg);
        }
        
        view.relayEvents(me, [
            'modelNodeAppend', 'modelNodeInsert', 'modelNodeRemove', 'modelNodeMove',
            'modelNodeSelect', 'modelPropertyChanged', 'modelReconfigure'
        ]);
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
    },
    
    /**
     * Returns model type. This method should be used only when controller is ready, look at {@link #isReady}.
     * @return {String} model type
     */
    getModelType : function() {
        var model = this.getRootNode();
        
        return model.getModelType();
    }    
});