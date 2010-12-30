afStudio.widgetDesigner.ListNode = Ext.extend(afStudio.widgetDesigner.ObjectRootNode, {
	getNodeConfig: function(){
        var node = {
            text: 'New list widget'
        };
        return node;
	},
	addRequiredChilds: function(){

        var actionNode = new afStudio.widgetDesigner.ContainerNodeBuilder().getConstructor({
           text: 'new action'
           ,updateNodeNameFromPropertyId: 'name',
           createProperties: function(){
               return [
                   new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create(),
                   new afStudio.widgetDesigner.PropertyBaseType('url','Url').setRequired().create(),
                   new afStudio.widgetDesigner.PropertyBaseType('iconCls','Icon').create(),
                   new afStudio.widgetDesigner.PropertyBaseType('condition','Condition').create()
               ];
            }
        });

        var actionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
           text: 'Actions',
           id: 'i:actions',
           createChildConstructor: actionNode,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add action'
        });

        var rowactionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
           text: 'Row Actions',
           id: 'i:rowactions',
           createChildConstructor: actionNode,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add row action'
        });

        var moreactionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
           text: 'More Actions',
           id: 'i:moreactions',
           createChildConstructor: actionNode,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add "more action"'
        });
        
        this.appendChild(new actionsNode);
        this.appendChild(new rowactionsNode);
        this.appendChild(new moreactionsNode);

        var datasourceNode = this.buildDatasourceNode();

        this.appendChild(new datasourceNode);

        var fieldsNode = this.buildFieldsNode();

        this.appendChild(new fieldsNode);
	},
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('i:title','Title').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeBoolean('i:description','Description').create());
    },
    buildFieldsNode: function(){
        var columnNode = this.buildColumnNode();
        var methodNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
           text: 'Fields',
           id: 'i:fields',
           createChildConstructor: columnNode,
           childNodeId: 'i:column',
           addChildActionLabel: 'Add field'
        });

        return methodNode;
    },
    buildColumnNode: function(){
        var columnNode = new afStudio.widgetDesigner.ContainerNodeBuilder().getConstructor({
           text: 'new field',
           updateNodeNameFromPropertyId: 'name',
           iconCls: 'icon-field',
           createProperties: function(){
               return [
                    new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create(),
                    new afStudio.widgetDesigner.PropertyTypeBoolean('sortable','Sortable').create(),
                    new afStudio.widgetDesigner.PropertyTypeBoolean('editable','Editable').create(),
                    new afStudio.widgetDesigner.PropertyTypeBoolean('resizable','Resizable').create(),
                    new afStudio.widgetDesigner.PropertyTypeString('style','Style').create(),
                    new afStudio.widgetDesigner.PropertyTypeString('label','Label').create()
               ];
            }
        });
        return columnNode;
    },
    buildDatasourceNode: function(){
        var methodNode = this.buildMethodNode();
        var datasourceNode = new afStudio.widgetDesigner.ContainerNodeBuilder().getConstructor({
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
                   new afStudio.widgetDesigner.PropertyTypeString('class','Class').create()
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
        var methodNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
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
        var paramNode = new afStudio.widgetDesigner.ContainerNodeBuilder().getConstructor({
           text: 'parameter',
           createProperties: function(){
               return [
                    new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create()
               ];
            }
        });
        return paramNode;
    }


});