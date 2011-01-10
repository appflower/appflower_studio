/**
 * This class contains FieldNode possible child node classes
 */
afStudio.widgetDesigner.FieldNodeValueSourceBase = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    getNodeConfig: function(){
        return {
            'text': 'Value Source'
        };
    }
});
afStudio.widgetDesigner.FieldNodeValueSourceSource = Ext.extend(afStudio.widgetDesigner.FieldNodeValueSourceBase, {
    createProperties: function(){
       this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create());
    }
});

afStudio.widgetDesigner.FieldNodeValueSourceMethod = Ext.extend(afStudio.widgetDesigner.FieldNodeValueSourceBase, {
    createProperties: function(){
       this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:class','Class').setRequired().create());
       this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:method','Method').setRequired().create());
    },
    configureFor: function(widgetData){
        if (widgetData['i:method'] && widgetData['i:method']['name']) {
            var methodName = widgetData['i:method']['name'];
            widgetData['i:method'] = methodName;
        }
        
        afStudio.widgetDesigner.FieldNode.superclass.configureFor.apply(this, [widgetData]);
    }
});

afStudio.widgetDesigner.FieldNodeValueSourceItem = Ext.extend(afStudio.widgetDesigner.FieldNodeValueSourceBase, {
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:item','Item').setRequired().create());
    }
});

afStudio.widgetDesigner.FieldNodeValueSourceStatic = Ext.extend(afStudio.widgetDesigner.FieldNodeValueSourceBase, {
    createProperties: function(){
       this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:static','Callback function').setRequired().create());
    }
});