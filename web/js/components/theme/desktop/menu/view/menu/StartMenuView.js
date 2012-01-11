Ext.ns('afStudio.theme.desktop.menu.view');

afStudio.theme.desktop.menu.view.StartMenuView = Ext.extend(Ext.ux.StartMenu, {

    //private
    floating : false,
	height : 346,
	width : 300,
    
    /**
     * @property controller The controller(s) 
     * @type {Object}
     */
    controller : null,

    /**
     * @property modelMapper The Model->Component associations holder.
     * @type {Object}
     */
    
    /**
     * Instantiates view during registration into controller.
     * 
     * @param {Object} cfg The configuration object, cfg.controller property 
     * contains the controller this view is registered into.
     */
    init : function(cfg) {
        afStudio.Logger.info('@startMenu view registered');
 
        var ctrType = cfg.controller.getModelType();
        
        if (!this.controller) {
            this.controller = {}; 
        }
        this.controller[ctrType] = cfg.controller;
        
        delete cfg.controller;
        
        Ext.apply(this, cfg);
    },
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    initComponent : function() {
        afStudio.theme.desktop.menu.view.StartMenuView.superclass.initComponent.apply(this, arguments);
        
        this.modelMapper = {};        
        
        var me = this;
        
        this.on({
            scope: me,
            
            /**
             * @relayed controller
             */
            modelNodeAppend: me.onModelNodeAppend,
            /**
             * @relayed controller
             */
            modelNodeInsert: me.onModelNodeInsert,
            /**
             * @relayed controller
             */
            modelNodeRemove: me.onModelNodeRemove,
            /**
             * @relayed controller
             */
            modelPropertyChanged: me.onModelPropertyChanged
        });     
    },
    
    /**
     * Cleanup resources. 
     * @override
     * @private
     */
    onDestroy : function() {
        this.controller = this.modelMapper = null;
        
        afStudio.theme.desktop.menu.view.StartMenuView.superclass.onDestroy.call(this);
    },
    
    /**
     * Relayed <u>modelNodeAppend</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeAppend}.
     * @protected
     * @interface
     */
    onModelNodeAppend : function(ctr, parent, node, index) {
        afStudio.Logger.info('@view [StartMenu] modelNodeAppend');
        
//        ctr.root.getModelType();
        
//        var executor = this.getExecutor(this.EXEC_ADD, node);
//        if (executor) {
//            executor(node, index);
//        }
//        console.log(ctr, ctr.root.getModelType());
    },
    
    /**
     * Relayed <u>modelNodeInsert</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeInsert}.
     * @protected
     * @interface
     */
    onModelNodeInsert : function(ctr, parent, node, refNode) {
        afStudio.Logger.info('@view [StartMenu] modelNodeInsert');
//        var refCmp = this.getCmpByModel(refNode),
//            executor = this.getExecutor(this.EXEC_INSERT, node);
//        if (executor) {
//            executor(parent, node, refNode, refCmp);
//        }
    },
    
    /**
     * Relayed <u>modelNodeRemove</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeRemove}.
     * @protected
     * @interface
     */
    onModelNodeRemove : function(ctr, parent, node) {
        afStudio.Logger.info('@view [StartMenu] modelNodeRemove');
//        var cmp = this.getCmpByModel(node),
//            executor = this.getExecutor(this.EXEC_REMOVE, node);
//        if (executor) {
//            executor(node, cmp);
//        }
    },
    
    /**
     * Relayed <u>modelPropertyChanged</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelPropertyChanged}.
     * @protected
     * @interface
     */
    onModelPropertyChanged : function(node, p, v, oldValue) {
        afStudio.Logger.info('@view [StartMenu] modelPropertyChanged');
//        var cmp = this.getCmpByModel(node, p),
//            executor = this.getExecutor(this.EXEC_UPDATE, node, p);
//        if (executor) {
//            executor(node, cmp, p, v, oldValue);
//        }
    }
        
});


//@mixin ModelMapper
Ext.applyIf(afStudio.theme.desktop.menu.view.StartMenuView.prototype, afStudio.view.ModelMapper);

//@mixin ModelInterface
Ext.apply(afStudio.theme.desktop.menu.view.StartMenuView.prototype, afStudio.view.ModelInterface);

////@mixin ModelReflector
//Ext.apply(afStudio.wd.edit.EditView.prototype, afStudio.wd.edit.EditModelReflector);