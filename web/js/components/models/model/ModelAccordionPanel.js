Ext.ns('afStudio.models.model');

/**
 *
 *
 * @class afStudio.models.model.ModelAccordionPanel
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.models.model.ModelAccordionPanel = Ext.extend(Ext.Panel, {

    /**
     * Initializes component
     * @private
     * @return {Object} The configuration object
     */
    _beforeInitComponent : function() {
        var me = this,
            fData = me.fieldsStructure,
            mdl = me.modelName,
            shm = me.schemaName;

        this._modelConfig = me.createModelConfigGrid(fData);
        this._modelData   = me.createModelDataGrid(fData);

        return {
            layout: 'accordion',
            layoutConfig: {
                activeOnTop: true
            },
            items: [
                me._modelData,
                me._modelConfig
            ]
        };
    },

    /**
     * Template method
     * @private
     */
    initComponent : function() {
        Ext.apply(this,
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );

        afStudio.models.model.ModelAccordionPanel.superclass.initComponent.apply(this, arguments);

        this._afterInitComponent();
    }
});

/**
 * @type 'afStudio.models.model.modelAccordion'
 */
Ext.reg('afStudio.models.modelAccordion', afStudio.models.model.ModelAccordionPanel);


/**
 * Applies {@link afStudio.models.model.ModelContainer} mixin.
 */
Ext.applyIf(afStudio.models.model.ModelAccordionPanel.prototype, afStudio.models.model.ModelContainer);