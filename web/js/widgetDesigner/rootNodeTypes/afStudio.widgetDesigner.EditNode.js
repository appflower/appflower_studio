/**
 * This class represents structure of Edit type Widget
 * After creation it is new edit widget
 * If needed - already existing widget definition can be loaded into this structure
 */
afStudio.widgetDesigner.EditNode = Ext.extend(afStudio.widgetDesigner.ObjectRootNode, {
    widgetType: 'edit',
	getNodeConfig: function(){
        var node = {
            text: 'New edit widget'
        };
        return node;
	},
	addRequiredChilds: function(){
//        var actionNode = this.buildActionNode();
//        var actionsNode = this.buildActionsNode(actionNode);
//        var rowactionsNode = this.buildRowactionsNode(actionNode);
//        var moreactionsNode = this.buildMoreactionsNode(actionNode);
        var fieldsNode = this.buildFieldsNode();
//        var proxyNode = this.buildProxyNode();

//        this.appendChild(new actionsNode);
//        this.appendChild(new rowactionsNode);
//        this.appendChild(new moreactionsNode);
        this.appendChild(new afStudio.widgetDesigner.DatasourceNode);
        this.appendChild(new fieldsNode);
//        this.appendChild(new proxyNode);
	},
//    ,buildProxyNode: function(){
//        var proxyNode = new afStudio.widgetDesigner.ContainerNodeBuilder().getConstructor({
//           text: 'Proxy',
//           id: 'i:proxy',
//           createProperties: function(){
//               return [
//                   new afStudio.widgetDesigner.PropertyTypeString('url','Url').setRequired().create()
//               ];
//            }
//        });
//
//        return proxyNode;
//    },
    buildFieldsNode: function(){
        var fieldsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Fields',
           id: 'i:fields',
           createChildConstructor: afStudio.widgetDesigner.FieldNode,
           childNodeId: 'i:field',
           addChildActionLabel: 'Add field'
        });

        return fieldsNode;
    },
//    ,buildActionNode: function(){
//        var actionNode = new afStudio.widgetDesigner.ContainerNodeBuilder().getConstructor({
//           text: 'new action'
//           ,updateNodeNameFromPropertyId: 'name',
//           createProperties: function(){
//               return [
//                   new afStudio.widgetDesigner.PropertyBaseType('name','Name').setRequired().create(),
//                   new afStudio.widgetDesigner.PropertyBaseType('url','Url').setRequired().create(),
//                   new afStudio.widgetDesigner.PropertyBaseType('iconCls','Icon CSS class').create(),
//                   new afStudio.widgetDesigner.PropertyBaseType('icon','Icon URL').create(),
//                   new afStudio.widgetDesigner.PropertyTypeBoolean('forceSelection','Force selection').create(),
//                   new afStudio.widgetDesigner.PropertyTypeBoolean('post','Post').create(),
//                   new afStudio.widgetDesigner.PropertyTypeString('tooltip','Tooltip').create(),
//                   new afStudio.widgetDesigner.PropertyTypeString('confirmMsg','Confirm message').create(),
//                   new afStudio.widgetDesigner.PropertyBaseType('condition','Condition').create()
//               ];
//            }
//        });
//        return actionNode;
//    },
//    buildActionsNode: function(actionNodeConstructor){
//        var actionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
//           text: 'Actions',
//           id: 'i:actions',
//           createChildConstructor: actionNodeConstructor,
//           childNodeId: 'i:action',
//           addChildActionLabel: 'Add action'
//        });
//        return actionsNode;
//    },
//    buildRowactionsNode: function(actionNodeConstructor){
//        var rowactionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
//           text: 'Row Actions',
//           id: 'i:rowactions',
//           createChildConstructor: actionNodeConstructor,
//           childNodeId: 'i:action',
//           addChildActionLabel: 'Add row action'
//        });
//        return rowactionsNode;
//    },
//    buildMoreactionsNode: function(actionNodeConstructor){
//        var moreactionsNode = new afStudio.widgetDesigner.CollectionNodeBuilder().getConstructor({
//           text: 'More Actions',
//           id: 'i:moreactions',
//           createChildConstructor: actionNodeConstructor,
//           childNodeId: 'i:action',
//           addChildActionLabel: 'Add "more action"'
//        });
//        return moreactionsNode;
//    },
//    buildFieldNode: function(){
//        var fieldNode = afStudio.widgetDesigner.NodeBuilder.createContainerNode({
//           text: 'new field',
//           updateNodeNameFromPropertyId: 'name',
//           iconCls: 'icon-field',
//           createChildConstructor: valueNode,
//           childNodeId: 'i:value',
//           addChildActionLabel: 'Define value',
//           createProperties: function(){
//               return [
//                    new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create(),
//                    new afStudio.widgetDesigner.PropertyTypeString('label','Label').create(),
//                    new afStudio.widgetDesigner.PropertyTypeString('type','Type').create(),
//                    new afStudio.widgetDesigner.ValueType('valueType', 'Value Type').create(),
//                    new afStudio.widgetDesigner.PropertyTypeString('state','State').create(),
//                    new afStudio.widgetDesigner.PropertyTypeString('style','Style').create(),
//                    new afStudio.widgetDesigner.PropertyTypeString('i:comment','Comment').create()
//               ];
//            }
//        });
//        return fieldNode;
//    },
    buildValueNode: function(){
        var valueNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Value',
           id: 'i:value',
           createProperties: function(){
               return [
                   new afStudio.widgetDesigner.PropertyTypeString('type','Type').setRequired().create()
               ];
           },
           createRequiredChilds: function(){
               return [
                   new sourceNode
               ];
           }
        });

        return valueNode;
    },
    buildSourceNode: function(){
        var sourceNode = afStudio.widgetDesigner.NodeBuilder.createContainerNode({
           text: 'Source',
           id: 'i:source',
           createProperties: function(){
               return [
                   new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create()
               ];
           }
        });

        return sourceNode;
    }


});