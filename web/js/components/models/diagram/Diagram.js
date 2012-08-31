Ext.ns('afStudio.models');

/**
 * Diagram wrapper.
 * The component is dedicated to wrap diagram realization written in extjs v.4.1,
 * models diagram is integrated with studio via iframe. This approach was selected to
 * not ruin any css and custom Studio code using extjs 4 in sandbox mode and in compatibility mode.
 *
 * How to test now:
 * 1. Open Studio, open browser's dev console
 * 2. Run the following code:
 *      var d = new afStudio.models.Diagram();
 *      afStudio.vp.addToWorkspace(d, true);
 *
 *
 * @class afStudio.models.Diagram
 * @extends Ext.BoxComponent
 * @author Nikolai Babinski
 */
afStudio.models.Diagram = Ext.extend(Ext.BoxComponent, {

    diagramUrl : '/appFlowerStudio/modelsDiagram',

    /**
     * Initializes component
     * @private
     * @return {Object} The configuration object
     */
    _beforeInitComponent : function() {

        var el = {
            tag: 'iframe',
            src: this.diagramUrl
        };

        return {
//            width: 800,
//            height: 400,
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

        afStudio.models.Diagram.superclass.initComponent.apply(this, arguments);
    }
});