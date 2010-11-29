Ext.ns('afStudio.modules');

afStudio.modules.treePanel = Ext.extend(Ext.tree.TreePanel, {
	
	initComponent: function() {
		var rootNode = new Ext.tree.AsyncTreeNode({path:'root',allowDrag:false});
		var config = {			
			title: 'Modules'
			,iconCls: 'icon-models'
			,url: '/appFlowerStudio/modules'
			,method: 'post'
			,reallyWantText: 'Do you really want to'
		    ,root: rootNode
			,rootVisible:false
			,tools:[{id:'refresh', 
				handler:function(){
					this.loader.load(rootNode);
				}, scope: this
			}]
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
	            iconCls: 'icon-modules-add'
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
	       		id: 'delete-xml',
	            text: 'Delete xml configuration',
	            iconCls: 'icon-models-delete'
	        },{
	            id: 'edit-xml',
	            text: 'Edit xml configuration',
	            iconCls: 'icon-models-edit'
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
	
	,getPath:function(node) {
		var path;

		switch (node.attributes.type) {
			case "app":
        		path = false;
        		break;
        	case "module":
        		path = false;
        		break;
        	case "xml":
        		path = node.attributes.path;
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
	
	,onAddModule : function(node) {

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
				      	
				      	afStudio.setConsole(response.console);
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
				      	
				      	afStudio.setConsole(response.console);				      	
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
				      	
				      	afStudio.setConsole(response.console);
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
		var mask = new Ext.LoadMask(afStudio.vp.layout.center.panel.body, {msg: 'Loading, please Wait...',removeMask:true});				
		mask.show();
		
		afStudio.vp.addToPortal({
							title: 'Widget Designer',
							collapsible: false,
							draggable: false,
							items: [{
								xtype: 'afStudio.widgetDesigner',
								path: this.getPath(node),
								mask: mask
							}]
						}, true);
	}
}); 

// register xtype
Ext.reg('afStudio.modules.treePanel', afStudio.modules.treePanel);

// eof
