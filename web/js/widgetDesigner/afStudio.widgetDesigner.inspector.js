/**
 * Widget Inspector Container
 * @class afStudio.widgetDesigner.inspector
 * @extends Ext.Container
 */
afStudio.widgetDesigner.inspector = Ext.extend(Ext.Container, {
	
	xtype: 'panel', flex: 1, 
	layout: 'vbox',
	layoutConfig: {
		align: 'stretch'
	},
	
	/**
	 * @var {Object} widgetInspectorTree
	 * Ext.TreePanel component
	 */
	widgetInspectorTree: null,

	/**
	 * @var {Object} propertiesGrid
	 * Ext.grid.PropertyGrid component
	 */	
	propertiesGrid: null,

	/**
	 * @var {Object} treeEditor
	 * Ext.tree.TreeEditor component
	 */		
	treeEditor: null,
	
	/**
	 * initComponent method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));		
		afStudio.widgetDesigner.inspector.superclass.initComponent.apply(this, arguments);		
	}	
	
	/**
	 * Create user interface
	 * @return {Object} the component instance
	 * @private
	 */
	,_initCmp : function() {
    
		this.propertiesGrid = new Ext.grid.PropertyGrid({
	        flex: 1,
	        title: 'Properties',
	        frame: true,
		
	        propertyNames: {
	            wtype: 'Widget Type',
	            maxperpage: 'Maximum per page'
	        },
	        
	        customRenderers: {
	        	wtype: function(v){
	        		switch(v){
	        			case 'list': {
	        				v = 'List';
	        				break;
	        			}
	        			case 'show':{ 
	        				v = 'Show';
	        				break;
	        			}
	        			case 'edit': {
	        				v = 'Edit';
	        				break;
	        			}
	        		}
	        		return v;
	        	}
	        },
	        
	        customEditors: {
	        	wtype: new Ext.grid.GridEditor(new Ext.form.ComboBox({
	        		selectOnFocus:true, 
	        		store: [['list', 'List'], ['edit', 'Edit'], ['show', 'Show']],
	        		triggerAction: 'all'
	        	}))
	        },
	        
	        source: {},
	        viewConfig : {
	            forceFit: true,
	            scrollOffset: 19
	        }
    	});
		
		
		//Create widget inspector tree item
		var scope = this;
		this.widgetInspectorTree = new Ext.tree.TreePanel({
            animate:true, autoScroll:true, 
			flex: 1,
			frame: true,
			title: 'Widget Inspector',
			
		    contextMenu: new Ext.menu.Menu({
		        items: [
		        	{iconCls: 'icon-add', id: 'add-field', text: 'Add Field'},
					{iconCls: 'icon-add', id: 'add-validator', text: 'Add Validator'},
					{iconCls: 'icon-add', id: 'add-param', text: 'Add Datasource Param'},
					{iconCls: 'icon-delete', id: 'delete-node', text: 'Delete Item'}
		        ],
		        listeners: {
		            'itemclick': function(item) {
		            	// Example of path is: '/widgetinspector/xnode-157/...';
		            	var path_arr = item.parentMenu.contextNode.getPath().split('/');
		            	var obj_id = path_arr[2];
		            	
		            	var root = this.widgetInspectorTree.getRootNode();
		            	
		                switch (item.id) {
							case 'add-field': {
								var param = 'object';
								var itemId = 'field';
								var name = 'New Field';
								break;
							}
							
							case 'add-validator': {
								var param = 'field';
								var itemId = 'validator';
								var name = 'New Validator';
								break;
							}
							
							case 'add-param':{
								var param = 'datasource';
								var itemId = 'param';
								var name = 'New Method Parametr';
								break;
							}
							
		                    case 'delete-node': {
		                        var n = item.parentMenu.contextNode;
		                        if (n.parentNode) {
		                            n.remove();
		                        }
		                        break;
		                    }
		                }
		                
		                if(param){
    						var node = new Ext.tree.TreeNode({
	        					text: name, itemId: itemId, leaf: true,
    						});
    						
    						var obj_node = root.findChild('itemId', param, true);
    						obj_node.expand();
    						obj_node.appendChild(node);
    						
			                this.widgetInspectorTree.getSelectionModel().select(node);
			                
			                (function(){
			                    this.treeEditor.editNode = node;
			                    this.treeEditor.startEdit(node.ui.textNode);			                	
			                }).defer(100, this)
		                }
		                
		            }, scope: scope
		        }
		    }),

            listeners: {
		        'contextmenu': function(node, e) {
	            	if('widgetinspector' != node.id){
	            		
	            		switch(node.attributes.itemId){
	            			case 'action': {
	            				break;
	            			}
	            		}
	            		
			            node.select();
			            var c = node.getOwnerTree().contextMenu;
			            c.contextNode = node;
			            c.showAt(e.getXY());
	            	}
			    },
            	'click': function(node, e){
            		var item_id = 'widgetinspector';
            		try {
	            		item_id = node.attributes.itemId || item_id;
            		} catch (e) {}

        
            		switch(item_id){
            			case 'widgetinspector': {
            				this.propertiesGrid.setSource({
							    wtype: "list",
							    maxperpage: 20
							});
            				break;
            			}
            			
            			case 'field':{

            				this.propertiesGrid.setSource({
							    'Name': 'Field Name',
							    'Label': 'Label',
							    'Sortable': false,
							    'Grouping': 'Grouping Value',
							    'Cache': true,  
							    'Icon Class': 'Icon Class',  
								'URL': 'URL',
								'Tooltip': 'Tooltip',
								'Condition': 'What does it mean?'
							});
            				break;
            			}

            			case 'action':{
            				this.propertiesGrid.setSource({
							    'Name': 'Name',
							    'URL': 'URL',
							    'Icon Class': 'Icon Class'
							});
            				break;
            			}            			
            		}
            	}, scope: this
            },			
			
            containerScroll: true, 
//            rootVisible: false,
            layout: 'fit'
        });
        
        //Create and setup root item
        var root = new Ext.tree.AsyncTreeNode({
            expanded: true,
            text: 'Widget Inspector',
			id: 'widgetinspector',
            children: [
            	{
            		text: 'Object 1', leaf: false,
            		itemId: 'object', expanded: true,
            		children: [
			           	{
			        		text: 'Field 1', leaf: false, expanded: true,
			        		itemId: 'field',
			        		children: [
			        			{text: 'Validator 1', itemId: 'validator', leaf: true},
			        			{text: 'Validator 2', itemId: 'validator', leaf: true}
			        		]
			        	}, 
			        	{text: 'Action 3', itemId: 'action', leaf: true},
			        	{
			        		text: 'Datasource', leaf: false, expanded: true,
			        		itemId: 'datasource',
			        		children: [
			        			{text: 'Param 1', itemId: 'param', leaf: true}
			        		]
			        	},
						{text: 'Action 1', itemId: 'action', leaf: true},
						{text: 'Action 2', itemId: 'action', leaf: true}            
            		]
            	},
            	
            	{
            		text: 'Object 2', leaf: false, expanded: true,
            		itemId: 'object',
            		children: [
			           	{text: 'Field 1', leaf: true, itemId: 'field'}, 
			        	{
			        		text: 'Datasource', leaf: false, expanded: true,
			        		itemId: 'datasource',
			        		children: [
			        			{text: 'Param 1', itemId: 'param', leaf: true},
			        			{text: 'Param 2', itemId: 'param',  leaf: true}
			        		]
			        	},
						{text: 'Action 1', itemId: 'action', leaf: true},
						{text: 'Action 2', itemId: 'action', leaf: true}            
            		]
            	}            	
            ]
        });
		this.widgetInspectorTree.setRootNode(root);
		
		this.treeEditor = new Ext.tree.TreeEditor(this.widgetInspectorTree, {}, {
	        allowBlank:false,
	        blankText: 'A name is required',
	        selectOnFocus:true
	    });
		
		return {
			itemId: 'inspector',	
			defaults: {
				style: 'padding:4px;'
			},
			items: [
				this.widgetInspectorTree,
				this.propertiesGrid
			]
		}
	}
});
Ext.reg('afStudio.widgetDesigner.inspector', afStudio.widgetDesigner.inspector);