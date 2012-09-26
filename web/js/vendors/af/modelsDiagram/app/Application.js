/**
 * AppFlower models diagram application.
 *
 * @class Af.md.Application
 * @extends Ext.app.Application
 * @author Nikolai Babinski
 */
Ext.define('Af.md.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'Af.md.Url',
        'Af.md.Viewport',
        'Ext.window.MessageBox'
    ],

    name: 'Af.md',
    appFolder: Ext.Loader.appPath.md,

    controllers: [
        'Communication'
    ],

    /**
     * @property {Ext.container.Viewport} viewPort
     * Application's viewport container.
     * @readonly
     */

    /**
     * @property {Window} studioGlobal
     * This property is available only if Models Diagram application is loaded as part of AF Studio.
     * The parent window object.
     * This is the reference to the global browser's window object where AF Studio is rendered and processing by it.
     * @readonly
     */

    /**
     * @property {afStudio} studioRef
     * This property is available only if Models Diagram application is loaded as part of AF Studio.
     * AF Studio global object reference `afStudio`.
     * @readonly
     */

    /**
     * @property {afStudio.models.diagram.Wrapper} studioDiagram
     * This property is available only if Models Diagram application is loaded as part of AF Studio.
     * The Models Diagram wrapper inside AF Studio application. Look at AF Studio models->diagram
     * @readonly
     */

    /**
     * //TODO extend
     * @constructor
     */
    constructor: function() {
        var me = this;
        me.callParent(arguments);
    },

    /**
     * @template
     */
    launch: function() {
        var me = this;

        me.initStudioRefs();

        me.viewPort = Ext.create('Af.md.Viewport');
    },

    /**
     * @private
     */
    initStudioRefs: function() {
        var me = this;

        me.studioGlobal = Ext.global.parent;
        me.studioRef = me.studioGlobal.afStudio;

        try {
            me.studioDiagram = me.studioRef.vp.viewRegions.center.get(0);
        } catch(e) {
            Ext.MessageBox.alert('Diagram', 'Diagram is running without AF Studio. <br /><b>Not all functionality will be working</b>');
        }
    }
});