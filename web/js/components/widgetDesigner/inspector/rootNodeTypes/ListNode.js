/**
 * This class represents structure of List type Widget
 * After creation it is new list widget
 * If needed - already existing widget definition can be loaded into this structure
 * 
 * @class afStudio.wi.ListNode
 * @extends afStudio.wi.ObjectRootNode
 */ 
afStudio.wi.ListNode = Ext.extend(afStudio.wi.ObjectRootNode, {
	
	/**
	 * @property widgetType
	 * @type {String}
	 */
    widgetType : 'list'
    
    /**
     * Returns configuration object for ListNode.
     * template method
     * @override
     */
	,getNodeConfig : function() {
        var node = {
            text: 'New list widget'
        };
        
        return node;
	}//eo getNodeConfig
	
	/**
	 * ListNode constructor
	 * @constructor
	 */
    ,constructor : function() {
        afStudio.wi.ListNode.superclass.constructor.apply(this, arguments);
        
        var behavior = new afStudio.wi.WithIParamsBehavior();        
        behavior.setProperties([
            new afStudio.wi.PropertyTypeString('maxperpage', 'Max records per page').setValue(10).create()
        ]);
        this.addBehavior(behavior);
    }//eo constructor 
    
    /**
     * Creates all required this node children.
     * template method
     * @override
     */
	,addRequiredChilds : function() {
        afStudio.wi.ListNode.superclass.addRequiredChilds.apply(this);
        
        var childNodes = [];
 		childNodes.push(this.buildActionsNode(afStudio.wi.ActionNode));
 		childNodes.push(this.buildRowactionsNode(afStudio.wi.ActionNode));
 		childNodes.push(this.buildMoreactionsNode(afStudio.wi.ActionNode));
 		childNodes.push(this.buildProxyNode()); 		
		this.appendChild(childNodes);
	}//eo addRequiredChilds	
	
    /**
     * Creates fields node.
     * template method
     * @override
     * @return {afStudio.wi.CollectionNode} instanciated fields node object, descendant of CollectionNode
     */
    ,buildFieldsNode : function() {
        var fieldsNode = afStudio.wi.NodeBuilder.createCollectionNode({        		
        	id: 'i:fields',
            text: 'Fields',           
            createChildConstructor: afStudio.wi.ColumnNode,
            childNodeId: 'i:column',
            addChildActionLabel: 'Add column'
        }, afStudio.wi.FieldsNode);

        return new fieldsNode;
    }//eo buildFieldsNode
	
	/**
	 * Creates and Instantiates proxy node.
	 * @return {afStudio.wi.ContainerNode} instanciated proxy object, descendant of ContainerNode
	 */
    ,buildProxyNode : function() {
        var proxyNode = afStudio.wi.NodeBuilder.createContainerNode({
           text: 'Proxy',
           id: 'i:proxy',
           createProperties: function() {
               return [
                   new afStudio.wi.PropertyTypeString('url','Url').setRequired().create()
               ];
           }
        });

        return new proxyNode;
    }//eo buildProxyNode    
    
    /**
     * Creates and Instantiates <b>i:action</b> node.
     * @param {Function} actionNodeConstructor The {@link afStudio.wi.ActionNode} node constructor 
     * @return {afStudio.wi.CollectionNode} instanciated action node object, descendant of CollectionNode
     */
    ,buildActionsNode : function(actionNodeConstructor) {
        var actionsNode = afStudio.wi.NodeBuilder.createCollectionNode({
           id: 'i:actions',
           text: 'Actions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add action',
           dumpEvenWhenEmpty: false
        });
        
        return new actionsNode;
    }//eo buildActionsNode
    
    /**
     * Creates and Instantiates <b>i:rowactions</b> node.
     * @param {Function} actionNodeConstructor The {@link afStudio.wi.ActionNode} node constructor
     * @return {afStudio.wi.CollectionNode} instanciated rowactions node object, descendant of CollectionNode
     */
    ,buildRowactionsNode : function(actionNodeConstructor) {
        var rowactionsNode = afStudio.wi.NodeBuilder.createCollectionNode({
           id: 'i:rowactions',
           text: 'Row Actions',           
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add row action',
           dumpEvenWhenEmpty: false
        });
        
        return new rowactionsNode;
    }//eo buildRowactionsNode
    
    /**
     * Creates and Instantiates <b>i:moreactions</b> node.
     * @param {Function} actionNodeConstructor The {@link afStudio.wi.ActionNode} node constructor
     * @return {afStudio.wi.CollectionNode} instanciated moreactions node object, descendant of CollectionNode
     */
    ,buildMoreactionsNode : function(actionNodeConstructor) {
        var moreactionsNode = afStudio.wi.NodeBuilder.createCollectionNode({
           id: 'i:moreactions',
           text: 'More Actions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add "more action"',
           dumpEvenWhenEmpty: false
        });
        
        return new moreactionsNode;
    }//eo buildMoreactionsNode
});