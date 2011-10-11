Ext.ns('afStudio');

/**
 * In this class we'll store all URL used to fetch project related data with ajax calls
 * We need to have those in one place
 */
afStudio.WSUrlsClass = function() {
};

afStudio.WSUrlsClass = Ext.extend(afStudio.WSUrlsClass, {
    
	welcomeWinUrl : '/appFlowerStudio/welcome',
	
    modelListUrl: '/appFlowerStudio/models',
    
    getFiletreeUrl : '/appFlowerStudio/filetree',
    
    moduleListUrl : '/afsModuleManager/getList',
    
    moduleGroupedUrl : '/afsModuleManager/getGrouped',

    moduleAddUrl : '/afsModuleManager/add',
	
	moduleRenameUrl : '/afsModuleManager/rename',	
	
	moduleDeleteUrl : '/afsModuleManager/delete',    
    
	widgetRenameUrl : '/afsModuleManager/renameView',
	
	widgetDeleteUrl : '/afsModuleManager/deleteView',   
    
	widgetSetAsHomepage : '/afsModuleManager/setAsHomepage',
	
	pageSetAsHomepage : '/afsLayoutBuilder/setAsHomepage',
	
    getModuleWidgetsUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/moduleWidgets');
    },    
    
	widgetPreviewUrl : '/appFlowerStudio/preview',
	
	widgetUrl : 'afsLayoutBuilder/getWidget',
	
	layoutSaveUrl : 'afsLayoutBuilder/save',
	
    pluginListUrl : '/afsPluginManager/getList',
    
	pluginAddUrl : '/afsPluginManager/add',
	
	pluginRenameUrl : '/afsPluginManager/rename',	
	
	pluginDeleteUrl : '/afsPluginManager/delete',
	
    widgetGetDefinitionUrl : '/afsWidgetBuilder/getWidget',
    
    widgetSaveDefinitionUrl : '/afsWidgetBuilder/saveWidget',
    
    getFilecontentUrl : '/appFlowerStudio/filecontent',
    
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
    
    getTemplateSelectorUrl: function() {
    	return this.buildUrlFor('/appFlowerStudio/templateSelector');
    },
    
    getHelperFileSaveUrl: function() {
        return this.buildUrlFor('/appFlowerStudio/helperFileSave');
    },
    
    getCheckHelperFileExistUrl: function() {
    	return this.buildUrlFor('/appFlowerStudio/checkHelperFileExist');
    },
    
    getCheckUserExistUrl: function() {
    	return this.buildUrlFor('/afsUserManager/checkUserExist');
    },

	project : '/appFlowerStudio/project',
    
    exportUrl : '/appFlowerStudio/export',
    
    buildUrlFor: function(url) {
        return url;
    }
});

afStudioWSUrls = new afStudio.WSUrlsClass();