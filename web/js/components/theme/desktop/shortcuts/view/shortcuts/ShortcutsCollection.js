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
        
        var NS = afStudio.theme.desktop.shortcut.view;
        
        return NS.ShortcutsCollection.superclass.add.apply(this, [key, o]);
    }
});

//@mixin ModelMapper
Ext.applyIf(afStudio.theme.desktop.shortcut.view.ShortcutsCollection.prototype, afStudio.view.ModelMapper);