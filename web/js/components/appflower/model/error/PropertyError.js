Ext.ns('afStudio.model.error');

/**
 * Property errors marker.
 * 
 * @class afStudio.model.error.PropertyError
 * @extends Ext.Error
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.error.PropertyError = Ext.extend(Ext.Error, {
    name: 'afStudio.model.PropertyError',
    
    lang: {
        'incorrect-properties' : 'The "properties" type is not correct, should be an object.'
    }
});
