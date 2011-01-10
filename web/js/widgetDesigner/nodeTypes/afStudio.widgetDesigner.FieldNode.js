/**
 * This node represents i:field node in edit type widget
 *
 * It needs this static definition because it extends NodeWithIValueElement - more on this in NodeWithIValueElement
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
