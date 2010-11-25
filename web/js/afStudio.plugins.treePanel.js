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
	 * plugins context menu
	 */
	contextMenu: new Ext.menu.Menu({
	        items: [
	        {
	       		id: 'delete-plugin',
	            text: 'Delete plugin',
	            iconCls: 'icon-models-delete'
	        },{
	            id: 'edit-plugin',
	            text: 'Edit plugin',
	            iconCls: 'icon-models-edit'
			},{
	            id: 'rename-plugin',
	            text: 'Change plugin name',
	            iconCls: 'icon-models-edit'				
			}],
	        listeners: {
	            itemclick: function(item) {
	                switch (item.id) {
	                    case 'delete-plugin':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().deleteplugin(node);
                        	break;
	                    case 'edit-plugin':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().editplugin(node);
	                        break;
	                    case 'rename-plugin':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().treeEditor.triggerEdit(node);	                    	
	                        break;	                        
	                }
	            }
	        }
	})
	
	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	,_initCmp : function() {
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
			iconCls: 'icon-models',
			autoScroll: true,
			url: '/appFlowerStudio/plugins',			
			method: 'post',
			reallyWantText: 'Do you really want to',
		    root: rootNode,
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
			complete: Ext.util.Functions.createDelegate(_this.onComplete, _this),
			canceledit: Ext.util.Functions.createDelegate(_this.onCancelEdit, _this)			
		});		

		//plugin Tree events
		_this.on({
			//showing context menu for each node
			contextmenu: function(node, e) {
	            node.select();
	            var c = node.getOwnerTree().contextMenu;
	            c.contextNode = node;
	            c.showAt(e.getXY());
	        },
	        dblclick : Ext.util.Functions.createDelegate(_this.onpluginDbClick, _this)
		});
	}
	
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
				iconCls: root.childNodes[0].attributes.iconCls
			});						
		}
		
		var newNode = _this.getRootNode().appendChild(new Ext.tree.TreeNode(node));
		_this.selectplugin(newNode);
		_this.treeEditor.triggerEdit(newNode);		
	}
	
	/**
	 * <u>complete</u> event listener
	 * @param {Ext.Editor} editor
	 * @param {String} newValue
	 * @param {String} oldValue
	 */
	,onComplete : function(editor, newValue, oldValue) {
		var _this = this,
			node = editor.editNode; 
		
		if (node.attributes.NEW_NODE) {
			node.setText(newValue);
			_this.addplugin(node); 
		} else {
			if (newValue != oldValue) {
				_this.renameplugin(node, newValue, oldValue);
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
			      	
			      	_this.editplugin(node);
			      	
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
	
	,deleteplugin: function(node) {
		
		var _this = this;
		
		Ext.Msg.show({
			title: 'Delete',
			msg: this.reallyWantText + ' delete <b>' + this.getplugin(node) + '</b> plugin?',
			icon: Ext.Msg.WARNING,
			buttons: Ext.Msg.YESNO,
			width: 400,			
			fn: function(response) {
				// do nothing if answer is not yes
				if('yes' !== response) {
					_this.getEl().dom.focus();
					return;
				}
				
				_this.maskpluginTree('Processing request...');
				
				Ext.Ajax.request({
					url: _this.url,
					method: _this.method,					
					node: node,
					params: {
						cmd: 'delete',
						plugin: _this.getplugin(node),
						schema: _this.getSchema(node)
					},
					success: function(response, opts) {
					  _this.unmaskpluginTree();
					  
				      var response = Ext.decode(response.responseText);
				      
				      if (response.success) {
				      	  node.remove();
				      	
				      	  _this.fireEvent('plugindeleted');
				      	 
				      	  afStudio.vp.clearPortal();
				      	 
				      	  _this.reloadplugins();
				      	
				      	 if (response.console) {	
				      		var console = afStudio.vp.layout.south.panel.getComponent('console');
				      		console.body.dom.innerHTML += response.console;
							console.body.scroll("bottom", 1000000, true );				      		
				      	 }
				      }
				      
				      Ext.Msg.show({
						 title: response.success ? 'Success' : 'Failure',
						 msg: response.message,
						 buttons: Ext.Msg.OK,
						 width: 400
				      });
				    }
				});				
			}
		});
	}//eo deleteplugin
	
	,renameplugin: function(node, newValue, oldValue) { 
		var _this = this;
		
		Ext.Msg.show({
			title: 'Rename',
			msg: _this.reallyWantText + ' rename plugin\'s phpName from <b>' + oldValue + '</b> to <b>' + newValue + '</b>?',
			icon: Ext.Msg.WARNING,
			buttons: Ext.Msg.YESNO,
			width: 400,			
			fn: function(response) {
				// do nothing if answer is not yes
				if ('yes' !== response) {
					node.setText(oldValue);
					_this.getEl().dom.focus();
					return;
				}

				_this.maskpluginTree('Processing request...');
				
				Ext.Ajax.request({
					url: _this.url,
					method: _this.method,					
					node: node,
					params: {
						cmd: 'rename',
						plugin: oldValue,
						renamedplugin: newValue,
						schema: _this.getSchema(node)
					},
					success: function(response, opts) {
					  _this.unmaskpluginTree();	
					  
				      var response = Ext.decode(response.responseText);
				      
				      if (response.success) {
				      	_this.reloadplugins(function(){_this.selectpluginNode(node);});
				      	
				      	//update plugin's Grids editor 
				      	_this.editplugin(node);
				      	
				      	if (response.console) {
				      		var console = afStudio.vp.layout.south.panel.getComponent('console');
				      		console.body.dom.innerHTML += response.console;
							console.body.scroll( "bottom", 1000000, true );
				      	}
				      } else {
				      	node.setText(oldValue);
				      }
				      
				      Ext.Msg.show({
						title: response.success ? 'Success' : 'Failure',
					    msg: response.message,
						buttons: Ext.Msg.OK,
						width: 400
				      });
				    }
				});				
			}
		});
	}//eo renameplugin
	
	,editplugin: function(node) {
		
		afStudio.vp.mask({region:'center'});
		
		Ext.Ajax.request({
		   scope:this,
		   url: '/appFlowerStudio/plugins',
		   params: { 
			   xaction:'read',
			   plugin: this.getplugin(node),
			   schema: this.getSchema(node)
		   },
		   success: function(result, request) {
			   try {
				   var data = Ext.decode(result.responseText);
			   } catch(e) {
				   var data = {rows:[], totalCount:0}
			   }
			   	var fieldsGrid=new afStudio.plugins.gridFieldsPanel({
			   		'title':'Editing '+this.getplugin(node),
			   		_data:data,
			   		plugin: this.getplugin(node),
					schema: this.getSchema(node)
			   	});		
			   	
				var pluginGrid = new afStudio.model.modelGridPanel({
					title:'pluginGrid '+this.getplugin(node),
					_data:data
				});
				var editTab = new Ext.TabPanel({
					activeTab: 0,
					items:[pluginGrid,fieldsGrid]
				});
				afStudio.vp.addToPortal(editTab, true);
				
		       afStudio.vp.unmask('center');
		   }
		});		
	}	
}); 

// register xtype
Ext.reg('afStudio.plugins.treePanel', afStudio.plugins.treePanel);

// eof
