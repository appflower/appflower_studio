afStudio.widgetDesigner.ObjectRootNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    /**
     * should contain widget type
     */
    widgetType: null,
	getNodeConfig: function(){
        var config = {
			text: 'Abstract root Object node',
            iconCls: 'icon-obj',
            expanded: true
        };
        return config;
	},
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('i:title','Title').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeBoolean('i:description','Description').create());
    },
    buildDatasourceNode: function(){
        return afStudio.widgetDesigner.DatasourceNode;
        var methodNode = this.buildMethodNode();
        var datasourceNode = afStudio.widgetDesigner.NodeBuilder.createContainerNode({
           text: 'Datasource',
           id: 'i:datasource',
           createProperties: function(){
               return [
                    new afStudio.widgetDesigner.PropertyTypeChoice('type','Type')
                        .setChoices({
                            'orm':'orm',
                            'file':'file',
                            'static': 'static'
                        }).create(),
                   new afStudio.widgetDesigner.PropertyTypeString('i:class','Class').create()
               ];
            },
            createRequiredChilds: function(){
                return [
                    new methodNode
                ];
            }
        });

        return datasourceNode;
    },
    buildMethodNode: function(){
        var paramNode = this.buildParamNode();
        var methodNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Method',
           id: 'i:method',
           createChildConstructor: paramNode,
           childNodeId: 'i:param',
           addChildActionLabel: 'Add param',
           createProperties: function(){
               return [
                   new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create()
               ];
           }
        });

        return methodNode;
    },
    buildParamNode: function(){
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
        return paramNode;
    }
});
