/**
 * Model specific namespace containing all stuff for the models containers and wrappers.
 */
Ext.ns('afStudio.models.model');

/**
 * Model container mixin.
 * This mixin should be used by all containers that holds a model.
 * Should not be used manually.
 *
 * @mixin afStudio.models.model.ModelContainer
 * @author Nikolai Babinski
 */
afStudio.models.model.ModelContainer = (function() {
    return {

        /**
         * The fieldsStructure object contains model's fields structure metadata.
         * @cfg {Object} (required) fieldsStructure
         */

        /**
         * @cfg {String} (required) modelName
         */

        /**
         * @cfg {String} (required) schemaName
         */

        /**
         * @cfg {String} (required) modelUrl Base URL for models (defaults to '/appFlowerStudio/models')
         */
        modelUrl : afStudioWSUrls.modelListUrl,

        /**
         * The create widgets window component.
         * @property createWidgetWindow
         * @type {afStudio.models.CreateWidgetWindow}
         */

        /**
         * The import window component.
         * @property importWindow
         * @type {afStudio.models.ImportWindow}
         */

        /**
         * Runs altering process and updates model's grids
         * @protected
         * @param {Function} action
         */
        alterModelAction : function(action) {
            var me = this;

            afStudio.xhr.executeAction({
                url: me.modelUrl,
                params: {
                    xaction: 'read',
                    model: me.modelName,
                    schema: me.schemaName
                },
                mask: {region: 'center', msg: 'Updating ' + me.modelName + ' model...'},
                showNoteOnSuccess: false,
                run: function(response, ops) {
                    //update fields structure
                    me.fieldsStructure = response;
                    action(response);
                }
            });
        },

        /**
         * Updates modelData grid.
         * {@link afStudio.models.FieldsGrid} modelConfig's <u>altermodel</u> event listener.
         * This event is relayed to the ModelTab.
         */
        onAlterModel : function() {
            var me = this,
                md = me._modelData;

            me.alterModelAction(function(fData) {
                me.remove(md, true);
                me._modelData = me.createModelDataGrid(fData);
                me.insert(0, me._modelData);
                me.doLayout();
            });
        },

        /**
         * Updates modelConfig grid.
         * This event is relayed to the ModelTab.
         * {@link afStudio.models.ModelGrid} modelData's <u>alterfield</u> event listener
         */
        onAlterField : function() {
            var mc = this._modelConfig,
                md = this._modelData;

            this.alterModelAction(function(fData) {
                mc.loadModelData(fData);
            });
        },

        /**
         * Creates modelConfig grid
         * @private
         * @param {Object} fData The fData object contains model's fields structure information
         * @return {afStudio.models.FieldsGrid} modelConfig grid
         */
        createModelConfigGrid : function(fData) {
            var me = this;

            return new afStudio.models.FieldsGrid({
                itemId: 'model-fields',
                _data: fData,
                model: me.modelName,
                schema: me.schemaName
            });
        },

        /**
         * Creates modelData grid
         * @private
         * @param {Object} fData The fData object contains model's fields structure information
         * @return {afStudio.models.ModelGrid} modelData grid
         */
        createModelDataGrid : function(fData) {
            var me = this,
                mdl = me.modelName;

            return new afStudio.models.ModelGrid({
                itemId: 'model-data',
                title: mdl,
                _data: fData,
                model: me.modelName,
                schema: me.schemaName,
                storeProxy: new Ext.data.HttpProxy({
                    api: {
                        read:    afStudioWSUrls.getModelGridDataReadUrl(mdl),
                        create:  afStudioWSUrls.getModelGridDataCreateUrl(mdl),
                        update:  afStudioWSUrls.getModelGridDataUpdateUrl(mdl),
                        destroy: afStudioWSUrls.getModelGridDataDeleteUrl(mdl)
                    }
                })
            });
        },

        /**
         * Returns {@link #createWidgetWindow}.
         * @return {afStudio.models.CreateWidgetWindow}
         */
        getCreateWidgetWindow : function() {
            var me = this;

            if (!me.createWidgetWindow) {
                me.createWidgetWindow = new afStudio.models.CreateWidgetWindow({
                    model: me.modelName,
                    fields: me.fieldsStructure
                });
            }

            me.createWidgetWindow.fields = me.fieldsStructure;

            return me.createWidgetWindow;
        },

        /**
         * Returns {@link #importWindow}.
         * @return {afStudio.models.ImportWindow}
         */
        getImportWindow : function() {
            var me = this;

            if (!me.importWindow) {
                me.importWindow = new afStudio.models.ImportWindow({
                    model: me.modelName
                });
            }

            return me.importWindow;
        },

        /**
         * Returns {@link #exportData}.
         * @return {afStudio.models.ExportData}
         */
        getExportData : function() {
            var me = this;

            afStudio.xhr.executeAction({
                url: afStudioWSUrls.modelListUrl,
                params: {
                    cmd: 'exportData',
                    model: me.modelName
                },
                scope: this
            });
        },

        /**
         * Returns {@link #exportStructure}.
         * @return {afStudio.models.ExportStructure}
         */
        getExportStructure : function() {
            var me = this;

            window.location.href = afStudioWSUrls.modelListUrl+'?cmd=export&model='+me.modelName;
        },

        /**
         * Initializes events & does post configuration
         * @protected
         */
        _afterInitComponent : function() {
            var me = this,
                mc = me._modelConfig,
                md = me._modelData;

            this.relayEvents(mc, ['altermodel']);
            this.relayEvents(md, ['alterfield']);

            me.on({
                scope: me,
                altermodel: me.onAlterModel,
                alterfield: me.onAlterField
            });
        }
    }
})();