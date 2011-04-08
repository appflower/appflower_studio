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
     * template method
     * @override
     */
	,addRequiredChilds : function() {
        afStudio.widgetDesigner.ListNode.superclass.addRequiredChilds.apply(this);
        
        var childNodes = [];
 		childNodes.push(new (this.buildActionsNode(afStudio.widgetDesigner.ActionNode)));
 		childNodes.push(new (this.buildRowactionsNode(afStudio.widgetDesigner.ActionNode)));
 		childNodes.push(new (this.buildMoreactionsNode(afStudio.widgetDesigner.ActionNode)));
 		childNodes.push(this.buildProxyNode());
 		
		this.appendChild(childNodes);
	}//eo addRequiredChilds
	
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
     * @override
     * @return {}
     */
    ,buildFieldsNode: function(){
        var fieldsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({        		
        	id: 'i:fields',
            text: 'Fields',           
            createChildConstructor: afStudio.widgetDesigner.ColumnNode,
            childNodeId: 'i:column',
            addChildActionLabel: 'Add column'
        }, afStudio.widgetDesigner.FieldsNode);

        return new fieldsNode;
    }//eo buildFieldsNode
    
    ,buildActionsNode : function(actionNodeConstructor) {
        var actionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Actions',
           id: 'i:actions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add action',
           dumpEvenWhenEmpty: false
        });
        return actionsNode;
    }//eo buildActionsNode
    
    ,buildRowactionsNode: function(actionNodeConstructor){
        var rowactionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'Row Actions',
           id: 'i:rowactions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add row action',
           dumpEvenWhenEmpty: false
        });
        return rowactionsNode;
    }//eo buildRowactionsNode
    
    ,buildMoreactionsNode: function(actionNodeConstructor){
        var moreactionsNode = afStudio.widgetDesigner.NodeBuilder.createCollectionNode({
           text: 'More Actions',
           id: 'i:moreactions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add "more action"',
           dumpEvenWhenEmpty: false
        });
        return moreactionsNode;
    }//eo buildMoreactionsNode
});