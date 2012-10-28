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

    //TODO add closable tabs plugin

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
    },

    /**
     * Opens a model as a new tab into this diagram wrapper tab-panel.
     * @param {Object} modelData The model data
     */
    openModel: function(modelData) {
        var me = this,
            model = modelData.name,
            schema = modelData.schema;

        afStudio.Logger.info('open model in diagram tab-panel', modelData);

        //TODO create register of all created models to not create a model if it's already exist
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
                    itemId: id,
                    fieldsStructure: response,
                    modelName: model,
                    schemaName: schema
                });

                me.add(md);
                me.activate(id);
            }
        });


    }
});