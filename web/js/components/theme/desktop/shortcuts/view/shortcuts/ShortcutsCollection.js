Ext.ns('afStudio.theme.desktop.shortcut.view');

/**
 * ShortcutsCollection
 * 
 * @class afStudio.theme.desktop.shortcut.view.ShortcutsCollection
 * @extends Ext.util.MixedCollection
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.shortcut.view.ShortcutsCollection = Ext.extend(Ext.util.MixedCollection, {
    
    /**
     * @property NS The ShortcutsCollection namespace
     * @static
     * @type {Object} 
     */
    NS : afStudio.theme.desktop.shortcut.view,
    
    /**
     * @constructor
     */
    constructor : function() {
        /**
         * @property modelMapper The Model->Component associations holder
         * @type {Object}
         */
        this.modelMapper = {};
        
        afStudio.theme.desktop.shortcut.view.ShortcutsCollection.superclass.constructor.apply(this, arguments);
    },
    
    /**
     * Adds an item to the collection. Fires the {@link #add} event when complete.
     * For details look at parent method {@link Ext.util.MixedCollection#add}
     * @override
     * 
     * @param {String} key The key to associate with the item
     * @param {Object} o The item to add
     * @return {Object} The item added.
     */
    add : function(key, o) {
        if (arguments.length == 1) {
			o = arguments[0];
			key = this.getKey(o);
		}
        
        //mapping to model
        this.mapCmpToModel(key, o);
        
        return this.NS.ShortcutsCollection.superclass.add.apply(this, [key, o]);
    },

    /**
     * Adds mapping between a record being inserted and a model node.
     * For details look at parent method {@link Ext.util.MixedCollection#add}
     * @override
     */
    insert : function(index, key, o) {
        o = this.NS.ShortcutsCollection.superclass.insert.apply(this, arguments);
        
        if (index < this.length) {
            key = this.getKey(o);
	        this.mapCmpToModel(key, o);
        }
        
        return o;
    },    
    
    /**
     * Unmapping record object from associated model node.
     * For details look at parent method {@link Ext.util.MixedCollection#add}
     * @override
     */
    removeAt : function(idx) {
        var o = this.items[idx];
        if (o) {
	        //unmapping from model
	        this.unmapCmpFromModel(o);
        }
        
        return this.NS.ShortcutsCollection.superclass.removeAt.call(this, idx);
    }
    
});

//@mixin ModelMapper
Ext.applyIf(afStudio.theme.desktop.shortcut.view.ShortcutsCollection.prototype, afStudio.view.ModelMapper);