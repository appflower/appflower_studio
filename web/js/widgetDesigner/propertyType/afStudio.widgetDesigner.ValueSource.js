/**
 * This class represents <xs:element name="value"> definition from xsd
 * It defines different sets of fields that can occur inside i:value element
 */
afStudio.widgetDesigner.ValueSource = Ext.extend(afStudio.widgetDesigner.PropertyTypeChoice, {
    defaultValue: '',
    constructor: function(){
        afStudio.widgetDesigner.PropertyTypeChoice.superclass.constructor.apply(this, arguments);
        this.setChoices({
           'source': 'source',
           'classAndMethod': 'class and method',
           'static': 'static',
           'file': 'file'
        });
        this.setRequired();
    }
});