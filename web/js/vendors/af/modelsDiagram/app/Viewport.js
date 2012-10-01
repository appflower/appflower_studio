/**
 * Models Diagram viewport.
 *
 * @class Af.md.Viewport
 * @extends Ext.container.Viewport
 *
 * @author Nikolai Babinski
 */
Ext.define('Af.md.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.md-viewport',

    requires: [
        'Af.md.view.Diagram'
    ],

    layout: 'fit',

    /**
     * @template
     * @protected
     */
    initComponent: function() {
        var me = this;

        Ext.apply(this, Ext.apply(this.initialConfig, {
            items: [
            {
                xtype: 'md-diagram'
            }]
        }));

        me.callParent(arguments);
    }
});