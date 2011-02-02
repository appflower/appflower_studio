Ext.ns('afStudio.layoutDesigner');
afStudio.layoutDesigner.treePanel = Ext.extend(Ext.tree.TreePanel, {
	initComponent: function() {
		var rootNode = new Ext.tree.AsyncTreeNode({
            expanded: true,
            text: 'Pages',
			id: 'pages',
            children: [
				{text: 'Page 1', leaf: true, page: 1,iconCls:'icon-layout'},
			    {text: 'Page 2', leaf: true, page: 2,iconCls:'icon-layout'},
			    {text: 'Page 3', leaf: true, page: 3,iconCls:'icon-layout'},
			    {text: 'Page 3', leaf: true, page: 4,iconCls:'icon-layout'}
            ]
        });
		var config = {			
			title: 'Layout',
			iconCls: 'icon-layout_content',
			root: rootNode,
			
            animate:true, autoScroll:true, 
            containerScroll: true, 
			tools:[{id:'refresh', 
				handler:function(){
					alert('refresh tool was clicked')
				}, scope: this
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
	
	_initEvents: function(){
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