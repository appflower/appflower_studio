/**
 * Sets right path for the blank image in case of old IE browsers.
 * More details {@link Ext#BLANK_IMAGE_URL}
 */
Ext.BLANK_IMAGE_URL = (Ext.isIE6 || Ext.isIE7) ? '/appFlowerPlugin/extjs-3/resources/images/default/s.gif' : Ext.BLANK_IMAGE_URL;

/**
 * @property {String} appPath
 * Custom property added to the loader.
 * The paths to the modules' application source files.
 */
Ext.Loader.appPath = {

    /**
     * `main` property contains general URL for AF extjs 4.* modules
     */
    main: '/appFlowerStudioPlugin/js/vendors/af'
};

/**
 * @property {String} md
 * ModelsDiagram module URL
 */
Ext.Loader.appPath.md = Ext.Loader.appPath.main + '/modelsDiagram/app';

Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Af': Ext.Loader.appPath.main,
        'Af.md': Ext.Loader.appPath.md
    }
});

/**
 * The global application namespace.
 * @class Af
 * @singleton
 *
 * @author Nikolai Babinski
 */
var Af = new function() {
    var af = this;

    Ext.require([
        'Af.md.Application'
    ]);

    Ext.apply(af, {
        /**
         * @property {Object} apps
         * @readonly
         * The initialised application's modules references
         */
        apps: {},

        /**
         * Checks if module's configuration exists inside {@link Ext.Loader#appPath paths}.
         * @param {String} module The module's name being checked
         * @return {Boolean} `true` if module exists otherwise `false`
         */
        isModuleExists: function(module) {
            return Ext.Loader.appPath ? Ext.isDefined(Ext.Loader.appPath[module]) : false;
        },

        /**
         * Initialises AppFlower module's application.
         * @method
         * @param {String} module The module being initialised
         */
        initModule: function(module) {
            if (!this.isModuleExists(module)) {
                throw new Error(Ext.String.format('Af->initModule: module "{0}" does not exists.', module));
            }

            //module initialization can be performed only ones
            if (Af.apps[module] == null) {

                //initialise module's namespace
                Ext.ns('Af.' + module);

                //create module's application on all ready
                Ext.onReady(function() {
                    //hold module's application reference
                    Af.apps[module] = Ext.create('Af.' + module + '.Application');
                });
            }
        }
    });
};