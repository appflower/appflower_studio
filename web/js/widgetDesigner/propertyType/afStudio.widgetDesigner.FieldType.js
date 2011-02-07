/**
 * This class represents type attribute of i:field element
 */
afStudio.widgetDesigner.FieldType = Ext.extend(afStudio.widgetDesigner.PropertyTypeChoice, {
    defaultValue: '',
    constructor: function(){
        afStudio.widgetDesigner.FieldType.superclass.constructor.apply(this, ['type','Type']);
        this.setChoices({
           'input': 'input',
           'textarea': 'textarea',
           'checkbox': 'checkbox',
           'hidden': 'hidden',
           'password': 'password',
           'radio': 'radio',
           'file': 'file',
           'combo': 'combo',
           'multicombo':'multicombo'
        });
    }
});