Ext.ns('afStudio');

/**
 * In this class we'll store all URL used to fetch project related data with ajax calls
 * We need to have those in one place
 */
afStudio.WSUrlsClass = function() {
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
    getModuleWidgetsUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/moduleWidgets');
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
    getConfigureProjectUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/configureProject');
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
    getDBQueryComplexQueryUrl: function() {
        return this.buildUrlFor('/afsDatabaseQuery/complexQuery');
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
    getProjectLoadTreeUrl: function() {
    	return this.buildUrlFor('/appFlowerStudio/loadProjectTree');
    },
    getProjectCreateUrl: function() {
    	return this.buildUrlFor('/appFlowerStudio/createProject');
    },
    getProjectRunUrl: function() {
    	return this.buildUrlFor('/appFlowerStudio/run');
    },
    getTemplateSelectorUrl: function() {
    	return this.buildUrlFor('/appFlowerStudio/templateSelector');
    },
    getHelperFileSaveUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/helperFileSave');
    },
    getCheckHelperFileExistUrl: function() {
    	return this.buildUrlFor('/appFlowerStudio/checkHelperFileExist');
    },
    getProjectCreateWizardUrl: function() {
    	return this.buildUrlFor('/appFlowerStudio/createProjectWizard');
    },
    getCheckUserExistUrl: function() {
    	return this.buildUrlFor('/afsUserManager/checkUserExist');
    },
    getCreateProjectWizardCheckDatabaseUrl: function() {
      return this.buildUrlFor('/appFlowerStudio/createProjectWizardCheckDatabase');
    },
    buildUrlFor: function(url) {
        return url;
    },
});

afStudioWSUrls = new afStudio.WSUrlsClass();