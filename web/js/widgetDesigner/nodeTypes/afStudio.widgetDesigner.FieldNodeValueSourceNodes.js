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
        var paramNode = afStudio.widgetDesigner.NodeBuilder.createContainerNode({
           text: 'parameter',
           updateNodeNameFromPropertyId: 'name',
           createProperties: function(){
               return [
                    new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create(),
                    new afStudio.widgetDesigner.PropertyBaseType('_content','Value').setRequired().create()
               ];
            }
        });

afStudio.widgetDesigner.FieldNodeValueSourceMethod = Ext.extend(afStudio.widgetDesigner.CollectionNode, {
    addChildActionLabel: 'Add Param',
    childNodeId: 'i:param',
    getNodeConfig: function(){
        return {
            'text': 'Value Source'
        };
    },
    createChild: function(){
        return new paramNode;
    },
    createProperties: function(){
       this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:class','Class').setRequired().create());
       this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:method','Method').setRequired().create());
    },
    configureFor: function(widgetData){
        if (widgetData['i:method']) {
            var methodData = widgetData['i:method'];
            if (methodData['i:param']) {
                var paramData = methodData['i:param'];
            }
            var methodName = methodData['name'];
            widgetData['i:method'] = methodName;
            if (paramData) {
                widgetData['i:param'] = paramData;
            }
        }

        afStudio.widgetDesigner.FieldNodeValueSourceMethod.superclass.configureFor.apply(this, [widgetData]);
    },
    dumpDataForWidgetDefinition: function(){
        var propertiesData = this.dumpPropertiesData();
        var childsData = this.dumpChildsData();

        childsData['name'] = propertiesData['i:method'];
        propertiesData['i:method'] = childsData;
        return propertiesData;
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