/**
 * Communication controller.
 *
 * @class Af.md.controller.Communication
 * @extends Ext.app.Controller
 * @author Nikolai Babinski
 */
Ext.define('Af.md.controller.Communication', {
    extend: 'Ext.app.Controller',

    views: [
        'Diagram'
    ],

    /**
     * @template
     */
    init: function() {
        var me = this;

        this.control({
            //model blocks
            'md-diagram window header': {
                dblclick: me.openModel
            }
        });
    },

    /**
     * Asks to open a model.
     *
     * @param {Ext.panel.Header} hd
     * @param {Ext.EventObject} e
     */
    openModel: function(hd, e) {
        var me = this,
            w = hd.ownerCt,
            sd = me.application.studioDiagram;

        sd.openModel(w.modelData);
    }
});