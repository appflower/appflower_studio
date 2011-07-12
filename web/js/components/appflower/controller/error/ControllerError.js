Ext.ns('afStudio.controller.error');

/**
 * Controller error marker.
 * 
 * @class afStudio.controller.error.ControllerError
 * @extends Ext.Error
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.controller.error.ControllerError = Ext.extend(Ext.Error, {
    name: 'afStudio.controller.ControllerError',
    
    lang: {
        'widget-cfg-incorrect' : 'Widget configuration object is not correct.'
    }
});