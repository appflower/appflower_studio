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
     * @property currentCtrl The current controller this view is working with
     * @type {BaseController} 
     */
    currentCtrl : null,
    
    /**
     * @property modelMapper The Model->Component associations holder.
     * @type {Object}
     */
    
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
     * Instantiates view during registration into controller.
     * 
     * @param {Object} cfg The configuration object, cfg.controller property 
     * contains the controller this view is registered into.
     */
    init : function(cfg) {
        var ctrType = cfg.controller.getModelType();
        
        afStudio.Logger.info('@startMenu view registered', ctrType);
        
        if (!this.controller) {
            this.controller = {}; 
        }
        this.controller[ctrType] = cfg.controller;
        
        delete cfg.controller;
        
        Ext.apply(this, cfg);
        
        this.initController(this.controller[ctrType]);
    },
    
    /**
     * Init registered controller.
     * @protected
     * @param {MenuController} ctr The controller
     */
    initController : function(ctr) {
        var mt = ctr.root.getModelType(),
            builder = String.format('build{0}Menu', mt.ucfirst());

        if (Ext.isFunction(this[builder])) {
	        this[builder](ctr);
        }
    },
    
    /**
     * Returns current controller this view is working with.
     * @override {@link afStudio.view.ModelInterface#getController}
     * @protected
     * @return {BaseController}
     */
    getController : function() {
        if (!this.currentCtrl) {
            throw new afStudio.error.ApsError('Current controller is not specified');    
        }
        
        return this.currentCtrl;
    },
    
    /**
     * Creates/Inits main menu based on its model.
     * @protected
     * @param {MenuController} ctr The main menu controller
     */
    buildMainMenu : function(ctr) {
        afStudio.Logger.info('@view [StartMenu] building "main" menu');
        this.currentCtrl = ctr;
        
        var items = this.getMenuItems(ctr.root);
        
        if (!Ext.isEmpty(items)) {
            Ext.each(items, function(itm){
                var mit = this.createMainMenuItem(itm);
                this.add(mit);
            }, this);
            
            this.doLayout();
        }
    },
    
    /**
     * Creates/Inits tools menu based on its model.
     * @protected
     * @param {MenuController} ctr The tools menu controller
     */
    buildToolsMenu : function(ctr) {
        afStudio.Logger.info('@view [StartMenu] building "tools" menu');
        this.currentCtrl = ctr;
        
        var items = this.getMenuItems(ctr.root);
        
        if (!Ext.isEmpty(items)) {
            Ext.each(items, function(itm){
                var mit = this.createToolsMenuItem(itm);
                this.addTool(mit);
            }, this);
            
            this.doLayout();
        }
    },
    
    /**
     * Relayed <u>modelNodeAppend</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeAppend}.
     * @protected
     * @interface
     */
    onModelNodeAppend : function(ctr, parent, node, index) {
        afStudio.Logger.info('@view [StartMenu] modelNodeAppend', parent, node);
        
        this.currentCtrl = ctr;
        
        var executor = this.getExecutor(this.EXEC_ADD, node);
        
        if (executor) {
            executor(parent, node, index);
        }
    },
    
    /**
     * Relayed <u>modelNodeInsert</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeInsert}.
     * @protected
     * @interface
     */
    onModelNodeInsert : function(ctr, parent, node, refNode) {
        afStudio.Logger.info('@view [StartMenu] modelNodeInsert', parent, node);
        
        this.currentCtrl = ctr;
        
        var refCmp = this.getCmpByModel(refNode),
            executor = this.getExecutor(this.EXEC_INSERT, node);
            
        if (executor) {
            executor(parent, node, refNode, refCmp);
        }
    },
    
    /**
     * Relayed <u>modelNodeRemove</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeRemove}.
     * @protected
     * @interface
     */
    onModelNodeRemove : function(ctr, parent, node) {
        afStudio.Logger.info('@view [StartMenu] modelNodeRemove', parent, node);
        
        this.currentCtrl = ctr;
        
        var cmp = this.getCmpByModel(node),
            executor = this.getExecutor(this.EXEC_REMOVE, node);
            
        if (executor) {
            executor(parent, node, cmp);
        }
    },
    
    /**
     * Relayed <u>modelPropertyChanged</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelPropertyChanged}.
     * @protected
     * @interface
     */
    onModelPropertyChanged : function(node, p, v, oldValue) {
        afStudio.Logger.info('@view [StartMenu] modelPropertyChanged', node);
        
        this.currentCtrl = node.getOwnerTree();
        
        var cmp = this.getCmpByModel(node, p),
            executor = this.getExecutor(this.EXEC_UPDATE, node, p);

        if (executor) {
            executor(node, cmp, p, v, oldValue);
        }
    },
    
    /**
     * Creates main menu item.
     * @protected
     * @param {Object} item The main menu item definition object
     * @return {Ext.menu.Item}
     */
    createMainMenuItem : function(item) {
        var mpr = this.NODE_ID_MAPPER,
            itemId = item[mpr];

        var cfg = {
            text: item.label,
            icon: item.icon,
            iconCls: item.iconCls
        };
        //node mapping
        cfg[mpr] = itemId;
            
        if (item.children) {
            var submenu = [];
            Ext.each(item.children, function(itm, idx){
	            submenu[idx] = this.createMainMenuItem(itm);
            }, this);
            
            cfg.menu = {
                ignoreParentClicks: true,
                items: submenu
            };
        }
        
        return this.createItem(cfg);
    },
    
    /**
     * Creates tools menu item.
     * @protected
     * @param {Object} item The tools item definition object
     * @return {Ext.menu.Item}
     */
    createToolsMenuItem : function(item) {
        var mpr = this.NODE_ID_MAPPER,
            itemId = item[mpr];

        var cfg = Ext.copyTo({}, item, 'text, icon, iconCls');
        //node mapping
        cfg[mpr] = itemId;
        
        return this.createItem(cfg);
    },
    
    /**
     * Creates menu item component.
     * @protected
     * @param {Object} cfg The menu item configuration object
     * @return {Ext.menu.Item} item
     */
    createItem : function(cfg) {
        var ctrl = this.getController(),
            mit = new Ext.menu.Item(cfg);
        
        mit.on({
            scope: this,
            
            activate: function(it) {
                this.currentCtrl = ctrl;
                var node = this.getModelByCmp(it);
                ctrl.selectModelNode(node, this);
            },
            
            beforedestroy: function(it) {
                this.unmapCmpFromModel(it[this.NODE_ID_MAPPER]);
            }
        });
        
        //registers relation model node -> menu item component
        this.mapCmpToModel(cfg[this.NODE_ID_MAPPER], mit);
        
        return mit;
    }
});


//@mixin ModelMapper
Ext.applyIf(afStudio.theme.desktop.menu.view.StartMenuView.prototype, afStudio.view.ModelMapper);

//@mixin ModelInterface
Ext.applyIf(afStudio.theme.desktop.menu.view.StartMenuView.prototype, afStudio.theme.desktop.menu.view.ModelInterface);

//@mixin ModelReflector
Ext.applyIf(afStudio.theme.desktop.menu.view.StartMenuView.prototype, afStudio.theme.desktop.menu.view.ModelReflector);