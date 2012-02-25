Ext.ns('afStudio.theme.desktop.shortcut.view');

/**
 * ShortcutsStore.
 * 
 * @class afStudio.theme.desktop.shortcut.view.ShortcutsStore
 * @extends Ext.data.Store
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.shortcut.view.ShortcutsStore = Ext.extend(Ext.data.Store, {
    
    /**
     * @cfg {Object} data The store data, according to the record's fields
     */
    
    /**
     * @property controller The controller 
     * @type {ShortcutController}
     */
    controller : null,    
    
    /**
     * @constructor
     * @param {Object} config The configuration object
     */
    constructor : function(config) {
        var data = config.data ? config.data : null;
        delete config.data;
        
        afStudio.theme.desktop.shortcut.view.ShortcutsStore.superclass.constructor.call(this, Ext.apply(config, {
            autoLoad: false,
            sortInfo: false,
            multiSortInfo: false,
            url: null, 
            api: null,
            proxy: null,
            reader: new Ext.data.JsonReader({
                idProperty: 'model-id', //important {@link afStudio.model.Node#getPropertiesRecordType}
                fields: ['model-id', 'name', 'title', 'url', 'iconCls', 'icon']
            })
        }));

        this.data = new afStudio.theme.desktop.shortcut.view.ShortcutsCollection(false);
        
        if (data) {
            this.loadData(data);
        } else {
            this.loadModel();
        }
    },

    /**
     * Instantiates view during registration into controller.
     * @protected
     */
    init : function() {
        
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
     * Returns controller's {@link #controller} model as array of records.
     * @return {Array} records
     */
    getModelAsRecords : function() {
        var root = this.controller.root,
            data = [];
        
        root.eachChild(function(n){
            data.push(n.getPropertiesRecord());
        });
        
        return data;
    },
    
    /**
     * Loads model's records.
     * @protected
     */
    loadModel : function() {
        var r = this.getModelAsRecords();
        
        this.loadRecords({records : r}, {add: false}, true);
    },
    
    /**
     * Relayed <u>modelNodeAppend</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeAppend}.
     * @protected
     * @interface
     */
    onModelNodeAppend : function(ctr, parent, node, index) {
        afStudio.Logger.info('@view [Shortcuts->store] modelNodeAppend', arguments);
        var executor = this.getExecutor(this.EXEC_ADD, node);
        if (executor) {
            executor(node, index);
        }
    },
    
    /**
     * Relayed <u>modelNodeInsert</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeInsert}.
     * @protected
     * @interface
     */
    onModelNodeInsert : function(ctr, parent, node, refNode) {
        afStudio.Logger.info('@view [Shortcuts->store] modelNodeInsert', arguments);
        var refRecord = this.data.getCmpByModel(refNode),
            executor = this.getExecutor(this.EXEC_INSERT, node);
            
        if (executor) {
            executor(node, refNode, refRecord);
        }
    },
    
    /**
     * Relayed <u>modelNodeRemove</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelNodeRemove}.
     * @protected
     * @interface
     */
    onModelNodeRemove : function(ctr, parent, node) {
        afStudio.Logger.info('@view [Shortcuts->store] modelNodeRemove', arguments);
        var r = this.data.getCmpByModel(node),
            executor = this.getExecutor(this.EXEC_REMOVE, node);
            
        if (executor) {
            executor(node, r);
        }
    },
    
    /**
     * Relayed <u>modelPropertyChanged</u> event listener.
     * More details {@link afStudio.controller.BaseController#modelPropertyChanged}.
     * @protected
     * @interface
     */
    onModelPropertyChanged : function(node, p, v, oldValue) {
        afStudio.Logger.info('@view [Shortcuts->store] modelPropertyChanged', node);

//        var cmp = this.getCmpByModel(node, p),
//            executor = this.getExecutor(this.EXEC_UPDATE, node, p);
//
//        if (executor) {
//            executor(node, cmp, p, v, oldValue);
//        }
    }    
});

//@mixin ModelReflector
Ext.applyIf(afStudio.theme.desktop.shortcut.view.ShortcutsStore.prototype, afStudio.theme.desktop.shortcut.view.ModelReflector);