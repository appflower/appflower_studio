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
        return {
            text: 'New list widget',
            metaField: 'root'
        };
	}//eo getNodeConfig
	
	/**
	 * ListNode constructor
	 * @constructor
	 */
    ,constructor : function() {
        afStudio.wi.ListNode.superclass.constructor.apply(this, arguments);
        
        var behavior = new afStudio.wi.WithIParamsBehavior();
        behavior.setProperties([
            new afStudio.wi.PropertyTypeString({id: 'maxperpage', label: 'Max records per page', value: 10}).create()
        ]);
        this.addBehavior(behavior);
        
        this.addEvents("childNodeCreated");
    }//eo constructor 
    
    /**
     * Creates all required this node children.
     * template method
     * @override
     */
	,addRequiredChilds : function() {
        afStudio.wi.ListNode.superclass.addRequiredChilds.apply(this);
        
		this.appendChild([
			this.buildActionsNode(afStudio.wi.ActionNode),
			this.buildRowactionsNode(afStudio.wi.ActionNode),
			this.buildMoreactionsNode(afStudio.wi.ActionNode)
		]);
	}//eo addRequiredChilds	
	
    /**
     * Creates fields node.
     * template method
     * @override
     * @return {afStudio.wi.FieldsNode} instanciated fields node object.
     */
    ,buildFieldsNode : function() {
        var fieldsNode = afStudio.wi.NodeBuilder.createCollectionNode({
        	id: 'i:fields',
            text: 'Fields',
            metaField: 'i:fields',
            addChildActionLabel: 'Add column',
            childNodeId: 'i:column',
            createChildConstructor: afStudio.wi.ColumnNode,
            createProperties: function() {
            	//call parent class' method
           		this.constructor.superclass.createProperties.call(this);
           		
            	return [
		       		new afStudio.wi.PropertyTypeBoolean({id: 'tree', label: 'Tree'}).create(),
		       		new afStudio.wi.PropertyTypeBoolean({id: 'selectable', label: 'Selectable', defaultValue: true}).create(),
		       		new afStudio.wi.PropertyTypeBoolean({id: 'exportable', label: 'Exportable', defaultValue: true}).create(),
		       		new afStudio.wi.PropertyTypeBoolean({id: 'expandButton', label: 'Expand Button'}).create(),
		       		new afStudio.wi.PropertyTypeBoolean({id: 'select', label: 'Select'}).create(),
		       		new afStudio.wi.PropertyTypeBoolean({id: 'pager', label: 'Pager', defaultValue: true}).create(),       		
		       		new afStudio.wi.PropertyTypeString({id: 'pagerTemplate', label: 'Pager Template'}).create(),
		       		new afStudio.wi.PropertyTypeBoolean({id: 'remoteSort', label: 'Remote Sort'}).create(),
		       		new afStudio.wi.PropertyTypeString({id: 'iconCls', label: 'Icon Cls'}).create(),
		       		new afStudio.wi.PropertyTypeString({id: 'icon', label: 'Icon', defaultValue: '/images/famfamfam/accept.png'}).create(),
		       		new afStudio.wi.PropertyTypeBoolean({id: 'remoteFilter', label: 'Remote Filter'}).create()
            	];
            }            
        }, afStudio.wi.FieldsNode);

        return new fieldsNode;
    }//eo buildFieldsNode
	
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
     * Creates and Instantiates <b>i:rowactions</b> node.
     * @param {Function} actionNodeConstructor The {@link afStudio.wi.ActionNode} constructor
     * @return {afStudio.wi.CollectionNode} instanciated rowactions node object, descendant of CollectionNode
     */
    ,buildRowactionsNode : function(actionNodeConstructor) {
    	//extending afStudio.wi.ActionNode class
    	actionNodeConstructor = Ext.extend(actionNodeConstructor, {
    		getNodeConfig : function() {
    			var attr = actionNodeConstructor.superclass.getNodeConfig.call(this);
    			return Ext.apply(attr, {
    				metaField: 'i:rowaction'
    			});
    		}
    		
            ,createProperties : function() {
            	//call parent's method
            	actionNodeConstructor.superclass.createProperties.call(this);
            	this.addProperties([
		       		new afStudio.wi.PropertyTypeString({id: 'params', label: 'URL Parameters'}).create()
            	]);
            }
    	});
    	
        var rowactionsNode = afStudio.wi.NodeBuilder.createCollectionNode({
        	id: 'i:rowactions',
            text: 'Row Actions',  
            metaField: 'i:rowactions',
            createChildConstructor: actionNodeConstructor,
            childNodeId: 'i:action',
            addChildActionLabel: 'Add Row Action',
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