/**
 * This class represents i:valueType property from appflower.xsd file
 */
afStudio.widgetDesigner.ValueType = Ext.extend(afStudio.widgetDesigner.PropertyTypeChoice, {
    defaultValue: '',
    constructor: function(){
        afStudio.widgetDesigner.ValueType.superclass.constructor.apply(this, ['valueType', 'Value Type']);
        this.setChoices({
           'default': '&#x20;',
           'orm': 'orm',
           'static': 'static',
           'file': 'file'
        });
        this.setRequired();
    }
});