/**
 * Contains ModelsDiagram module application's URL routes.
 *
 * @class Af.md.Url
 * @singleton
 *
 * @author Nikolai Babinski
 */
Af.md.Url = (function(){

    var models = '/appFlowerStudio/models';

    return {
        structure: Ext.String.urlAppend(models, 'xaction=getStructure')
    };
}());