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
    buildUrlFor: function(url) {
        if (this.projectSlug != '') {
            return '/project/'+this.projectSlug+url;
        } else {
            return url;
        }
    }
});