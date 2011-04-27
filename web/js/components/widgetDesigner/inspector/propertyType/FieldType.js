/**
 * This class represents type attribute of i:field element
 * @class afStudio.wi.FieldType
 * @extends afStudio.wi.PropertyTypeChoice
 */ 
afStudio.wi.FieldType = Ext.extend(afStudio.wi.PropertyTypeChoice, {
    defaultValue : ''
    
    ,constructor : function() {
        afStudio.wi.FieldType.superclass.constructor.apply(this, ['type', 'Type']);
        
        this.setChoices({
           'input':       'input',
           'textarea':    'textarea',
           'checkbox':    'checkbox',
           'hidden':      'hidden',
           'password':    'password',
           'radio':       'radio',
           'file':        'file',
           'combo':       'combo',
           'multicombo':  'multicombo'
        });
    }//eo constructor
});