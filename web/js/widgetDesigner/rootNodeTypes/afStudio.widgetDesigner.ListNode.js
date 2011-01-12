/**
 * This class represents structure of List type Widget
 * After creation it is new list widget
 * If needed - already existing widget definition can be loaded into this structure
 */
afStudio.widgetDesigner.ListNode = Ext.extend(afStudio.widgetDesigner.ObjectRootNode, {
    widgetType: 'list',
    fieldsNode: null,
    datasourceNode: null,
	getNodeConfig: function(){
        var node = {
            text: 'New list widget'
        };
        return node;
	},
    createProperties: function(){
        afStudio.widgetDesigner.EditNode.superclass.createProperties();
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('maxperpage','Max records per page').markAsOneOfIParam().create());
    },
	addRequiredChilds: function(){
        var actionNode = this.buildActionNode();
        var actionsNode = this.buildActionsNode(actionNode);
        var rowactionsNode = this.buildRowactionsNode(actionNode);
        var moreactionsNode = this.buildMoreactionsNode(actionNode);
        var fieldsNode = this.buildFieldsNode();
        var proxyNode = this.buildProxyNode();

        this.appendChild(new actionsNode);
        this.appendChild(new rowactionsNode);
        this.appendChild(new moreactionsNode);
        this.datasourceNode = new afStudio.widgetDesigner.DatasourceNode;
        this.appendChild(this.datasourceNode);
        this.fieldsNode = new fieldsNode;
        this.appendChild(this.fieldsNode);
        this.appendChild(new proxyNode);
	},
    getFieldsNode: function(){
        return this.fieldsNode;
    },
    getDatasourceNode: function(){
        return this.datasourceNode;
    },
    buildProxyNode: function(){
        var proxyNode = afStudio.widgetDesigner.NodeBuilder.createContainerNode({
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
        var methodNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Fields',
           id: 'i:fields',
           createChildConstructor: columnNode,
           childNodeId: 'i:column',
           addChildActionLabel: 'Add column'
        });

        return methodNode;
    },
    buildActionNode: function(){
        var actionNode = afStudio.widgetDesigner.NodeBuilder.createContainerNode({
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
        var actionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Actions',
           id: 'i:actions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add action'
        });
        return actionsNode;
    },
    buildRowactionsNode: function(actionNodeConstructor){
        var rowactionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Row Actions',
           id: 'i:rowactions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add row action'
        });
        return rowactionsNode;
    },
    buildMoreactionsNode: function(actionNodeConstructor){
        var moreactionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'More Actions',
           id: 'i:moreactions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add "more action"'
        });
        return moreactionsNode;
    },
    buildColumnNode: function(){
        var columnNode = afStudio.widgetDesigner.NodeBuilder.createContainerNode({
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
                    new afStudio.widgetDesigner.PropertyTypeString('label','Label').setRequired().create(),
                    new afStudio.widgetDesigner.PropertyTypeString('filter','Filter').create()
               ];
            }
        });
        return columnNode;
    }
});