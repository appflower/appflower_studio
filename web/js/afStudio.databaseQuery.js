afStudio.DBQuery = Ext.extend(Ext.Window, { 
	initComponent: function(){
		this.createUI();
		var config = {
			title: 'Database Query', width: 563,
			height: 550, closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        
	        items:[
	        	this.northPanel,
	        	this.westPanel,
	        	this.centerPanel
	        ],
	        
	        layout:'border',
			buttons: [
				{text: 'Query',  scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.DBQuery.superclass.initComponent.apply(this, arguments);	

	},
	
	createUI: function(){
		this.northPanel = {
			region:'north', layout:'form', height:128, frame:true,
			iconCls: 'icon-sql', margins: '0 5 5 5', title: 'SQL',
			items:[
				{xtype:'combo', fieldLabel: 'Query type', anchor:'100%', triggerAction: 'all', value: 1, store: [[1, 'SQL'], [2, 'Propel']]},
				{xtype:'textarea', hideLabel: true, height:64, anchor:'100%'}
			]
		};
		
		this.centerPanel = new Ext.Panel({
			region:'center', margins: '0 5 0 0',
			layout: 'fit',
			
			border: true,
			bodyBorder: true,
			hideBorders: true,
			
			listeners: {
				'render': function(cmp){
					(function(){
					    cmp.body.mask('Please select table...');
					}).defer(100);
				}, scope: this
			}
		});
		
		this.westPanel = new Ext.tree.TreePanel({
			region: 'west', width: 200, margins: '0 0 0 5', split: true,
            animate:true, autoScroll:true, 
            containerScroll: true, 
            rootVisible: false,
            layout: 'fit',
            listeners: {
            	'click': function(node, e){
            		if(node.leaf){
						var grid = new Ext.grid.GridPanel({
							columns:[
								{header:'column1',width:100},
								{header:'column2',width:100},
								{header:'column3',width:100}
							],
							store:new Ext.data.ArrayStore({
					        	fields: [
					        		{name: 'company'},
					            	{name: 'price', type: 'float'},
					            	{name: 'change', type: 'float'},
					            	{name: 'pctChange', type: 'float'},
					            	{name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
					         	]
							}),
							viewConfig: {
								forceFit: true
							}
						});            			
            			var tp = new Ext.TabPanel({
            				activeTab: 0,
            				items: [
            					{xtype: 'panel', title: 'Content'},
            					{xtype: 'panel', title: 'Settings', items: grid, layout: 'fit', hideBorders: true}
            				]
            			});
            			
            			this.centerPanel.body.unmask();
            			
            			this.centerPanel.removeAll(true);
            			this.centerPanel.add(tp);
            			this.centerPanel.doLayout();
            		}
            	}, scope: this
            }
        });
        
        //Create and setup root item
        var root = new Ext.tree.AsyncTreeNode({
            expanded: true,
            text: 'Databases',
			id: 'database',
            children: [
            	{
            		text: 'Database 1', leaf: false,
            		expanded: true, iconCls: 'icon-tree-db',
            		children: [
	        			{text: 'Table 1', iconCls: 'icon-tree-table', leaf: true},
	        			{text: 'Table 2', iconCls: 'icon-tree-table', leaf: true}
            		]
            	}, {
            		text: 'Database 2', leaf: false,
            		expanded: true, iconCls: 'icon-tree-db',
            		children: [
	        			{text: 'Table 1', iconCls: 'icon-tree-table', leaf: true},
	        			{text: 'Table 2', iconCls: 'icon-tree-table', leaf: true}            		]
            	}, {
            		text: 'Database 3', leaf: false,
            		expanded: true, iconCls: 'icon-tree-db',
            		children: [
	        			{text: 'Table 1', iconCls: 'icon-tree-table', leaf: true},
	        			{text: 'Table 2', iconCls: 'icon-tree-table', leaf: true}
	        		]
            	}
            ]
        });
        new Ext.tree.TreeSorter(this.westPanel, {folderSort:true});
		this.westPanel.setRootNode(root);		
	},
	
	cancel:function(){
		this.close();
	}
});