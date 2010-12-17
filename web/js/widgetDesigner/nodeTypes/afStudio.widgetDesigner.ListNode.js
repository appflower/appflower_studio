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
			getPropertiesFields: this.getPropertiesFields,
			expanded: true,
			text: 'Widget Inspector', 
			id: 'widgetinspector',
			children: [
				{
					text: data['i:title'] || 'Object node',
					qtip: data['i:description'] || 'Default QTip',
					leaf: false, 
					expanded: false,
					itemId: 'object', iconCls: 'icon-obj',
				
					data: [
						{name: 'wtype', value: data.type},
						{name: 'maxperpage', value: data.maximumperpage}
					]
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
						text: a[i].name || 'Default action name',
						data: [
							{name: 'Name', value: a[i].name},
							{name: 'Condition', value: a[i].condition},
							{name: 'Icon Class', value: a[i].iconCls},
							{name: 'URL', value: a[i].url}
						]
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
					
					alert(c[i].editable)
					
					var node = {
						leaf: true, expanded: false,
						itemId: 'field', iconCls: 'icon-field',
						text: c[i].label || 'Default field name',
						
						
						
						data: [
							{name: 'Editable', value: c[i].editable, type: 'bool'},
							{name: 'Filter', value: c[i].filter},
							{name: 'Label', value: c[i].label},
							{name: 'Name', value: c[i].name},
							{name: 'Resizable', value: c[i].resizable, type: 'bool'},
							{name: 'Sortable', value: c[i].sortable, type: 'bool'},
							{name: 'Style', value: c[i].style},
							
							{name: 'Grouping', value: c[i].grouping},
							{name: 'Cache', value: c[i].cache},
							{name: 'Icon Class', value: c[i].iconCls},
							{name: 'Tooltip', value: c[i].tooltip},
							{name: 'Condition', value: c[i].condition}
						]
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
			for(var i=0, l=data.length; i<l; i++){

				//TODO: manually convert to boolean. Editor combobox will be created
				if(data[i].type && 'bool' == data[i].type){
					data[i].value = (true == data[i].value)?true:false;
				}
				properties[data[i].name] = data[i].value;
			}
		}
		return properties;
	}
});
Ext.reg('afStudio.widgetDesigner.ListNode', afStudio.widgetDesigner.ListNode);