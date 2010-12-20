afStudio.widgetDesigner.ListNode = Ext.extend(Ext.util.Observable, {
	/**
	 * @var root element
	 * New widget type root element
	 */
	root: null,
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
	    this.createRootNode(data);

	    this.root = new Ext.tree.AsyncTreeNode(this.config);
		this.root.on('render', this.root.expand, this);
		
	    return this.root;
	},
	
	/**
	 * Function createRootNode
	 * Create Root node and append children to it
	 * @param {Object} data - response data
	 */		
	
	createRootNode: function(data){
		this.config = {
			getModifiedFields: this.getModifiedFields,
			getPropertiesFields: this.getPropertiesFields,
			setPropertyField: this.setPropertyField,
			getOwnerTree: this.getOwnerTree,
			
			expanded: true,
			text: 'Widget Inspector', 
			id: 'widgetinspector',
			children: [
				{
					text: data['i:title'] || 'Object node',
					qtip: data['i:description'] || 'Default QTip',
					leaf: false, 
					expanded: true,
					itemId: 'object', iconCls: 'icon-obj',
				
					data: {
						'wtype': data.type,
						'maxperpage': data.maximumperpage
					}
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
				
				var node = {text: 'Actions', expanded: true, itemId: 'actions', leaf: false, children: []};
				this.addNodeToRoot(node);
				
				
				for(var i =0, l= a.length; i<l; i++){
					var n = {
						leaf: true, expanded: false,
						itemId: 'action', 
//						iconCls: a[i].iconCls|| 'icon-field',
						iconCls: 'icon-field',
						text: a[i].name || 'Default action name',
						data: {
							'Name': a[i].name,
							'Condition': a[i].condition,
							'Icon Class': a[i].iconCls,
							'URL': a[i].url
						}
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
				
				itemId: 'datasource', iconCls: 'icon-data'
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
						text: c[i].label || 'Default field name',
						
						data: {
							'Editable': c[i].editable,
							'Filter': c[i].filter,
							'Label': c[i].label,
							'Name': c[i].name,
							'Resizable': c[i].resizable,
							'Sortable': c[i].sortable,
							'Style': c[i].style,
							
							'Grouping': c[i].grouping,
							'Cache': c[i].cache,
							'Icon Class': c[i].iconCls,
							'Tooltip': c[i].tooltip,
							'Condition': c[i].condition
						}
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
//		this.config.expanded = is_expanded;		
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
	},

	getModifiedFields: function(root){
		var prepareActions = function(root){
			var node = root.findChild('itemId', 'actions', true);
			if(node){
				var obj = {};
				if(node.childNodes){
					var tmp = [];
					for(var i=0, l=node.childNodes.length; i<l; i++){
						var o = node.childNodes[i].attributes.data;
						tmp.push(o);
					}
					obj['i:action'] = tmp;
				}
				return {'i:actions': obj};
			}
		}
		var prepareFields = function(root){
			var node = root.findChild('itemId', 'field', true);
			if(node){
				var obj = {};
				if(node.childNodes){
					var tmp = [];
					for(var i=0, l=node.childNodes.length; i<l; i++){
						var o = node.childNodes[i].attributes.data;
						tmp.push(o);
					}
					obj['i:action'] = tmp;
				}
				return {'i:actions': obj};
			}
		}		
		
		
		
		//TODO: User's root item located here
		var node = this.children[0];
		
		this.changedData = {
			'i:title': node.text,
			'type': node.data.wtype
		};
		
		var actions = prepareActions(root);
		if(actions)Ext.apply(this.changedData, actions);

//		var fields = prepareFields(root);
//		if(fields)Ext.apply(this.changedData, fields);
		
		
		return this.changedData;
	},
	
	/**
	 * Function getPropertiesFields
	 * Get list of node properties
	 * @param {Object} node - selected node
	 * @return {Object} values - list of pairs {name: value}
	 */
	getPropertiesFields: function(node){
		var properties = {};
		if(node.attributes && node.attributes.data){
			var data = node.attributes.data;
			
			for(var key in data) {
				properties[key] = data[key];
			}
		}
		return properties;
	},
	
	/**
	 * Function setPropertyField
	 * Set new value for selected property
	 * @param {Ext.tree.AsyncTreeNode Object} - selected node
	 * @param {Ext.data.Record Object} - record from grid
	 */
	setPropertyField: function(node, rec){
		if(node.id){
			node.attributes.data[rec.get('name')] = rec.get('value')
		}
	}
});
Ext.reg('afStudio.widgetDesigner.ListNode', afStudio.widgetDesigner.ListNode);