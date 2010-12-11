afStudio.CssEditor = Ext.extend(Ext.Window, { 

	initComponent: function(){
		this.createRegions();
		var config = {
			title: 'CSS Editor', width: 813,
			height: 550, closable: true,
	        draggable: true, 
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        layout: 'border',
	        items: [
	        	this.westPanel,
	        	this.centerPanel
	        ],
			buttons: [
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.CssEditor.superclass.initComponent.apply(this, arguments);	
	},
	
	createRegions: function(){
		
		var rootNode = new Ext.tree.AsyncTreeNode({path:'root',allowDrag:false});


//       var rootNode = new Ext.tree.AsyncTreeNode({
//            expanded: true,
//            text: 'XML',
//			id: 'xml',
//            children: [
//            	{
//            		text: 'XML 1', leaf: false, type: 'xml',
//            		expanded: true, iconCls: 'icon-tree-db',
//            		children: [
//	        			{text: 'APP', iconCls: 'icon-tree-table', type: 'app', leaf: true},
//	        			{text: 'MODULE', iconCls: 'icon-tree-table', type: 'module', leaf: true}
//            		]
//            	}
//            ]
//        });


//            // yui-ext tree
//            var tree = new Tree.TreePanel({
//                animate:true, 
//                autoScroll:true,
//                loader: new Tree.TreeLoader({dataUrl:'get-nodes.php'}),
//                enableDD:true,
//                containerScroll: true,
//                border: false,
//                width: 250,
//                height: 300,
//                dropConfig: {appendOnly:true}
//            });
//            
//            // add a tree sorter in folder mode
//            new Tree.TreeSorter(tree, {folderSort:true});
//            
//            // set the root node
//            var root = new Tree.AsyncTreeNode({
//                text: 'Ext JS', 
//                draggable:false, // disable root node dragging
//                id:'src'
//            });
//            tree.setRootNode(root);
//            
//            // render the tree
//            tree.render('tree');
//            
//            root.expand(false, /*no anim*/ false);

		if(!this.loader) {
			this.loader = new Ext.tree.TreeLoader({
				 dataUrl: '/appFlowerStudio/cssfilestree'
			});
		}

		this.westPanel = new Ext.tree.TreePanel( {
			split: true,
			title: 'Files', 
			iconCls: 'icon-models',
			url: '/appFlowerStudio/cssfilestree',
			method: 'post',
			loader: this.loader,
//			reallyWantText: 'Do you really want to'
//		    ,root: rootNode
//			,rootVisible:false,
			tools:[{id:'refresh', 
				handler:function(){
					this.loader.load(root);
				}, scope: this
			}],
			listeners: {
				'render': function(){
					root.expand(false, false)
				},
				'click': function(node, e){
					if(node.leaf){
						this.codeEditor.loadFile('appFlowerStudioPlugin/' + node.id);
					}
				}, scope: this
			},
			region: 'west',
			width: 220
		});
		
        // set the root node
        var root = new Ext.tree.AsyncTreeNode({
            text: 'CSS', 
            draggable:false, // disable root node dragging
            id:'css'
        });		
		this.westPanel.setRootNode(root);

		// setup loading mask if configured
		this.loader.on({
			 beforeload:function (loader,node,clb){
			 	node.getOwnerTree().body.mask('Loading, please Wait...', 'x-mask-loading');
			 }
			,load:function (loader,node,resp){
				node.getOwnerTree().body.unmask();
			}
			,loadexception:function(loader,node,resp){
				node.getOwnerTree().body.unmask();
			}
		});
				
		
//		this.westPanel = new Ext.Panel({
//			layout: 'fit', region: 'west', html: 'west', split: true,
//			width: 220
//		});
		
		this.codeEditor = new Ext.ux.CodePress({
			delayedStart: true,
			title:'Code editor - actions.class.php',
			closable:true,
			path: 'appFlowerStudioPlugin/desktop.html',
			tabTip: 'appFlowerStudioPlugin/desktop.html',
//			tabId: codeEditorTab.getId(),
			file: 'appFlowerStudioPlugin/desktop.html'
			/*,tabPanel:tabPanel*/
		});
		
		this.centerPanel = new Ext.Panel({
			layout: 'fit', region: 'center', items: [this.codeEditor]
		})
	},
	
	cancel:function(){
		this.close();
	}
});