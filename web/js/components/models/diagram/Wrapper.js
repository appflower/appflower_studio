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
     * @cfg {String} modelUrl
     * The model url, by default is {@link afStudioWSUrls#modelListUrl}
     */
    modelUrl : afStudioWSUrls.modelListUrl,

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
            }],
            //all tabs except the models-diagram itself are closable by default
            //is used {@link Ext.ux.TabCloseMenu} plugin, initialising this functionality
            plugins: ['tabclosemenu']
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
    },

    /**
     * Opens a model as a new tab into this diagram wrapper tab-panel.
     * @param {Object} modelData The model data
     */
    openModel: function(modelData) {
        var me = this,
            model = modelData.name,
            schema = modelData.schema,
            modelId = this.getModelTabItemId(modelData);

        afStudio.Logger.info('Open model in diagram tab-panel, data:', modelData);
        afStudio.Logger.info('model item id:', modelId);


        //register the model id


        //open new model tab
        afStudio.xhr.executeAction({
            url: me.modelUrl,
            params: {
                xaction: 'read',
                model: model,
                schema: schema
            },
            showNoteOnSuccess: false,
            loadingMessage: String.format('Loading model "{0}"...', model),
            run: function(response) {
                var id = Ext.id(null, 'diagram'),
                    md;

                md = new afStudio.models.model.ModelAccordionPanel({
                    title: model,
                    itemId: modelId,
                    fieldsStructure: response,
                    modelName: model,
                    schemaName: schema
                });

                me.add(md);
                me.activate(modelId);
            }
        });
    },

    /**
     * Returns models item id, unique within all schemas.
     *
     * @protected
     * @param {Object} md The model's diagram data, look at {@link #openModel} method
     * @return {String} The unique within schemas id, composed from the model + '#' + schema names
     */
    getModelTabItemId: function(md) {
        var m = md.name,
            s = md.schema,
            id = m + '#' + s;

        return id;
    }
});