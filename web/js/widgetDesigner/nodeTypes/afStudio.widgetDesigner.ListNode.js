afStudio.widgetDesigner.ListNode = Ext.extend(Ext.util.Observable, {
	/**
	 * @var config
	 * node's configuration
	 */
	config: null,
	
	/**
	 * @constructor
	 * @param {Object} data - response data
	 */
	constructor: function(data){
		var root = this.createRootNode(data);
		
        var config = {
            expanded: true,
            text: 'Widget Inspector',
			id: 'widgetinspector',
            children: [
            	{
            		text: 'editWidget.xml - II', leaf: false,
            		
            		expanded: true, 
            		children: [
			           	{
			        		text: 'Field 1 - II', leaf: false, expanded: true,
			        		itemId: 'field', iconCls: 'icon-field',
			        		children: [
			        			{text: 'Validator 1 - II', itemId: 'validator', iconCls: 'icon-validator', leaf: true},
			        			{text: 'Validator 2 - II', itemId: 'validator', iconCls: 'icon-validator', leaf: true}
			        		]
			        	}
            		]
            	}         	
            ]
        };

	    this.createRootNode(data);
	    return new Ext.tree.AsyncTreeNode(this.config);
	},
	
	/**
	 * Function createRootNode
	 * Create Root node and append children to it
	 * @param {Object} data - response data
	 */		
	
	createRootNode: function(data){
		this.config = {
			expanded: true,
			text: 'Widget Inspector', 
			id: 'widgetinspector',
			children: [
				{
					text: data['i:title'] || 'Object node',
					qtip: data['i:description'] || 'Default QTip',
					leaf: false, 
					expanded: false,
					itemId: 'object', iconCls: 'icon-obj'
				}
			]
		}
		
		this.createActions(data);
		this.createDataStore(data);
		this.createFields(data);
	},

	/**
	 * Function createActions
	 * Create Action node and actions nodes
	 * @param {Object} data - response data
	 */		
	createActions: function(data){
		if(actions = data['i:actions']){
			if(a = actions['i:action']){
				this.setRootExpanded(true);
				
				var node = {text: 'Actions', expanded: false, itemId: 'actions', leaf: false, children: []};
				this.addNodeToRoot(node);
				
				
				for(var i =0, l= a.length; i<l; i++){
					var n = {
						leaf: true, expanded: false,
						itemId: 'action', iconCls: a[i].iconCls|| 'icon-field',
						text: a[i].name || 'Default action name'
						//condition, url..
					}
					node.children.push(n);
				}
			}
		}
	},

	/**
	 * Function createDataStore
	 * Create DataStore node and methods nodes
	 * @param {Object} data - response data
	 */	
	createDataStore: function(data){
		if(ds = data['i:datasource']){
			this.setRootExpanded(true)
			var node = {
				expanded: true, text: 'Datasource',
				
				itemId: 'datasource', iconCls: 'icon-data',
				
				type: ds.type
			};
			
			if(method = ds['i:method']){
				node.children = [
					{text: method.name, itemId: 'method', leaf: true}
				]
			}
			this.addNodeToRoot(node);
		}
	},
	
	/**
	 * Function createFields
	 * Create field nodes
	 * @param {Object} data - response data
	 */
	createFields: function(data){
		if(fields = data['i:fields']){
			if(c = fields['i:column']){
				this.setRootExpanded(true);
				for(var i=0, l=c.length; i<l; i++){
					var node = {
						leaf: true, expanded: false,
						itemId: 'field', iconCls: 'icon-field',
						text: c[i].label || 'Default field name'
					}
					this.addNodeToRoot(node);					
				}
			}
		}
	},
	
	/**
	 * Function setRootExpanded
	 * Set root node expanded
	 */
	setRootExpanded: function(is_expanded){
		this.config.expanded = is_expanded;		
	},
	
	/**
	 * Function ifRootHasChild
	 * Check if root item has children attribute
	 * @return {Boolean}
	 */
	ifRootHasChild: function(){
		return (undefined == this.config.children[0].children)?false:true;
	},
	
	/**
	 * Function addNodeToRoot
	 * Add node to root item
	 * @param {AsyncTreeNode Object} node - new node
	 */
	addNodeToRoot: function(node){
		if(this.ifRootHasChild()){
			this.config.children[0].children.push(node);
		} else {
			this.config.children[0].children = [node];
		}
	}
});
Ext.reg('afStudio.widgetDesigner.ListNode', afStudio.widgetDesigner.ListNode);