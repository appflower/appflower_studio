Ext.ns('afStudio.layoutDesigner');

afStudio.layoutDesigner.treePanel = Ext.extend(Ext.tree.TreePanel, {
	
	initComponent : function() {		
		
		var rootNode = new Ext.tree.AsyncTreeNode({
			path:'root',
			text: 'LayoutPages', 
			draggable: false
		});		
		
		var loader = new Ext.tree.TreeLoader({
			url: '/appFlowerStudio/layout',
			baseParams: {cmd:'get'}
		});
		
		var config = {			
			title: 'Layout',
			iconCls: 'icon-layout_content',
			root: rootNode,			
            animate:true, 
            autoScroll:true, 
			rootVisible: false,
            loader: loader,
			tools:[{
				id: 'refresh', 
				handler: function() {
					this.loader.load(rootNode);
				}, 
				scope: this
			}],
            
			bbar: {
				items: [
					'->',
					{
						text: 'Add Page',
						iconCls: 'icon-pages-add',
						handler: function(b, e) {}
					}
				]
			}
		};
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.layoutDesigner.treePanel.superclass.initComponent.apply(this, arguments);
		
		this._initEvents();
	},
	
	_initEvents : function(){
		var _this = this;
		
		//TreeLoader Events
		_this.loader.on({
			 beforeload : function(loader, node, clb) {
			 	node.getOwnerTree().body.mask('Loading, please Wait...', 'x-mask-loading');
			 }
			 ,load : function(loader, node, resp) {
				node.getOwnerTree().body.unmask();
			 }
			 ,loadexception : function(loader, node, resp) {
				node.getOwnerTree().body.unmask();
			 }
		});		
		
		this.on({
			//showing context menu for each node
			dblclick: function(node, e) {
	            var page = node.attributes.page || 1;
				afStudio.vp.addToPortal({
					title: 'Layout Designer',
					collapsible: false, 

					//DO NOT REMOVE
					layout: 'fit',
					
					draggable: false,
					items: [{
						xtype: 'afStudio.layoutDesigner.designerPanel', 
						page: page
					}]
				}, true);
	        }
		});		
	},
	
	onRender:function() {
		afStudio.layoutDesigner.treePanel.superclass.onRender.apply(this, arguments);
		this.root.expand();
	}
});

Ext.reg('afStudio.layoutDesigner.treePanel', afStudio.layoutDesigner.treePanel);