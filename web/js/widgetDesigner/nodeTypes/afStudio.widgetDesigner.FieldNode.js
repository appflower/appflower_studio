/**
 * This node represents i:field node in edit type widget
 *
 * It needs this static definition because it extends ValueTypeNode - more on this in ValueTypeNode
 */
afStudio.widgetDesigner.FieldNode = Ext.extend(afStudio.widgetDesigner.ValueTypeNode, {
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
