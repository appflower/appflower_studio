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
    },
    setTypeAndValidatorFromModelType: function(modelType) {
        var type;
        switch (modelType) {
            case 'integer': type = ''; break;
            case 'varchar': type = ''; break;
            case 'longvarchar': type = ''; break;
            case 'timestamp': type = ''; break;
            case 'boolean': type = ''; break;
/**
textarea
checkbox
hidden
password
radio
file
combo (same as XHTML <select>)
multicombo (same as XHTML <select multiple="true">)

 */
        }
    }
});