Ext.ns('afStudio.layoutDesigner');
afStudio.layoutDesigner.treePanel = Ext.extend(Ext.tree.TreePanel, {
	initComponent: function() {
		var rootNode = new Ext.tree.AsyncTreeNode({
            expanded: true,
            text: 'Pages',
			id: 'pages',
            children: [
				{text: 'Page 1', leaf: true, page: 1},
			    {text: 'Page 2', leaf: true, page: 2},
			    {text: 'Page 3', leaf: true, page: 3},
			    {text: 'Page 3', leaf: true, page: 4}
            ]
        });
		var config = {			
			title: 'Layout',
			iconCls: 'icon-models',
			root: rootNode,
			
            animate:true, autoScroll:true, 
            containerScroll: true, 
//            rootVisible: false,
            layout: 'fit',
            
//            listeners: {
//				'itemclick': function(node, e){
//
//					
//				}, scope: this
//            },
            
			bbar: {
				items: [
					'->',
					{
						text: 'Add Page',
						iconCls: 'icon-add',
						handler: function(b, e) {}
					}
				]
			}
		};
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.layoutDesigner.treePanel.superclass.initComponent.apply(this, arguments);
		this._initEvents();
	},
	
	_initEvents: function(){
		this.on({
			//showing context menu for each node
			dblclick: function(node, e) {
	            var page = item_id = node.attributes.page || 1;
				alert(page)
				afStudio.vp.addToPortal({
					title: 'Layout Designer',
					collapsible: false,
					draggable: false,
					items: [{
						xtype: 'afStudio.layoutDesigner'
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