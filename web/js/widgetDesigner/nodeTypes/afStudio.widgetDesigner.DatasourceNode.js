/**
 * DatasourceNodeChild extended from async treenode
 */
 /**
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
*/

afStudio.widgetDesigner.DatasourceNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
        		{iconCls: 'icon-edit', text: 'Rename Method'},
				{iconCls: 'afs-icon-delete', text: 'Delete', handler: this.remove, scope: this}
            ]
        });
    },
    contextMenuHandler: function(node, e){
        node.select();
        this.contextMenu.showAt(e.getXY());
    },
	getNodeConfig: function(data){
		
		try {
			var methodName = data['i:datasource']['i:method'].name;
		} catch (e){
			var methodName = 'New datasource method';
		}
		
        var node = {
            text: methodName,
            itemId: 'method', leaf: true,
            listeners: {
                contextmenu: this.contextMenuHandler
            }
        };
        return node;
	}
});