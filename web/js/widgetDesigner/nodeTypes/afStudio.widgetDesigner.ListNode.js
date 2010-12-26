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
		
		this.createActions();
		this.createDatasource(data);
		this.createFields();
		this.createColumns();

	    return this.root;
	},
	
	/**
	 * Function createRootNode
	 * Create Root node and append children to it
	 * @param {Object} data - response data
	 */		
	
	createRootNode: function(data){
		this.root = new Ext.tree.TreeNode({
			getModifiedFields: this.getModifiedFields,
			getPropertiesFields: this.getPropertiesFields,
			setPropertyField: this.setPropertyField,
			getOwnerTree: this.getOwnerTree,
			
			expanded: true,
			text: 'Widget Inspector', 
			id: 'widgetinspector'
		});
		
		this.objectNode = new afStudio.widgetDesigner.ObjectRootNode(data);
		this.root.appendChild(this.objectNode);
	},

	createActions: function(){
        this.objectNode.appendChild(new afStudio.widgetDesigner.ActionsNode());
	},

	createDatasource: function(data){
        this.objectNode.appendChild(new afStudio.widgetDesigner.DatasourcesNode(data));
	},
	
	createFields: function(){
        this.objectNode.appendChild(new afStudio.widgetDesigner.FieldsNode());
	},
	
	createColumns: function(){
		this.objectNode.appendChild(new afStudio.widgetDesigner.ColumnNode());
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
//			TODO: refact
//			node.attributes.data[rec.get('name')] = rec.get('value')
		}
	}
});
Ext.reg('afStudio.widgetDesigner.ListNode', afStudio.widgetDesigner.ListNode);