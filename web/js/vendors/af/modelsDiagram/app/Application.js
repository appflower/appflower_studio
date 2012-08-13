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
        'Ext.container.Viewport'
    ],

    /**
     * @property {Insight.view.viewport.Viewport} viewPort
     * Application's viewport
     */

    name: 'Af.md',

    appFolder: '/appFlowerStudioPlugin/js/vendors/af/modelsDiagram/app',

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

        me.viewPort = Ext.create('Ext.container.Viewport',{
            layout: 'fit',
            items: [
            {
                xtype: 'panel',
                html: 'Activated! ExtJS 4 inside AF Studio'
            }]
        });
    }
});