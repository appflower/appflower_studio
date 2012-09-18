Ext.ns('afStudio.models.diagram');

/**
 * Models-Diagram wrapper container.
 *
 * First its tab is the diagram itself {@link afStudio.models.diagram.Diagram},
 * the others closable tabs are models presented on the diagram.
 *
 * @author Nikolai Babinski
 */
afStudio.models.diagram.Wrapper = Ext.extend(Ext.TabPanel, {

    /**
     * Initializes component
     * @private
     * @return {Object} The configuration object
     */
    _beforeInitComponent : function() {

        return {
            activeTab: 0,
            items: [
            {
                title: 'Diagram',
                xtype: 'afStudio.models.diagram'
            }]

        }
    },

    /**
     * @template
     */
    initComponent: function() {
        Ext.apply(this,
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );
        afStudio.models.diagram.Wrapper.superclass.initComponent.apply(this, arguments);
    }
});