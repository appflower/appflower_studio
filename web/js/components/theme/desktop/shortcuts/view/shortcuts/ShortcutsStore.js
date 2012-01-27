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
    }
    
});

//@mixin ModelReflector
Ext.applyIf(afStudio.theme.desktop.shortcut.view.ShortcutsStore.prototype, afStudio.theme.desktop.shortcut.view.ModelReflector);