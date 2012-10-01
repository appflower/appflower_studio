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
     * @readonly
     * Defines diagram readiness state. It is ready only when the diagram is successfully loaded.
     */

    /**
     * @property {Window} diagramGlobal
     * @readonly
     * Global window object loaded inside diagram component.
     */

    /**
     * @property {Af.md.Application} diagramApp
     * @readonly
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
        //masking diagram component during loading the AF Diagram module
        //with a short delay to correctly position a mask
        me.maskDiagram.defer(50, me, ['Preparing Models Diagram']);
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
        me.diagramGlobal.onerror = me.onError;
    },

    /**
     * Component's is loaded processor.
     * Underlying iframe element `load` event listener.
     * @protected
     */
    onLoad: function() {
        var me = this;

        me.ready = true;
        me.unmaskDiagram();
        me.diagramApp = me.diagramGlobal.Af.apps.md;
        me.fireEvent('ready', me, me.diagramApp);
    },

    /**
     * Diagram's global window {@link #diagramGlobal} `onerror` event listener.
     * It's shows/handles JavaScript errors of loaded underlying diagram in AF Studio.
     * @protected
     */
    onError: function(msg) {
        afStudio.Msg.error('Models Diagram', msg);
        return true;
    },

    /**
     * Mask this component's container's {@link #ownerCt} element.
     * @param {String} [msg] The masking message
     */
    maskDiagram: function(msg) {
        var ownerEl = this.ownerCt.el;

        if (msg) {
            ownerEl.mask(msg, 'x-mask-loading');
        } else {
            ownerEl.mask();
        }
    },

    /**
     * Unmasking diagram component, its owner container's {@link #ownerCt} element.
     */
    unmaskDiagram: function() {
        this.ownerCt.el.unmask();
    }
});

/**
 * @xtype afStudio.models.diagram
 */
Ext.reg('afStudio.models.diagram', afStudio.models.diagram.Diagram);