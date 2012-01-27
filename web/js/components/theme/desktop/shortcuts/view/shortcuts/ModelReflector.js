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
        }
    };
})();

/**
 * Extends base mixin {@link afStudio.view.ModelReflector}
 */
Ext.applyIf(afStudio.theme.desktop.shortcut.view.ModelReflector, afStudio.view.ModelReflector);