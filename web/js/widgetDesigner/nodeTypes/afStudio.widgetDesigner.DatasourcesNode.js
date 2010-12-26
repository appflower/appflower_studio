/**
afStudio.widgetDesigner.DatasourcesNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
	getNodeConfig: function(data){
        return { text: 'Datasource' };
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
**/

afStudio.widgetDesigner.DatasourcesNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
				{iconCls: 'icon-data-add', text: 'Add Datasource Param', handler: this.addDsParam, scope: this},
				{iconCls: 'icon-edit', text: 'Rename Datasource'},
				{iconCls: 'afs-icon-delete', text: 'Delete Item', handler: this.remove, scope: this}
            ]
        });
    },
    
    addDsParam: function(){
        var newNode = new afStudio.widgetDesigner.DatasourceNode;
        this.expand();
        this.appendChild(newNode);
    },
    
    contextMenuHandler: function(node, e){
        node.select();
        this.contextMenu.showAt(e.getXY());
    },
    
	getNodeConfig: function(){
        var config = {
			expanded: true, text: 'Datasource',
			itemId: 'datasource', iconCls: 'icon-data',
			children: [],
            listeners: {
                contextmenu: this.contextMenuHandler
            }
        };
        return config;
	},
	
	onNodeExpand: function(node){
//		alert(2)
//		if(method = ds['i:method']){
//			node.children = [
//				{text: method.name, itemId: 'method', leaf: true}
//			]
//		}
	},
	
	_initEvents: function(){
		this.on('expand', this.onNodeExpand, this)
	}
});