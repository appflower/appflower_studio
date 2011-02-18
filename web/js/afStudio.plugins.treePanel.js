Ext.ns('afStudio.plugins');

/**
 * plugins TreeEditor
 * @class afStudio.plugins.treeEditor
 * @extends Ext.tree.TreeEditor
 */
afStudio.plugins.treeEditor = Ext.extend(Ext.tree.TreeEditor, {	
	 //prevent dbclick editing
	 beforeNodeClick : function(node, e) {
	 }
});


/**
 * plugins TreePanel
 * @class afStudio.plugins.treePanel
 * @extends Ext.tree.TreePanel
 */
afStudio.plugins.treePanel = Ext.extend(Ext.tree.TreePanel, {
	
	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	_initCmp : function() {
		var _this = this;
		
		var rootNode = new Ext.tree.AsyncTreeNode({
			path:'root',
			text: 'pluginRoot', 
			draggable: false
		});
		
		var bottomToolBar = new Ext.Toolbar({
			items: [
			'->',
			{
				text: 'Add plugin',
				iconCls: 'icon-models-add',
				handler: Ext.util.Functions.createDelegate(_this.onAddNode, _this)
			}]			
		}); 
		
		return {			
			title: 'Plugins',
			iconCls: 'icon-bricks',
			autoScroll: true,
			url: window.afStudioWSUrls.getPluginsUrl(),
			method: 'post',
			reallyWantText: 'Do you really want to',
		    root: rootNode,
			
			tools:[{id:'refresh', 
				handler:function(){
					this.loader.load(rootNode);
				}, scope: this
			}],
			
			rootVisible: false,
			bbar: bottomToolBar
		};
	} //eo _initCmp

	
	/**
	 * Template method
	 * @private
	 */	
	,initComponent: function() {		
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));		
		
		if (!this.loader) {
			this.loader = new Ext.tree.TreeLoader({
				url: this.url,
				baseParams: {cmd:'get'}
			});
		}
		
		this.treeEditor = new afStudio.plugins.treeEditor(this, {
			cancelOnEsc: true,
			completeOnEnter: true,
			ignoreNoChange: true
		});		
		
		afStudio.plugins.treePanel.superclass.initComponent.apply(this, arguments);	
		
		this._initEvents();
	} //eo initComponent
	
	/**
	 * Initializes events
	 * @private
	 */
	,_initEvents : function() {
		var _this = this;			
		
		_this.addEvents(
			/**
			 * @event <u>plugincreated</u> Fires after a new plugin was created 
			 * @param {Ext.tree.TreeNode} node The created plugin's node
			 */
			'plugincreated',
			
			/**
			 * @event <u>plugindeleted</u> Fires after a plugin was deleted
			 */
			'plugindeleted'
		);
		
		//TreeLoader Events
		_this.loader.on({
			 beforeload: function(loader,node,clb) {
			 	node.getOwnerTree().body.mask('Loading, please Wait...', 'x-mask-loading');
			 }
			 ,load: function(loader,node,resp) {
				node.getOwnerTree().body.unmask();
			 }
			 ,loadexception: function(loader,node,resp) {
				node.getOwnerTree().body.unmask();
			 }
		});		
		
		//TreeEditor events
		_this.treeEditor.on({
			beforecomplete: Ext.util.Functions.createDelegate(_this.onBeforeComplete, _this),
			complete: Ext.util.Functions.createDelegate(_this.onComplete, _this),
			canceledit: Ext.util.Functions.createDelegate(_this.onCancelEdit, _this)			
		});		

		//plugin Tree events
		_this.on({
			//showing context menu for each node
			contextmenu: function(node, e) {
	            node.select();
	            switch (node.attributes.type) {
	            	case "plugin":
	            		var c = node.getOwnerTree().contextMenuPlugin;
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
	        dblclick : Ext.util.Functions.createDelegate(_this.onpluginDbClick, _this)
		});
	}
	
	,contextMenuPlugin: new Ext.menu.Menu({
			items: [
	        {
	       		id: 'rename-plugin',
	            text: 'Rename Plugin',
	            iconCls: 'icon-edit'
	        },
	        {
	       		id: 'delete-plugin',
	            text: 'Delete Plugin',
	            iconCls: 'icon-models-delete'
	        }
	        ],
	        listeners: {
	            itemclick: function(item) {
	                switch (item.id) {
	                    case 'delete-plugin':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().deletePlugin(node);
	                        break;
						case 'rename-plugin':
							var node = item.parentMenu.contextNode;
							node.getOwnerTree().fireEvent("logmessage",node.getOwnerTree(),"rename plugin");
							node.ownerTree.treeEditor.triggerEdit(node);						
							break;
	                }
	            }
	        }
	})
	,contextMenuModule: new Ext.menu.Menu({
	        items: [
	        {
	       		id: 'rename-module',
	            text: 'Rename Module',
	            iconCls: 'icon-edit'
	        },
	        {
	       		id: 'delete-module',
	            text: 'Delete Module',
	            iconCls: 'icon-models-delete'
	        }
	        ],
	        listeners: {
	            itemclick: function(item) {
	                switch (item.id) {
	                    case 'delete-module':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().deleteModule(node);
	                        break;
						case 'rename-module':
							var node = item.parentMenu.contextNode;
							node.getOwnerTree().fireEvent("logmessage",node.getOwnerTree(),"rename module");
							node.ownerTree.treeEditor.triggerEdit(node);						
							break;
	                }
	            }
	        }
	})
	,contextMenuXml: new Ext.menu.Menu({
	        items: [
	        {
	            id: 'edit-plugin-xml',
	            text: 'Edit Page',
	            iconCls: 'icon-models-edit'
			},{
	            id: 'rename-plugin-xml',
	            text: 'Rename Page',
	            iconCls: 'icon-edit'
			},{
	       		id: 'delete-plugin-xml',
	            text: 'Delete Page',
	            iconCls: 'icon-models-delete'
	        }],
	        listeners: {
	            itemclick: function(item) {
	                switch (item.id) {
	                    case 'delete-plugin-xml':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().deleteXml(node);
	                        break;
	                    case 'edit-plugin-xml':
	                    	var node = item.parentMenu.contextNode;
	                    	afStudio.getWidgetsTreePanel().addWidgetDesignerForNode(node);
	                        break;
						case 'rename-plugin-xml':
							var node = item.parentMenu.contextNode;
							node.getOwnerTree().fireEvent("logmessage",node.getOwnerTree(),"rename page");
							node.ownerTree.treeEditor.triggerEdit(node);		
							break;	                        
	                }
	            }
	        }
	})	
	
	/**
	 * Template method
	 * @private
	 */
	,onRender: function() {
		// call parent
		afStudio.plugins.treePanel.superclass.onRender.apply(this, arguments);
		
		this.root.expand();

		// prevent default browser context menu to appear 
		this.el.on({
			contextmenu: {
				fn: function() { return false; },
				stopEvent: true
			}
		});

	} // eo function onRender	
	
	,maskpluginTree : function(message) {
		this.body.mask(message ? message : 'Loading, please Wait...', 'x-mask-loading');
	}
	
	,unmaskpluginTree : function() {
		this.body.unmask();
	}
	
	/**
	 * Reloads plugins tree 
	 * @param {Function} callback The callback to run after reloading
	 */
	,reloadplugins : function(callback) {
		Ext.isFunction(callback) ? this.getRootNode().reload(callback) 
		: this.getRootNode().reload(); 
	}
	
	/**
	 * Selects plugin
	 * @param {Ext.tree.TreeNode} node The plugin's node
	 */
	,selectplugin : function(node) {		
		this.selectPath(node.getPath());
	}
	
	,selectpluginNode : function(node) {
		var _this = this;
		Ext.each(this.getRootNode().childNodes, function(n){
			if (n.text == node.text) {
				_this.getSelectionModel().select(n);
				return false;	
			}
		});		
	}
	
	/**
	 * plugins Tree <u>dbclick</u> event listener
	 * @param {Node} node The plugin dbclicked
	 * @param {Ext.EventObject} e
	 */
	,onpluginDbClick : function(node,  e) {

	}
	
	/**
	 * "Add plugin" button <u>click</u> event listener
	 */
	,onAddNode : function() {
		var _this = this,
			 root = _this.getRootNode(),
			 node = {text: 'Newplugin', leaf: true, NEW_NODE: true};
		
		if (root.hasChildNodes()) {
			Ext.applyIf(node, {
				//iconCls: root.childNodes[0].attributes.iconCls
				iconCls: 'icon-model'
			});						
		}
		
		var newNode = _this.getRootNode().appendChild(new Ext.tree.TreeNode(node));
		_this.selectplugin(newNode);
		_this.treeEditor.triggerEdit(newNode);		
	}
	
	,onBeforeComplete : function(editor, newValue, oldValue) {
		var node = editor.editNode,
			tree = node.getOwnerTree();
				
		//validates module
//		if (!tree.isValidModuleName(newValue)) {			
//			return false;			
//		}
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
	 * <u>complete</u> event listener
	 * @param {Ext.Editor} editor
	 * @param {String} newValue
	 * @param {String} oldValue
	 */
	,onComplete : function(editor, newValue, oldValue) {
//		var _this = this,
//			node = editor.editNode; 
//		
//		if (node.attributes.NEW_NODE) {
//			node.setText(newValue);
//			_this.addplugin(node); 
//		} else {
//			if (newValue != oldValue) {
//				_this.renameplugin(node, newValue, oldValue);
//			}
//		}


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
					case "plugin":
	            		tree.renamePlugin(node,newValue,oldValue);
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
	
	/**
	 * <u>canceledit</u> event listener
	 * look at {@link Ext.tree.TreePanel#canceledit}
	 * @param {Editor} editor
	 * @param {String} value
	 * @param {String} startValue 
	 */
	,onCancelEdit : function (editor, value, startValue) {		
		if (editor.editNode.attributes.NEW_NODE) {
			editor.editNode.remove();
		}
	}
	
    ,getplugin: function(node) {
		var plugin;

		// get path for non-root node
		if (node !== this.root) {
			plugin = node.text;
		}
		// path for root node is it's path attribute
		else {
			plugin = node.attributes.path || '';
		}

		return plugin;
	}
	
	,getSchema: function(node) {
		return node.attributes.schema || '';
	}
	
	/**
	 * Adds plugin - new node to the plugins tree.
	 * @param {Ext.tree.TreeNode} node
	 */
	,addplugin : function(node) {
		var _this = this;
		
		_this.maskpluginTree('Processing request...');
		
		Ext.Ajax.request({
			url: _this.url,
			method: _this.method,			
			node: node,
			params: {
				cmd: 'add',
				plugin: _this.getplugin(node),
				schema: _this.getSchema(node)
			},
			callback: function(opts, success, response) {
				_this.unmaskpluginTree();
				
				var response = Ext.decode(response.responseText);
		      
		        if (response.success && success) {
		        	delete node.attributes.NEW_NODE;
		        	var path = node.getPath();
					_this.reloadplugins(function(){_this.selectpluginNode(node);});
					
		      		if (response.console) {	
			      		var console = afStudio.vp.layout.south.panel.getComponent('console');
			      		console.body.dom.innerHTML += response.console;
						console.body.scroll("bottom", 1000000, true );				      		
			      	}
			      	
                    afStudio.getWidgetsTreePanel().addWidgetDesignerForNode(node);
			      	
			      	_this.fireEvent('plugincreated', node);
			    }
			      
		      	Ext.Msg.show({
				  title: response.success ? 'Success' : 'Failure',
				  msg: response.message,
				  buttons: Ext.Msg.OK,
				  width: 400
		      	});		      	
		    }
		});				
	} //eo addplugin
	
	,renamePlugin:function(node,newValue,oldValue)
	{
		Ext.Msg.show({
			 title:'Rename'
			,msg:this.reallyWantText + ' rename plugin\'s name from <b>' + oldValue + '</b> to <b>' + newValue + '</b>?'
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
					,node:node
					,params:{
						 cmd:'renamePlugin'
						,oldValue:oldValue
						,newValue:newValue
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
						,oldValue:oldValue
						,newValue:newValue
						,pluginName: node.parentNode.text
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
						 cmd:'renameXml'
						,oldValue:oldValue
						,newValue:newValue
						,pluginName: node.parentNode.parentNode.text
						,moduleName: node.parentNode.text
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
	
	,deletePlugin:function(node)
	{
		var _this = this;
		
		var self = this;
		Ext.Msg.show({
			 title:'Delete'
			,msg:this.reallyWantText + ' delete <b>' + node.text + '</b> plugin?'
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
						 cmd:'deletePlugin'
						,pluginName:node.text
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
	
	,deleteModule:function(node)
	{
		var _this = this;
		
		var self = this;
		Ext.Msg.show({
			 title:'Delete'
			,msg:this.reallyWantText + ' delete <b>' + node.text + '</b> module?'
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
						,pluginName:node.parentNode.text
						,moduleName:node.text
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
	
	,deleteXml:function(node)
	{
		var _this = this;
		
		var self = this;
		Ext.Msg.show({
			 title:'Delete'
			,msg:this.reallyWantText + ' delete <b>' + node.text + '</b> page?'
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
						 cmd:'deleteXml'
						,pluginName:node.parentNode.parentNode.text
						,moduleName:node.parentNode.text
						,xmlName:node.text
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
}); 

// register xtype
Ext.reg('afStudio.plugins.treePanel', afStudio.plugins.treePanel);

// eof