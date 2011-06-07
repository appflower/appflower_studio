/**
 * Root node for HTML view.
 * 
 * @class afStudio.wi.HtmlNode
 * @extends afStudio.wi.ObjectRootNode
 */
afStudio.wi.HtmlNode = Ext.extend(afStudio.wi.ObjectRootNode, {	
	/**
	 * @property widgetType
	 * @type {String}
	 */
    widgetType : 'html'
    
    /**
     * Returns configuration object for ListNode.
     * template method
     * @override
     */
	,getNodeConfig : function() {
        return {
            text: 'New html widget',
            metaField: 'root'
        };
	}//eo getNodeConfig
	
	/**
	 * ListNode constructor
	 * @constructor
	 */
    ,constructor : function() {
        afStudio.wi.HtmlNode.superclass.constructor.apply(this, arguments);
     }//eo constructor 
    
    /**
     * Creates all required this node children.
     * template method
     * @override
     */
	,addRequiredChilds : function() {        
		this.appendChild([
			this.buildActionsNode(afStudio.wi.ActionNode),
			this.buildMoreactionsNode(afStudio.wi.ActionNode)
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
     * Creates and Instantiates <b>i:moreactions</b> node.
     * @param {Function} actionNodeConstructor The {@link afStudio.wi.ActionNode} node constructor
     * @return {afStudio.wi.CollectionNode} instanciated moreactions node object, descendant of CollectionNode
     */
    ,buildMoreactionsNode : function(actionNodeConstructor) {
    	//extending afStudio.wi.ActionNode class
    	actionNodeConstructor = Ext.extend(actionNodeConstructor, {
    		getNodeConfig : function() {
    			var attr = actionNodeConstructor.superclass.getNodeConfig.call(this);
    			return Ext.apply(attr, {
    				metaField: 'i:moreaction'
    			});
    		}
    	});
    	
        var moreactionsNode = afStudio.wi.NodeBuilder.createCollectionNode({
           id: 'i:moreactions',
           text: 'More Actions',
           metaField: 'i:moreactions',
           createChildConstructor: actionNodeConstructor,
           childNodeId: 'i:action',
           addChildActionLabel: 'Add "more action"',
           dumpEvenWhenEmpty: false
        });
        
        return new moreactionsNode;
    }//eo buildMoreactionsNode
});