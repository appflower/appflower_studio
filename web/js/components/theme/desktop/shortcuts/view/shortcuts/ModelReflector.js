Ext.ns('afStudio.theme.desktop.shortcut.view');

/**
 * @mixin afStudio.theme.desktop.shortcut.view.ModelReflector
 * Provides instruments for a view to be ready reflect model changes. 
 * 
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.shortcut.view.ModelReflector = (function() {
    
    return {
        
        /**
         * Returns executor token.
         * @override
         * @param {String} s
         * @return {String} token 
         */
        getExecutorToken : function(s) {
            return s.ucfirst();
        },

        /**
         * Adds shortcut record.
         * @param {Node} n
         * @param {Number} idx
         */
        executeAddLink : function(n, idx) {
	        var r = n.getPropertiesRecord();
            this.insert(idx, [r]);
        },
        
        /**
         * Inserts a shortcut record before the specified one.
         * @param {Node} node
         * @param {Node} refNode 
         * @param {Ext.data.Record} refRecord
         */
        executeInsertLink : function(node, refNode, refRecord) {
            var idx = this.indexOf(refRecord);
            this.executeAddLink(node, idx);
        },
        
        /**
         * Removes shortcut record.
         * @param {Node} node The model node
         * @param {Ext.data.Record} The record associated with model node
         */
        executeRemoveLink : function(node, record) {
            this.remove(record);
        },
        
        /**
         * title
         */
        executeUpdateLinkTitle : function(node, record, p, v, oldValue) {
            record.set(p, Ext.isEmpty(v) ? record.get('name') : v);
        },
        /**
         * url
         */
        executeUpdateLinkUrl : function(node, record, p, v, oldValue) {
            record.set(p, v);
        },
        /**
         * icon
         */
        executeUpdateLinkIcon : function(node, record, p, v, oldValue) {
            record.set(p, v);
        },
        /**
         * iconCls
         */
        executeUpdateLinkIconCls : function(node, record, p, v, oldValue) {
            record.set(p, v);
        }
    };
})();

/**
 * Extends base mixin {@link afStudio.view.ModelReflector}
 */
Ext.applyIf(afStudio.theme.desktop.shortcut.view.ModelReflector, afStudio.view.ModelReflector);