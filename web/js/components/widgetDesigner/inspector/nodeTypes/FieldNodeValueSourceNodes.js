/**
 * This class contains FieldNode possible child node classes
 * @class afStudio.wi.FieldNodeValueSourceBase
 * @extends afStudio.wi.ContainerNode
 */ 
afStudio.wi.FieldNodeValueSourceBase = Ext.extend(afStudio.wi.ContainerNode, {
	
    getNodeConfig : function() {
        return {
            'text': 'Value Source'
        };
    }
});

/**
 * @class afStudio.wi.FieldNodeValueSourceSource
 * @extends afStudio.wi.FieldNodeValueSourceBase
 */
afStudio.wi.FieldNodeValueSourceSource = Ext.extend(afStudio.wi.FieldNodeValueSourceBase, {
    createProperties : function() {
       this.addProperty(
           new afStudio.wi.PropertyTypeString('sourceName', 'Name').setRequired().create()
       );
    }
});

/** 
 * @class afStudio.wi.FieldNodeValueSourceMethod
 * @extends afStudio.wi.CollectionNode
 */
afStudio.wi.FieldNodeValueSourceMethod = Ext.extend(afStudio.wi.CollectionNode, {
    addChildActionLabel: 'Add Param',
    
    childNodeId: 'i:param',
    
    getNodeConfig : function() {
        return {
            'text': 'Value Source'
        };
    },
    
    createChild : function() {
        return new afStudio.wi.ParamNode();
    },
    
    createProperties : function() {
       this.addProperty(new afStudio.wi.PropertyTypeString('i:class','Class').setRequired().create());
       this.addProperty(new afStudio.wi.PropertyTypeString('i:method','Method').setRequired().create());
    },
    
    configureFor : function(widgetData) {
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

        afStudio.wi.FieldNodeValueSourceMethod.superclass.configureFor.apply(this, [widgetData]);
    }
});

/**
 * @class afStudio.wi.FieldNodeValueSourceItem
 * @extends afStudio.wi.FieldNodeValueSourceBase
 */
afStudio.wi.FieldNodeValueSourceItem = Ext.extend(afStudio.wi.FieldNodeValueSourceBase, {
    createProperties : function() {
        this.addProperty(
        	new afStudio.wi.PropertyTypeString('i:item', 'Item').setRequired().create()
        );
    }
});

/**
 * @class afStudio.wi.FieldNodeValueSourceStatic
 * @extends afStudio.wi.FieldNodeValueSourceBase
 */
afStudio.wi.FieldNodeValueSourceStatic = Ext.extend(afStudio.wi.FieldNodeValueSourceBase, {
    createProperties : function() {
       this.addProperty(
           new afStudio.wi.PropertyTypeString('i:static', 'Callback function').setRequired().create()
       );
    }
});