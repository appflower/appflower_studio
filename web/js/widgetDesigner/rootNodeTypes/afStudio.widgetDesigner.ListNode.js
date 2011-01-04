/**
 * This class represents structure of List type Widget
 * After creation it is new list widget
 * If needed - already existing widget definition can be loaded into this structure
 */
afStudio.widgetDesigner.ListNode = Ext.extend(afStudio.widgetDesigner.ObjectRootNode, {
	getNodeConfig: function(){
        var node = {
            text: 'New list widget'
        };
        return node;
	},
    /**
     * If we want parameters like i:params/maxperpage to be presented in properties grid
     * we must cover such case in our customized configureForValue implementation
     */
    configureForValue: function(id, value){
        if (id == 'i:params' && value['i:param'] && value['i:param']['name'] == 'maxperpage') {
            return afStudio.widgetDesigner.ListNode.superclass.configureForValue.apply(
                this,
                ['maxperpage', value['i:param']['_content']]
            );
        } else {
            return afStudio.widgetDesigner.ListNode.superclass.configureForValue.apply(this, arguments);
        }
    },
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyBaseType('i:title','Title').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeBoolean('i:description','Description').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('maxperpage','Max records per page').create());
    },
	addRequiredChilds: function(){
        var actionNode = this.buildActionNode();
        var actionsNode = this.buildActionsNode(actionNode);
        var rowactionsNode = this.buildRowactionsNode(actionNode);
        var moreactionsNode = this.buildMoreactionsNode(actionNode);
        var datasourceNode = this.buildDatasourceNode();
        var fieldsNode = this.buildFieldsNode();
        var proxyNode = this.buildProxyNode();

        this.appendChild(new actionsNode);
        this.appendChild(new rowactionsNode);
        this.appendChild(new moreactionsNode);
        this.appendChild(new datasourceNode);
        this.appendChild(new fieldsNode);
        this.appendChild(new proxyNode);
	},
    buildProxyNode: function(){
        var proxyNode = new afStudio.widgetDesigner.ContainerNodeBuilder().getConstructor({
           text: 'Proxy',
           id: 'i:proxy',
           createProperties: function(){
               return [
                   new afStudio.widgetDesigner.PropertyTypeString('url','Url').setRequired().create()
               ];
            }
        });

        return proxyNode;
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
    buildActionNode: function(){
        var actionNode = new afStudio.widgetDesigner.ContainerNodeBuilder().getConstructor({
           text: 'new action'
           ,updateNodeNameFromPropertyId: 'name',
           createProperties: function(){
               return [
                   new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create(),
                   new afStudio.widgetDesigner.PropertyBaseType('url','Url').setRequired().create(),
                   new afStudio.widgetDesigner.PropertyBaseType('iconCls','Icon CSS class').create(),
                   new afStudio.widgetDesigner.PropertyBaseType('icon','Icon URL').create(),
                   new afStudio.widgetDesigner.PropertyTypeBoolean('forceSelection','Force selection').create(),
                   new afStudio.widgetDesigner.PropertyTypeBoolean('post','Post').create(),
                   new afStudio.widgetDesigner.PropertyTypeString('tooltip','Tooltip').create(),
                   new afStudio.widgetDesigner.PropertyTypeString('confirmMsg','Confirm message').create(),
                   new afStudio.widgetDesigner.PropertyBaseType('condition','Condition').create()
               ];
            }
        });
        return actionNode;
    },
    buildActionsNode: function(actionNodeConstructor){
        var actionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
           text: 'Actions',
           id: 'i:actions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add action'
        });
        return actionsNode;
    },
    buildRowactionsNode: function(actionNodeConstructor){
        var rowactionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
           text: 'Row Actions',
           id: 'i:rowactions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add row action'
        });
        return rowactionsNode;
    },
    buildMoreactionsNode: function(actionNodeConstructor){
        var moreactionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
           text: 'More Actions',
           id: 'i:moreactions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add "more action"'
        });
        return moreactionsNode;
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