Ext.ns('afStudio.view.inspector.error');

/**
 * Loader error marker.
 * 
 * @class afStudio.view.inspector.error.LoaderError
 * @extends Ext.Error
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.error.LoaderError = Ext.extend(Ext.Error, {
    name: 'afStudio.view.inspector.error.LoaderError',
    
    lang: {
        'incorrect-model' : 'Assosiated with tree node model is not correct.'
    }
});