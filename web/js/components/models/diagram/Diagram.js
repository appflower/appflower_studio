Ext.ns('afStudio.models.diagram');

/**
 * Diagram wrapper.
 * The component is dedicated to wrap diagram realization written in extjs v.4.1,
 * models diagram is integrated with studio via iframe. This approach was selected to
 * not ruin any css and custom Studio code using extjs 4 in sandbox mode and in compatibility mode.
 *
 * @class afStudio.models.diagram.Diagram
 * @extends Ext.BoxComponent
 * @author Nikolai Babinski
 */
afStudio.models.diagram.Diagram = Ext.extend(Ext.BoxComponent, {

    //todo move to urls object
    diagramUrl : '/appFlowerStudio/modelsDiagram',

    /**
     * @property {Boolean} ready
     * Defines diagram readiness state. It is ready only when the diagram is successfully loaded.
     */

    /**
     * @property {Window} diagramGlobal
     * Global window object loaded inside diagram component.
     */

    /**
     * @property {Af.md.Application} diagramApp
     * Diagram Application object (extjs-4th implementation).
     * This property is only available when the diagram is successfully loaded
     * and is {@link #ready ready}, ready = `true`.
     */

    /**
     * Initializes component
     * @private
     * @return {Object} The configuration object
     */
    _beforeInitComponent : function() {
        //sets readiness state
        this.ready = false;

        var el = {
            tag: 'iframe',
            src: this.diagramUrl,
            style: 'border: 0;'
        };

        return {
            itemId: 'diagram',
            autoScroll: true,
            autoEl: el
        }
    },

    /**
     * @template
     */
    initComponent : function() {
        Ext.apply(this,
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );

        afStudio.models.diagram.Diagram.superclass.initComponent.apply(this, arguments);
    },

    /**
     * @template
     */
    afterRender: function() {
        var me = this,
            frameEl = me.el;

        afStudio.models.diagram.Diagram.superclass.afterRender.apply(this, arguments);

        me.diagramGlobal = frameEl.dom.contentWindow;
        me.initEvents();
    },

    /**
     * Instantiates component's events.
     * @protected
     */
    initEvents: function() {
        var me = this;

        me.addEvents(
            /**
             * @event ready
             * Fires when the diagram, linked to underlying iframe element, is loaded and ready.
             * @param {afStudio.models.diagram.Diagram} diagram This diagram component
             * @param {Af.md.Application} diagramApp The diagram application
             */
            'ready'
        );

        //diagram is loaded
        me.el.on('load', me.onLoad, me);

        //show all diagrams errors
        me.diagramGlobal.onerror = function(msg) {
            afStudio.Msg.error('Models Diagram', msg);
            return true;
        };
    },

    /**
     * Component's iframe element load event handler.
     * @protected
     */
    onLoad: function() {
        var me = this;

        me.ready = true;
        me.diagramApp = me.diagramGlobal.Af.apps.md;
        me.fireEvent('ready', me, me.diagramApp);
    }
});

/**
 * @xtype afStudio.models.diagram
 */
Ext.reg('afStudio.models.diagram', afStudio.models.diagram.Diagram);