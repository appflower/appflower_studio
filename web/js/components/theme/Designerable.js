Ext.ns('afStudio.theme');

/**
 * @mixin Designerable
 *
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.theme.Designerable = (function() {

    return {

        /**
         * *activate* event listener
         */
        onTabActivate : function() {
            var d = this.getContainerWindow();
            d.enableSave();
        },

        /**
         * Returns the container window {@link afStudio.theme.Designer} of `this` designer.
         * @return {afStudio.theme.Designer} designer or null if nothing was found
         */
        getContainerWindow : function() {
            return this.findParentByType('afStudio.theme.designer', true);
        }
    };
})();