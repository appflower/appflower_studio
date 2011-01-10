/**
 * This node represents i:field node in edit type widget
 * Thanks to custom implementation for some of BaseNode methods it contains custom structure in WI tree
 * So Field node contains valueType and valueSource properties and based on their values
 * there is child node created that allows to make further configuration of i:value node
 * This node also needs custom code that sets its initial values from XML and
 * also custom code that dumps its data back to JSON so they can be written back to XML
 */
afStudio.widgetDesigner.FieldNode = Ext.extend(afStudio.widgetDesigner.NodeWithIValueElement, {
    updateNodeNameFromPropertyId: 'name',
    getNodeConfig: function(){
        return {
            'text': 'new field',
            'iconCls': 'icon-field'
        };
    },
    createProperties: function(){
       afStudio.widgetDesigner.FieldNode.superclass.createProperties.apply(this, arguments);
       var properties = [
            new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create(),
            new afStudio.widgetDesigner.PropertyTypeString('label','Label').create(),
            new afStudio.widgetDesigner.PropertyTypeString('type','Type').create(),
            new afStudio.widgetDesigner.PropertyTypeString('state','State').create(),
            new afStudio.widgetDesigner.PropertyTypeString('style','Style').create(),
       ];

       for (i=0; i<properties.length;i++){
           this.addProperty(properties[i]);
       }
    }
});
