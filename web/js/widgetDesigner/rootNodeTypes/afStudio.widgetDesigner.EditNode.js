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
    buildFieldsNode: function(){
        var fieldsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Fields',
           id: 'i:fields',
           createChildConstructor: afStudio.widgetDesigner.FieldNode,
           childNodeId: 'i:field',
           addChildActionLabel: 'Add field',
           createProperties: function(){
               return [
                   new afStudio.widgetDesigner.PropertyTypeString('url','Url').setRequired().create()
               ];
            }
        },
        afStudio.widgetDesigner.FieldsNode
    );

        return new fieldsNode;
    }
});