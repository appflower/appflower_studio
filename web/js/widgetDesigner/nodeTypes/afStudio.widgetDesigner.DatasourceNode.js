afStudio.widgetDesigner.DatasourceNode = function(data){
	this.data = data;
	this.loaded = this.loading = false;
	
	this.contextMenu =  new Ext.menu.Menu({
        items: [
        	{iconCls: 'icon-field-add', id: 'add-field', text: 'Add Field1'}
		]
	});
	
    var config = this.getNodeConfig(data);
	afStudio.widgetDesigner.DatasourceNode.superclass.constructor.apply(this, [config]);
	this._initEvents();
};

Ext.extend(afStudio.widgetDesigner.DatasourceNode, Ext.tree.AsyncTreeNode, {
	getNodeConfig: function(data){
		var node = {};
		if(ds = data['i:datasource']){
			Ext.apply(node, {
				expanded: true, 
				text: 'Datasource',
				itemId: 'datasource', iconCls: 'icon-data',
				
				children: []
			});
			
//			if(method = ds['i:method']){
//				node.children = [
//					new afStudio.widgetDesigner.DatasourceNodeChild(method)
//				]
//			}
		}		
		
		return node;
	},
	
	onContextMenu: function(node, e){
		var c = this.contextMenu;
		c.contextNode = node;
		c.showAt(e.getXY());
	},
	
	_initEvents: function(){
		this.on('click', function(node, e){
			
		}, this);
		this.on('expand', function(node){
//			alert('beforeload!')
//			var method = this.data['i:datasource']['i:method'];
			var r = new afStudio.widgetDesigner.DatasourceNodeChild({name: 'TEst method', itemId: 'method', leaf: true});
			node.appendChild(r);
//			return false;
		}, this);
		this.on('contextmenu', this.onContextMenu, this);
	}
});



/**
 * DatasourceNodeChild
 */
afStudio.widgetDesigner.DatasourceNodeChild = function(data){
	this.loaded = this.loading = false;
	
	this.contextMenu =  new Ext.menu.Menu({
        items: [
        	{iconCls: 'icon-field-add', id: 'add-field2', text: 'Add 1'}
		]
	});
	
    var config = this.getNodeConfig(data);
	afStudio.widgetDesigner.DatasourceNodeChild.superclass.constructor.apply(this, [config]);
	this._initEvents();
};

Ext.extend(afStudio.widgetDesigner.DatasourceNodeChild, Ext.tree.AsyncTreeNode, {
	getNodeConfig: function(method){
		var node = {text: method.name, itemId: 'method', leaf: true};
		return node;
	},
	
	onContextMenu: function(node, e){
		var c = this.contextMenu;
		c.contextNode = node;
		c.showAt(e.getXY());
	},
	
	onClick: function(node, e){
		alert('child clicked')
	},
	
	_initEvents: function(){
//		alert('here')
		this.on('render', function(){alert('rendered')}, this);
		this.on('click', this.onClick, this);
		this.on('contextmenu', this.onContextMenu, this);
	}
});