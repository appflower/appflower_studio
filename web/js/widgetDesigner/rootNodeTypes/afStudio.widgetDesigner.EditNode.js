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
        var fieldsNode = this.buildFieldsNode();
        this.appendChild(new afStudio.widgetDesigner.DatasourceNode);
        this.appendChild(new fieldsNode);
	},
    buildFieldsNode: function(){
        var fieldsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Fields',
           id: 'i:fields',
           createChildConstructor: afStudio.widgetDesigner.FieldNode,
           childNodeId: 'i:field',
           addChildActionLabel: 'Add field'
        });

        return fieldsNode;
    }
});