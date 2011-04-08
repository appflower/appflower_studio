/**
 * This class represents structure of List type Widget
 * After creation it is new list widget
 * If needed - already existing widget definition can be loaded into this structure
 */
afStudio.widgetDesigner.ListNode = Ext.extend(afStudio.widgetDesigner.ObjectRootNode, {
	
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
        afStudio.widgetDesigner.ListNode.superclass.constructor.apply(this, arguments);
        
        var behavior = new afStudio.widgetDesigner.WithIParamsBehavior();        
        behavior.setProperties([
            new afStudio.widgetDesigner.PropertyTypeString('maxperpage', 'Max records per page').setValue(10).create()
        ]);
        this.addBehavior(behavior);
    }//eo constructor 
    
    /**
     * Creates all required this node children.
     * template method
     * @override
     */
	,addRequiredChilds : function() {
        afStudio.widgetDesigner.ListNode.superclass.addRequiredChilds.apply(this);
        
        var childNodes = [];
 		childNodes.push(this.buildActionsNode(afStudio.widgetDesigner.ActionNode));
 		childNodes.push(this.buildRowactionsNode(afStudio.widgetDesigner.ActionNode));
 		childNodes.push(this.buildMoreactionsNode(afStudio.widgetDesigner.ActionNode));
 		childNodes.push(this.buildProxyNode()); 		
		this.appendChild(childNodes);
	}//eo addRequiredChilds	
	
    /**
     * Creates fields node.
     * template method
     * @override
     * @return {afStudio.widgetDesigner.CollectionNode} instanciated fields node object, descendant of CollectionNode
     */
    ,buildFieldsNode : function() {
        var fieldsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({        		
        	id: 'i:fields',
            text: 'Fields',           
            createChildConstructor: afStudio.widgetDesigner.ColumnNode,
            childNodeId: 'i:column',
            addChildActionLabel: 'Add column'
        }, afStudio.widgetDesigner.FieldsNode);

        return new fieldsNode;
    }//eo buildFieldsNode
	
	/**
	 * Creates and Instantiates proxy node.
	 * @return {afStudio.widgetDesigner.ContainerNode} instanciated proxy object, descendant of ContainerNode
	 */
    ,buildProxyNode : function() {
        var proxyNode = afStudio.widgetDesigner.NodeBuilder.createContainerNode({
           text: 'Proxy',
           id: 'i:proxy',
           createProperties: function() {
               return [
                   new afStudio.widgetDesigner.PropertyTypeString('url','Url').setRequired().create()
               ];
           }
        });

        return new proxyNode;
    }//eo buildProxyNode    
    
    /**
     * Creates and Instantiates <b>i:action</b> node.
     * @param {Function} actionNodeConstructor The {@link afStudio.widgetDesigner.ActionNode} node constructor 
     * @return {afStudio.widgetDesigner.CollectionNode} instanciated action node object, descendant of CollectionNode
     */
    ,buildActionsNode : function(actionNodeConstructor) {
        var actionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
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
     * @param {Function} actionNodeConstructor The {@link afStudio.widgetDesigner.ActionNode} node constructor
     * @return {afStudio.widgetDesigner.CollectionNode} instanciated rowactions node object, descendant of CollectionNode
     */
    ,buildRowactionsNode : function(actionNodeConstructor) {
        var rowactionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
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
     * @param {Function} actionNodeConstructor The {@link afStudio.widgetDesigner.ActionNode} node constructor
     * @return {afStudio.widgetDesigner.CollectionNode} instanciated moreactions node object, descendant of CollectionNode
     */
    ,buildMoreactionsNode : function(actionNodeConstructor) {
        var moreactionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
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