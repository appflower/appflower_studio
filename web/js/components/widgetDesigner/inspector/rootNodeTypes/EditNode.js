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
	
    /**
     * Creates all required this node children.
     * template method
     * @override
     */
	,addRequiredChilds : function() {
        afStudio.wi.ListNode.superclass.addRequiredChilds.apply(this);
        
		this.appendChild([
			this.buildActionsNode(afStudio.wi.ActionNode)
		]);
	}//eo addRequiredChilds	
	
    /**
     * Creates and Instantiates <b>i:action</b> node.
     * @param {Function} actionNodeConstructor The {@link afStudio.wi.ActionNode} constructor 
     * @return {afStudio.wi.CollectionNode} instanciated action node object, descendant of CollectionNode
     */
    ,buildActionsNode : function(actionNodeConstructor) {
        var actionsNode = afStudio.wi.NodeBuilder.createCollectionNode({
           id: 'i:actions',
           text: 'Actions',
           metaField: 'i:actions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add action',
           dumpEvenWhenEmpty: false
        });
        
        return new actionsNode;
    }//eo buildActionsNode	
	
	/**
     * Creates fields node.
     * template method
     * @override
     * @return {afStudio.wi.FieldsNode} instanciated fields node object.
     */
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