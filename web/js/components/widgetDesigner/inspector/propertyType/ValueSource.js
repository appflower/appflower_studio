/**
 * This class represents <xs:element name="value"> definition from xsd
 * It defines different sets of fields that can occur inside i:value element 
 * @class afStudio.wi.ValueSource
 * @extends afStudio.wi.PropertyTypeChoice
 */ 
afStudio.wi.ValueSource = Ext.extend(afStudio.wi.PropertyTypeChoice, {
    id: 'valueSource'
    
    ,label : 'Value Source'
    
    ,defaultValue : ''
    
    ,constructor : function() {
        afStudio.wi.ValueSource.superclass.constructor.apply(this, arguments);
        
        this.setChoices({
           'source':         'source',
           'classAndMethod': 'class and method',
           'static':         'static',
           'file':           'file'
        });
        
        this.setRequired();
    }//eo constructor 
});