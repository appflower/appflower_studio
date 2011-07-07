Ext.ns('afStudio.controller.error');

/**
 * Controller errors.
 * @class afStudio.model.NodeError
 * @extends Ext.Error
 * @author Nikolai Babinski
 */
afStudio.controller.error.ControllerError = Ext.extend(Ext.Error, {
    name: 'afStudio.controller.ControllerError',
    
    lang: {
        'widget-cfg-incorrect' : 'Widget configuration object is not correct.'
    }
});
