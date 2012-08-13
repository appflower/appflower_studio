<!-- extjs 4.1 -->
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/js/vendors/extjs4/resources/css/ext-all.css" />
<script type="text/javascript" src="/appFlowerStudioPlugin/js/vendors/extjs4/ext-all-debug.js"></script>


<script type="text/javascript">
    /**
     * Sets right path for the blank image in case of old IE browsers.
     * More details {@link Ext#BLANK_IMAGE_URL}
     */
    Ext.BLANK_IMAGE_URL = (Ext.isIE6 || Ext.isIE7) ? '/appFlowerPlugin/extjs-3/resources/images/default/s.gif' : Ext.BLANK_IMAGE_URL;

    /**
     * @property {String} appPath
     * Custom property added to the loader.
     * The path to the application source files.
     */
    Ext.Loader.appPath = {
        main: '/appFlowerStudioPlugin/js/vendors/af'
    };
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
             * @property {Object} The modules applications
             */
            apps: {},

            /**
             * Initialises AppFlower module's application.
             */
            initApplication: function(module) {

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

    Af.initApplication('md');
</script>
