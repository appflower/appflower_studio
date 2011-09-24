Ext.ns('afStudio.definition.error');

/**
 * 
 * @class afStudio.definition.error.DefinitionError
 * @extends Ext.Error
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.definition.error.DefinitionError = Ext.extend(Ext.Error, {
    name: 'afStudio.definition.DefinitionError',
    
    lang: {
        'create-entity' : 'Entity was not created'
    }
});