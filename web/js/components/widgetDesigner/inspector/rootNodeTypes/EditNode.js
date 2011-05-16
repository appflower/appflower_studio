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
	}//eo getNodeConfig
	
    ,buildFieldsNode : function() {    			
        var fieldsNode = afStudio.wi.NodeBuilder.createCollectionNode({
        	text: 'Fields',
            id: 'i:fields',
            createChildConstructor: afStudio.wi.FieldNode,
            childNodeId: 'i:field',
            addChildActionLabel: 'Add field',
            createProperties: function() {
            	//call parent class' method
           		this.constructor.superclass.createProperties.call(this);
           		
            	return [
            		new afStudio.wi.PropertyTypeBoolean({id: 'resetable', label: 'Resetable', defaultValue: true}).create(),
            		new afStudio.wi.PropertyTypeString({id: 'resetlabel', label: 'Submit Label', defaultValue: 'Reset'}).create(),
            		new afStudio.wi.PropertyTypeString({id: 'submitlabel', label: 'Submit Label', defaultValue: 'Submit'}).create(),
            		new afStudio.wi.PropertyTypeBoolean({id: 'multipart', label: 'Multipart'}).create(),
            		new afStudio.wi.PropertyTypeBoolean({id: 'submit', label: 'Submit', defaultValue: true}).create(),
            		new afStudio.wi.PropertyTypeBoolean({id: 'border', label: 'Border', defaultValue: true}).create(),
            		new afStudio.wi.PropertyTypeString({id: 'label', label: 'Label', defaultValue: 'Save Selection'}).create(),
            		new afStudio.wi.PropertyTypeString({id: 'labelWidth', label: 'Label Width', defaultValue: 75}).create()
            		
            	];
            }
        }, afStudio.wi.FieldsNode);

        return new fieldsNode;
    }//eo buildFieldsNode
});