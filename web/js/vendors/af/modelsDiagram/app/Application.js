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
        'Af.md.Viewport'
    ],

    name: 'Af.md',
    appFolder: Ext.Loader.appPath.md,

    /**
     * @property {Ext.container.Viewport} viewPort
     * Application's viewport container.
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

        me.viewPort = Ext.create('Af.md.Viewport');
    }
});