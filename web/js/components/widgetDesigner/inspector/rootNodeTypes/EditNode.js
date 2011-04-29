/**
 * This class represents structure of Edit type Widget
 * After creation it is new edit widget
 * If needed - already existing widget definition can be loaded into this structure
 * 
 * @class afStudio.wi.EditNode
 * @extends afStudio.wi.ObjectRootNode
 */ 
afStudio.wi.EditNode = Ext.extend(afStudio.wi.ObjectRootNode, {
	
    widgetType : 'edit'
    
	,getNodeConfig : function() {
        var node = {
            text: 'New edit widget'
        };
        return node;
	}
	
    ,buildFieldsNode : function() {
        var fieldsNode = afStudio.wi.NodeBuilder.createCollectionNode({
           text: 'Fields',
           id: 'i:fields',
           createChildConstructor: afStudio.wi.FieldNode,
           childNodeId: 'i:field',
           addChildActionLabel: 'Add field',
           createProperties: function(){
               return [
                   new afStudio.wi.PropertyTypeString({id: 'url', label: 'Url'}).setRequired().create()
               ];
            }
        }, afStudio.wi.FieldsNode);

        return new fieldsNode;
    }
});