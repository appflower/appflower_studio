/**
 * Widget Inspector Container
 * @class afStudio.widgetDesigner.inspector
 * @extends Ext.Container
 */
afStudio.widgetDesigner.inspector = Ext.extend(Ext.Container, {
	
	xtype: 'panel', 

	layout: 'accordion',
	style: 'border-top: 1px solid #99BBE8',
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
			region: 'south',
			split: true,
	        frame: true,
			height: 150,
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
	        
	        layout: 'fit',
	        
	        source: {},
	        viewConfig : {
	            forceFit: true,
	            scrollOffset: 19
	        }
    	});
		
		
		//Create widget inspector tree item
		var scope = this;
		this.widgetInspectorTree = new Ext.tree.TreePanel({
			region: 'center',
            animate:true, autoScroll:true, 
			frame: true,
			
		    contextMenu: new Ext.menu.Menu({
		    	id: 'widget-inspector-menu',
		        items: [
		        	{iconCls: 'icon-field-add', id: 'add-field', text: 'Add Field'},
					{iconCls: 'icon-validator-add', id: 'add-validator', text: 'Add Validator'},
					{iconCls: 'icon-action-add', id: 'add-action', text: 'Add Action'},
					{iconCls: 'icon-data-add', id: 'add-param', text: 'Add Datasource Param'},
					{iconCls: 'icon-edit', id: 'edit-title', text: 'Edit Item Name'},
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
								var iconCls = 'icon-field';
								var itemId = 'field';
								var name = 'New Field';
								break;
							}
							
							case 'add-validator': {
								var param = 'field';
								var iconCls = 'icon-validator';
								var itemId = 'validator';
								var name = 'New Validator';
								break;
							}
							
							case 'add-action': {
								var param = 'actions';
								var iconCls = 'icon-action';
								var itemId = 'action';
								var name = 'New Action';
								break;
							}
							
							case 'add-param':{
								var param = 'datasource';
								var iconCls = 'field';
								var itemId = 'param';
								var name = 'New Method Parametr';
								break;
							}
							
							case 'edit-title': {
								var node = item.parentMenu.contextNode;
								this.treeEditor.editNode = node;
			                    this.treeEditor.startEdit(node.ui.textNode);			                	
								
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
	        					text: name, itemId: itemId, leaf: true, iconCls: iconCls
    						});
    						
    						if('validator' == itemId){
    							var obj_node = item.parentMenu.contextNode;
    							obj_node.leaf = false;
    						} else {
	    						var obj_node = root.findChild('itemId', param, true);
    						}
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

						var unnecessaryMenuItems = [];
						var necessaryMenuItems = [];
						
	            		switch(node.attributes.itemId){
	            			case 'object':{
	            				var editTitleMenuName = 'Rename Widget';
	            				var unnecessaryMenuItems = ['add-validator', 'add-param', 'delete-node', 'add-action'];
	            				var necessaryMenuItems = ['add-field', 'edit-title'];
	            				break;
	            			}
	            			
	            			case 'field':{
	            				var editTitleMenuName = 'Rename Field';
	            				var unnecessaryMenuItems = ['add-field', 'add-param', 'add-action'];
	            				var necessaryMenuItems = ['add-validator', 'edit-title', 'delete-node'];
	            				break;
	            			}
	            			
	            			case 'datasource': {
	            				var editTitleMenuName = 'Rename Datasource';
	            				var unnecessaryMenuItems = ['add-field', 'add-validator', 'add-action'];
	            				var necessaryMenuItems = ['add-param', 'edit-title', 'delete-node'];
	            				break;
	            			}
	            			
	            			case 'param':{
	            				var editTitleMenuName = 'Rename Method';
	            				var unnecessaryMenuItems = ['add-field', 'add-validator', 'add-param', 'add-action'];
	            				var necessaryMenuItems = ['edit-title', 'delete-node'];
	            				break;
	            			} 
	            			
	            			case 'action': {
	            				var editTitleMenuName = 'Rename Action';
	            				var unnecessaryMenuItems = ['add-field', 'add-validator', 'add-param', 'add-action'];
	            				var necessaryMenuItems = ['edit-title', 'delete-node'];
	            				break;
	            			}
	            			
	            			case 'validator': {
	            				var editTitleMenuName = 'Rename Validator';
	            				var unnecessaryMenuItems = ['add-field', 'add-validator', 'add-param', 'add-action'];
	            				var necessaryMenuItems = ['edit-title', 'delete-node'];
	            				break;
	            			}
	            			
	            			case 'actions': {
	            				var editTitleMenuName = 'Rename Action';
	            				var unnecessaryMenuItems = ['add-field', 'add-validator', 'add-param'];
	            				var necessaryMenuItems = ['add-action', 'edit-title', 'delete-node'];
	            				break;
	            			}
	            		}
	            		
			            node.select();
			            var c = node.getOwnerTree().contextMenu;
			            c.contextNode = node;
			            
			            Ext.getCmp('edit-title').setText(editTitleMenuName);
			            
			            for(var i = 0, l = unnecessaryMenuItems.length; i<l; i++){
			            	c.items.map[unnecessaryMenuItems[i]].hide();
			            }
			            for(var i = 0, l = necessaryMenuItems.length; i<l; i++){
			            	c.items.map[necessaryMenuItems[i]].show();
			            }
			            
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
							    'Name': node.text,
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
            rootVisible: false,
            layout: 'fit'
        });
        
        //Create and setup root item
        var root = new Ext.tree.AsyncTreeNode({
            expanded: true,
            text: 'Widget Inspector',
			id: 'widgetinspector',
            children: [
            	{
            		text: 'editWidget.xml', leaf: false,
            		itemId: 'object', expanded: true, iconCls: 'icon-obj',
            		children: [
			           	{
			        		text: 'Field 1', leaf: false, expanded: true,
			        		itemId: 'field', iconCls: 'icon-field',
			        		children: [
			        			{text: 'Validator 1', itemId: 'validator', iconCls: 'icon-validator', leaf: true},
			        			{text: 'Validator 2', itemId: 'validator', iconCls: 'icon-validator', leaf: true}
			        		]
			        	}, 
			        	{
			        		text: 'Datasource', leaf: false, expanded: true,
			        		itemId: 'datasource', iconCls: 'icon-data',
			        		children: [
			        			{text: 'Param 1', itemId: 'param', leaf: true}
			        		]
			        	},
			           	{
			        		text: 'Actions', leaf: false, expanded: true,
			        		itemId: 'actions', //iconCls: 'icon-field',
			        		children: [
								{text: 'Action 1', itemId: 'action', iconCls: 'icon-action', leaf: true},
								{text: 'Action 2', itemId: 'action', iconCls: 'icon-action', leaf: true},
					        	{text: 'Action 3', itemId: 'action', iconCls: 'icon-action', leaf: true}
			        		]
			        	}
            		]
            	}         	
            ]
        });
        new Ext.tree.TreeSorter(this.widgetInspectorTree, {folderSort:true});
		this.widgetInspectorTree.setRootNode(root);
		
		this.treeEditor = new Ext.tree.TreeEditor(this.widgetInspectorTree, {}, {
	        allowBlank:false,
	        blankText: 'A field is required',
	        selectOnFocus:true,
	        
	        listeners: {
	        	'beforestartedit': function(editor, boundEl, value){
	        		var cmp = Ext.getCmp('widget-inspector-menu');
	        		if(!cmp.isVisible()){
	        			return false;
	        		}
	        	},
	        	'complete': function(editor, value, startValue){
	        		var node = editor.tree.getSelectionModel().getSelectedNode();
	        		if(node && ('field' == node.attributes.itemId) ){
	        			node.text = value;
	        			editor.tree.fireEvent('click', node);
	        		}
	        	}
	        }
	    });
		
        var codeBrowser = new Ext.ux.FileTreePanel({
			 height:400
			,url:'/appFlowerStudio/filetree'
			,autoWidth:true
			,id:'ftp'
			,title:'Code Browser'
			,rootPath:'root'
			,rootVisible:true
			,rootText:'Home'
			,maxFileSize:524288*2*10
			,topMenu:false
			,autoScroll:true
			,enableProgress:false
			,singleUpload:true
		});

        var widgetInspector = new Ext.Panel({
            title: 'Widget Inspector',
            layout: 'border',
            items:[
            	this.widgetInspectorTree, this.propertiesGrid
            ]
        });

		
		return {
			itemId: 'inspector',	
			items: [
				widgetInspector, codeBrowser
			]
		}
	}
});
Ext.reg('afStudio.widgetDesigner.inspector', afStudio.widgetDesigner.inspector);