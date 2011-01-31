Ext.ns('afStudio.widgets');

afStudio.widgets.treePanel = Ext.extend(Ext.tree.TreePanel, {
	
	initComponent: function() {
		var _this = this;	
	
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

		var bottomToolBar = new Ext.Toolbar({
			items: [
			'->',
			{
				text: 'Add Widget',
				iconCls: 'icon-widgets-add',
				handler: Ext.util.Functions.createDelegate(_this.onAddWidget, _this)
			},
			{xtype: 'tbseparator'},
			{
				text: 'Add Module',
				iconCls: 'icon-models-add',
				handler: Ext.util.Functions.createDelegate(_this.onAddModule, _this)
			}]			
		});
		var config = {			
			title: 'Widgets'
			,iconCls: 'icon-models'
			,url: window.afStudioWSUrls.getModulesUrl()
			,method: 'post'
			,reallyWantText: 'Do you really want to'
		    ,root: rootNode
			,rootVisible:false
			,autoScroll:true
            ,containerScroll: true
			,tools:[{id:'refresh', 
				handler:function(){
					this.loader.load(rootNode);
				}, scope: this
			}]
			,bbar: bottomToolBar
		};
		
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		
		if(!this.loader) {
			this.loader = new Ext.tree.TreeLoader({
				 url:this.url
				,baseParams:{cmd:'get'}
			});
		}

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
		
		this.treeEditor = new Ext.tree.TreeEditor(this, {
				 cancelOnEsc:true
				,completeOnEnter:true
				,ignoreNoChange:true
		});
		
		//renaming model
		this.treeEditor.on({
			canceledit : function(editor, newValue, oldValue) {
				var node = editor.editNode,
					tree = node.getOwnerTree();	
			
				if (node.attributes.NEW_NODE) {
					node.remove();
				}
			}
			,beforecomplete : function(editor, newValue, oldValue) {
				var node = editor.editNode,
					tree = node.getOwnerTree();
					
				//validates module
				if (!tree.isValidModuleName(newValue)) {			
					return false;			
				}
			}
			,complete: function(editor,newValue,oldValue)
			{
				var node = editor.editNode,
					tree = node.getOwnerTree();
										
				if (node.attributes.NEW_NODE) {
					
					node.setText(newValue);
			
					switch (node.attributes.type) {
						case "module":
		            		tree.addModule(node);
		            		break;
		            	case "xml":
		            		tree.addXml(node);
		            		break;	
		            }
				}
				else
				{
					if(newValue!=oldValue)
					{
						switch (node.attributes.type) {
							case "app":
			            		tree.renameApp(node,newValue,oldValue);
			            		break;
			            	case "module":
			            		tree.renameModule(node,newValue,oldValue);
			            		break;
			            	case "xml":
			            		tree.renameXml(node,newValue,oldValue);
			            		break;	
			            }
					}
				}
			}
		});
		
		//showing context menu for each node
		this.on({
			contextmenu: function(node, e) {
	            node.select();
	            switch (node.attributes.type) {
	            	case "app":
	            		var c = node.getOwnerTree().contextMenuApp;
	            		break;
	            	case "module":
	            		var c = node.getOwnerTree().contextMenuModule;
	            		break;
	            	case "xml":
	            		var c = node.getOwnerTree().contextMenuXml;
	            		break;	
	            }
	            
	            if(c)
	            {
	            	c.contextNode = node;
	            	c.showAt(e.getXY());
	            }
	        },
	        
	        dblclick: function(node, e){
	        	if('xml' == node.attributes.type){
					this.addWidgetDesigner(node);
	        	}
	        }
		});
		
		afStudio.models.treePanel.superclass.initComponent.apply(this, arguments);	
	} //eo initComponent
	
	,onRender:function() {
		// call parent
		afStudio.models.treePanel.superclass.onRender.apply(this, arguments);
		
		this.root.expand();

		// prevent default browser context menu to appear 
		this.el.on({
			contextmenu:{fn:function(){return false;},stopEvent:true}
		});

	} // eo function onRender
		
	,contextMenuApp: new Ext.menu.Menu({
	        items: [
	        {
	       		id: 'add-module',
	            text: 'Add module',
	            iconCls: 'icon-models-add'
	        }],
	        listeners: {
	            itemclick: function(item) {
	                switch (item.id) {
	                    case 'add-module':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().onAddModule(node);
	                        break;
	                }
	            }
	        }
	})
	,contextMenuModule: new Ext.menu.Menu({
	        items: [
	        {
	       		id: 'delete-module',
	            text: 'Delete module',
	            iconCls: 'icon-models-delete'
	        }],
	        listeners: {
	            itemclick: function(item) {
	                switch (item.id) {
	                    case 'delete-module':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().deleteModule(node);
	                        break;
	                }
	            }
	        }
	})
	,contextMenuXml: new Ext.menu.Menu({
	        items: [
	        {
	            id: 'edit-xml',
	            text: 'Edit Widget',
	            iconCls: 'icon-models-edit'
			},{
	            id: 'rename-xml',
	            text: 'Rename Widget',
	            iconCls: 'icon-edit'
			},{
	       		id: 'delete-xml',
	            text: 'Delete Widget',
	            iconCls: 'icon-models-delete'
	        }],
	        listeners: {
	            itemclick: function(item) {
	                switch (item.id) {
	                    case 'delete-xml':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().deleteXml(node);
	                        break;
	                    case 'edit-xml':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().editXml(node);
	                        break;
						case 'rename-xml':
							var node = item.parentMenu.contextNode;
//							node.ownerTree.treeEditor.editNode = node;
//							node.ownerTree.treeEditor.startEdit(node.ui.textNode);	
							
							node.getOwnerTree().fireEvent("logmessage",node.getOwnerTree(),"rename model");
							node.ownerTree.treeEditor.triggerEdit(node);		
							
							break;	                        
	                }
	            }
	        }
	})
    ,getModule:function(node) {
		var module;

		switch (node.attributes.type) {
			case "app":
        		module = false;
        		break;
        	case "module":
        		module = node.text;
        		break;
        	case "xml":
        		module = node.attributes.module;
        		break;	
        }

		return module;
	}
	
	,getXmlPath:function(node) {
		var path;

		switch (node.attributes.type) {
			case "app":
        		path = false;
        		break;
        	case "module":
        		path = false;
        		break;
        	case "xml":
                path = node.attributes.xmlPath;
        		break;	
        }

		return path;
	}
	
	,getActionPath:function(node) {
		var path;

		switch (node.attributes.type) {
			case "app":
        		path = false;
        		break;
        	case "module":
        		path = false;
        		break;
        	case "xml":
        		path = node.attributes.actionPath;
        		break;
        }

		return path;
	}
	
	,getSecurityPath:function(node) {
		var path;

		switch (node.attributes.type) {
			case "app":
        		path = false;
        		break;
        	case "module":
        		path = false;
        		break;
        	case "xml":
        		path = node.attributes.securityPath;
        		break;
        }

		return path;
	}
	
	,getType:function(node) {
		return node.attributes.type || '';
	}
	
	,getApp:function(node) {
		var app;

		switch (node.attributes.type) {
			case "app":
        		app = node.text;
        		break;
        	case "module":
        		app = node.attributes.app;
        		break;
        	case "xml":
        		module = node.attributes.app;
        		break;	
        }

		return app;
	}
	
	 /*
	 * Validates Module name
	 * @param {String} moduleName
	 * @return {Boolean} true if name is valid otherwise false
	 */
	,isValidModuleName : function(moduleName) {
		return /^[^\d]\w*$/im.test(moduleName) ? true : false;
	}
	
	/**
	 * Selects Module
	 * @param {Ext.tree.TreeNode} node The Module's node
	 */
	,selectModule : function(node) {		
		this.selectPath(node.getPath());
	}

	,onAddWidget: function(){
		var form = new Ext.FormPanel({
		    url: '', defaultType: 'textfield', width: 450, frame: true, 
			labelWidth: 100, title: false,
			items: [
				{xtype:'textfield', fieldLabel: 'Widget name', anchor: '96%', name: 'widget_name', allowBlank: false},
				{xtype:'textfield', fieldLabel: 'Path to prohect', anchor: '96%', name: 'project_path', allowBlank: false}
			]
		});
				
				//TYPES: List, Grid, Edit or Show
				
/**
* 3. Clicked "add widget", a popup will appear, which will ask
* 3.1) Name of widget, and under which model to place it.
* 3.2) which fields to pre-select for the widget. 
* Almost like the relational picker except, you can add multiple fields across multiple models. 
* That means i might select 3 fields from sfGuardUser and 2 fields from sfGuardGroup.
*/
				
		var wnd = new Ext.Window({
			title: 'Add new widget', width: 463,
			autoHeight: true, closable: true,
            draggable: true, plain:true,
            modal: true, resizable: false,
            bodyBorder: false, border: false,
            items: form,
			buttons: [
				{text: 'Add widget'},
				{text: 'Cancel', handler: function(){wnd.close}}
			],
			buttonAlign: 'center'
		});
//		wnd.show();
		
		
//		_this.relationPicker = new afStudio.models.RelationPicker({
//
//			closable: true,
//			closeAction: 'hide',
//			listeners: {
//				relationpicked : function(relation) {					
//					if (_this.fieldsGrid) {						
//						var cell = _this.fieldsGrid.getSelectionModel().getSelectedCell();
//						_this.fieldsGrid.startEditing(cell[0], cell[1]);
//						if (relation) {
//							_this.setValue(relation);
//						}
//						_this.fieldsGrid.stopEditing();
//					} else {
//						_this.setValue(relation);
//					}
//				}
//			}
//  		});		
//		
		var wb = new afStudio.widgetsBuilder({
			modelsUrl: window.afStudioWSUrls.getModelsUrl(),
			fieldsUrl: window.afStudioWSUrls.getModelsUrl()
		});
		wb.show()
	}
	
	,onAddModule : function(node) {

		var root = this.getRootNode();
		
		if(!node.ownerTree)
		{
			//if node is selected search it's node app
			node = this.getSelectionModel().getSelectedNode();
						
			//if no node is selected the select first child of root
			if(!node)
			{				
				node = root.firstChild;
			}
			else
			{
				if(node.attributes.type!='app')	
				node = root.findChild('text',node.attributes.app);
			}
		}
		
		node.expand();
	
		var newNodeAttributes = {text: 'newmodule', type: 'module', app: this.getApp(node), leaf: true, NEW_NODE: true, iconCls: 'icon-folder'};
		
		var newNode = node.appendChild(new Ext.tree.TreeNode(newNodeAttributes));
		this.selectModule(newNode);
		this.treeEditor.triggerEdit(newNode);		
	}
	
	,addModule:function(node)
	{
		Ext.Msg.show({
			 title:'Add'
			,msg:this.reallyWantText + ' add module <b>' + this.getModule(node) + '</b>?'
			,icon:Ext.Msg.WARNING
			,buttons:Ext.Msg.YESNO
			,width:400
			,scope:this
			,fn:function(response) {
				// do nothing if answer is not yes
				if('yes' !== response) {
					node.remove();
					return;
				}
				// setup request options
				var options = {
					 url:this.url
					,method:this.method
					,scope:this
					//,callback:this.cmdCallback
					,node:node
					,params:{
						 cmd:'addModule'
						,moduleName:this.getModule(node)
						,app:this.getApp(node)
					},
					success: function(response, opts) {
				      var response = Ext.decode(response.responseText);
				      
				      if(response.success)
				      {
				      	afStudio.vp.layout.west.items[1].root.reload();
				      	
				      	afStudio.updateConsole(response.console);
				      }
				      else
				      {
				      	node.remove();
				      }
				      
				      Ext.Msg.show({
						 title:response.success?'Success':'Failure'
						,msg:response.message
						,buttons:Ext.Msg.OK
						,width:400
				      });
				    }
				};
				Ext.Ajax.request(options);
			}
		});
	}
	
	,deleteModule:function(node)
	{
		var self = this;
		Ext.Msg.show({
			 title:'Delete'
			,msg:this.reallyWantText + ' delete <b>' + this.getModule(node) + '</b> module?'
			,icon:Ext.Msg.WARNING
			,buttons:Ext.Msg.YESNO
			,width:400
			,scope:this
			,fn:function(response) {
				// do nothing if answer is not yes
				if('yes' !== response) {
					this.getEl().dom.focus();
					return;
				}
				// setup request options
				var options = {
					 url:this.url
					,method:this.method
					,scope:this
					//,callback:this.cmdCallback
					,node:node
					,params:{
						 cmd:'deleteModule'
						,moduleName:this.getModule(node)
						,app:this.getApp(node)
					},
					success: function(response, opts) {
				      var response = Ext.decode(response.responseText);
				      
				      if(response.success)
				      {
				      	node.remove();
				      	
				      	afStudio.vp.layout.west.items[1].root.reload();
				      	
				      	afStudio.updateConsole(response.console);	
				      	self.fireEvent("logmessage",self,"delete "+node.text+" Widget");
				      }
				      else
				      {
				      }
				      
				      Ext.Msg.show({
						 title:response.success?'Success':'Failure'
						,msg:response.message
						,buttons:Ext.Msg.OK
						,width:400
				      });
				    }
				};
				Ext.Ajax.request(options);
			}
		});
	}
	
	,renameModule:function(node,newValue,oldValue)
	{
		Ext.Msg.show({
			 title:'Rename'
			,msg:this.reallyWantText + ' rename module\'s name from <b>' + oldValue + '</b> to <b>' + newValue + '</b>?'
			,icon:Ext.Msg.WARNING
			,buttons:Ext.Msg.YESNO
			,width:400
			,scope:this
			,fn:function(response) {
				// do nothing if answer is not yes
				if('yes' !== response) {
					node.setText(oldValue);
					this.getEl().dom.focus();
					return;
				}
				// setup request options
				var options = {
					 url:this.url
					,method:this.method
					,scope:this
					//,callback:this.cmdCallback
					,node:node
					,params:{
						 cmd:'renameModule'
						,moduleName:oldValue
						,renamedModule:newValue
						,app:this.getApp(node)
					},
					success: function(response, opts) {
				      var response = Ext.decode(response.responseText);
				      
				      if(response.success)
				      {
				      	afStudio.vp.layout.west.items[1].root.reload();
				      	
				      	afStudio.updateConsole(response.console);
				      }
				      else
				      {
				      	node.setText(oldValue);
				      }
				      
				      Ext.Msg.show({
						 title:response.success?'Success':'Failure'
						,msg:response.message
						,buttons:Ext.Msg.OK
						,width:400
				      });
				    }
				};
				Ext.Ajax.request(options);
			}
		});
	}
	
	,renameXml:function(node,newValue,oldValue)
	{
		Ext.Msg.show({
			 title:'Rename'
			,msg:this.reallyWantText + ' rename xml\'s name from <b>' + oldValue + '</b> to <b>' + newValue + '</b>?'
			,icon:Ext.Msg.WARNING
			,buttons:Ext.Msg.YESNO
			,width:400
			,scope:this
			,fn:function(response) {

				return false;
				
				// do nothing if answer is not yes
				if('yes' !== response) {
					node.setText(oldValue);
					this.getEl().dom.focus();
					return;
				}
				// setup request options
				var options = {
					 url:this.url
					,method:this.method
					,scope:this
					//,callback:this.cmdCallback
					,node:node
					,params:{
						 cmd:'renameModule'
						,moduleName:oldValue
						,renamedModule:newValue
						,app:this.getApp(node)
					},
					success: function(response, opts) {
				      var response = Ext.decode(response.responseText);
				      
				      if(response.success)
				      {
				      	afStudio.vp.layout.west.items[1].root.reload();
				      	
				      	afStudio.updateConsole(response.console);
				      }
				      else
				      {
				      	node.setText(oldValue);
				      }
				      
				      Ext.Msg.show({
						 title:response.success?'Success':'Failure'
						,msg:response.message
						,buttons:Ext.Msg.OK
						,width:400
				      });
				    }
				};
				Ext.Ajax.request(options);
			}
		});
	}
	
		
	,editXml:function(node)
	{
		this.addWidgetDesigner(node);
	}
	
	,addWidgetDesigner: function(node){
        var actionPath = this.getActionPath(node);
        var securityPath = this.getSecurityPath(node);
        var widgetUri = node.attributes.widgetUri;
        
        afStudio.showWidgetDesigner(widgetUri,actionPath,securityPath);		
	}
}); 

// register xtype
Ext.reg('afStudio.widgets.treePanel', afStudio.widgets.treePanel);

// eof
