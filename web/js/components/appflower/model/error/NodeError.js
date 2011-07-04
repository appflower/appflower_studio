Ext.ns('afStudio.model.error');

/**
 * Model node errors.
 * @class afStudio.model.NodeError
 * @extends Ext.Error
 * @author Nikolai Babinski
 */
afStudio.model.error.NodeError = Ext.extend(Ext.Error, {
    name: 'afStudio.model.NodeError',
    
    lang: {
        'node-undefined' : 'Model Node is not defined.'
    }
});
