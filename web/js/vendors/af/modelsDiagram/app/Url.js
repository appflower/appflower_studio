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

        /**
         * Returns models structural data required for building
         * models diagram.
         */
        structure: Ext.String.urlAppend(models, 'xaction=getStructure')
    };
}());