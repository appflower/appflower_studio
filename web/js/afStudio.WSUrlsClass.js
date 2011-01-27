/**
 * In this class we'll store all URL used to fetch project related data with ajax calls
 * We need to have those in one place
 */
afStudio.WSUrlsClass =function (projectSlug) {
    this.projectSlug = projectSlug;
};

afStudio.WSUrlsClass = Ext.extend(afStudio.WSUrlsClass, {
    getModelsUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/models');
    },
    getFiletreeUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/filetree');
    },
    getCssFilestreeUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/cssfilestree');
    },
    getCssFilesSaveUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/cssfilesSave');
    },
    getModulesUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/modules');
    },
    getPluginsUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/plugins');
    },
    getCodepressUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/codepress');
    },
    getFilecontentUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/filecontent');
    },
    getDebugUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/debug');
    },
    getNotificationsUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/notifications');
    },
    getConsoleUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/console');
    },
    getConfigureDatabaseUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/configureDatabase');
    },
    getLoadDatabaseConnectionSettingsUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/loadDatabaseConnectionSettings');
    },
    getGetWidgetUrl: function(widgetUri) {
        return this.buildUrlFor('/afsWidgetBuilder/getWidget?uri='+widgetUri);
    },
    getSaveWidgetUrl: function(widgetUri) {
        return this.buildUrlFor('/afsWidgetBuilder/saveWidget?uri='+widgetUri);
    },
    getDBQueryDatabaseListUrl: function() {
        return this.buildUrlFor('/afsDatabaseQuery/databaseList');
    },
    getDBQueryQueryUrl: function() {
        return this.buildUrlFor('/afsDatabaseQuery/query');
    },
    getModelGridDataReadUrl: function(modelName) {
        return this.buildUrlFor('/afsModelGridData/read?model=' + modelName);
    },
    getModelGridDataCreateUrl: function(modelName) {
        return this.buildUrlFor('/afsModelGridData/create?model=' + modelName);
    },
    getModelGridDataUpdateUrl: function(modelName) {
        return this.buildUrlFor('/afsModelGridData/update?model=' + modelName);
    },
    getModelGridDataDeleteUrl: function(modelName) {
        return this.buildUrlFor('/afsModelGridData/delete?model=' + modelName);
    },
    buildUrlFor: function(url) {
        if (this.projectSlug != '') {
            return '/project/'+this.projectSlug+url;
        } else {
            return url;
        }
    }
});