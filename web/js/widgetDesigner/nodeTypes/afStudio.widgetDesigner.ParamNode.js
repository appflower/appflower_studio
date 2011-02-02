/**
 * This class contains Param node
 * It is used in places where class and method is provided
 * Also in validators
 */
afStudio.widgetDesigner.ParamNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    constructor: function(){
        afStudio.widgetDesigner.ParamNode.superclass.constructor.apply(this, arguments);
        this.addBehavior(new afStudio.widgetDesigner.WithNamePropertyAsLabelBehavior);
    },
    getNodeConfig: function(){
        return {
            'text': 'parameter'
        };
    },
    createProperties: function(){
        var properties = [
            new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create(),
            new afStudio.widgetDesigner.PropertyTypeString('_content','Value').setRequired().create()
        ];
       for (i=0; i<properties.length;i++){
           this.addProperty(properties[i]);
       }
    }
});
