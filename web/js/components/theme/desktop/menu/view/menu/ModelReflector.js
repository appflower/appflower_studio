Ext.ns('afStudio.theme.desktop.menu.view');

/**
 * @mixin afStudio.theme.desktop.menu.view.ModelReflector
 * Provides instruments for a view to be ready reflect model changes. 
 * 
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.menu.view.ModelReflector = (function() {
    
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
         * Corrects line of executor's type.
         * @override
         * 
         * @return {String} line
         */
        correctExecutorLine : function(line, type, node, property) {
            var ctrlType = node.getOwnerTree().getModelType();

            if (ctrlType == 'main') {
                line = 'MainItem'
            }
            
            return line;
        },
         
        
        executeAddMainItem : function(n, idx) {
            
        },
        
        executeDeleteMainItem : function() {
            
        },
        
        executeInsertMainItem : function() {
            
        }
    };
})();


/**
 * Extends base mixin {@link afStudio.view.ModelReflector}
 */
Ext.applyIf(afStudio.theme.desktop.menu.view.ModelReflector, afStudio.view.ModelReflector);