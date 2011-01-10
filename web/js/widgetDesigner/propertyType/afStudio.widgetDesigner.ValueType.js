/**
 * This class represents i:valueType property from appflower.xsd file
 */
afStudio.widgetDesigner.ValueType = Ext.extend(afStudio.widgetDesigner.PropertyTypeChoice, {
    defaultValue: '',
    constructor: function(){
        afStudio.widgetDesigner.PropertyTypeChoice.superclass.constructor.apply(this, arguments);
        this.setChoices({
           'default': '',
           'orm': 'orm',
           'static': 'static',
           'file': 'file'
        });
        this.setRequired();
    }
});