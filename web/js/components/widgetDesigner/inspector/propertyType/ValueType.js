/**
 * This class represents i:valueType property from appflower.xsd file
 * @class afStudio.wi.ValueType
 * @extends afStudio.wi.PropertyTypeChoice
 */ 
afStudio.wi.ValueType = Ext.extend(afStudio.wi.PropertyTypeChoice, {
    defaultValue : ''
    
    ,constructor : function() {
        afStudio.wi.ValueType.superclass.constructor.apply(this, ['valueType', 'Value Type']);
        
        this.setChoices({
           'default': 'default',
           'orm':     'orm',
           'static':  'static',
           'file':    'file'
        });
        
        this.setRequired();
    }//eo constructor
});