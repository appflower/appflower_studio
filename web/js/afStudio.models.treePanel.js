Ext.ns('afStudio.models');

/**
 * Models TreeEditor
 * @class afStudio.models.treeEditor
 * @extends Ext.tree.TreeEditor
 */
afStudio.models.treeEditor = Ext.extend(Ext.tree.TreeEditor, {	
	 //prevent dbclick editing
	 beforeNodeClick : function(node, e) {
	 }
});


/**
 * Models TreePanel
 * @class afStudio.models.treePanel
 * @extends Ext.tree.TreePanel
 */
afStudio.models.treePanel = Ext.extend(Ext.tree.TreePanel, {
	
	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	_initCmp : function() {
		var _this = this;
		
		var rootNode = new Ext.tree.AsyncTreeNode({
			path:'root',
			text: 'ModelRoot', 
			draggable: false
		});
		
		var bottomToolBar = new Ext.Toolbar({
			items: [
			'->',
			{
				text: 'Add Model',
				iconCls: 'icon-models-add',
				handler: function(b, e) {
					
					var root = _this.getRootNode(),
						newNode = {text: 'NewModel'};
					
					if (root.hasChildNodes()) {
						//console.log(root.childNodes[0].attributes);
						
						Ext.applyIf(newNode, root.childNodes[0].attributes);
						delete newNode.id;
					}
					
					var addedNode = _this.getRootNode().appendChild(
						new Ext.tree.TreeNode(newNode)
					);
					var path = addedNode.getPath();
					
					_this.selectPath(path);
					
					_this.treeEditor.triggerEdit(addedNode);
				}
			}]			
		}); 
		
		return {			
			title: 'Models',
			iconCls: 'icon-models',
			autoScroll: true,
			url: '/appFlowerStudio/models',
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
		
		this.treeEditor = new afStudio.models.treeEditor(this, {
			cancelOnEsc: true,
			completeOnEnter: true,
			ignoreNoChange: true
		});		
		
		afStudio.models.treePanel.superclass.initComponent.apply(this, arguments);	
		
		this._initEvents();
	} //eo initComponent
	
	/**
	 * Initializes events
	 * @private
	 */
	,_initEvents : function() {
		var _this = this;			
		
		// setup loading mask if configured
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
		
		//renaming model
		_this.treeEditor.on({
			complete: function(editor, newValue, oldValue) {
				if (newValue != oldValue) {
					editor.editNode.getOwnerTree().renameModel(editor.editNode, newValue, oldValue);
				}
			}			
//			,canceledit : function(editor, newValue, oldValue) {
//				console.log('canceledit', newValue, oldValue);
//			}
//			,beforestartedit : function(editor, boundEl, value) {
//				console.log('beforestartedit');
//			}
//			,startedit : function(boundEl, value) {
//				console.log('startedit', boundEl);
//			}
		});
		
		//showing context menu for each node
		_this.on({
			contextmenu: function(node, e) {
	            node.select();
	            var c = node.getOwnerTree().contextMenu;
	            c.contextNode = node;
	            c.showAt(e.getXY());
	        }
		});
	}
	
	/**
	 * Template method
	 * @private
	 */
	,onRender: function() {
		// call parent
		afStudio.models.treePanel.superclass.onRender.apply(this, arguments);
		
		this.root.expand();

		// prevent default browser context menu to appear 
		this.el.on({
			contextmenu: {
				fn: function() { return false; },
				stopEvent: true
			}
		});

	} // eo function onRender
	
	,contextMenu: new Ext.menu.Menu({
	        items: [
	        {
	       		id: 'delete-model',
	            text: 'Delete model',
	            iconCls: 'icon-models-delete'
	        },{
	            id: 'edit-model',
	            text: 'Edit model',
	            iconCls: 'icon-models-edit'
			},{
	            id: 'rename-model',
	            text: 'Change model name',
	            iconCls: 'icon-models-edit'				
			}],
	        listeners: {
	            itemclick: function(item) {
	                switch (item.id) {
	                    case 'delete-model':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().deleteModel(node);
                        	break;
	                    case 'edit-model':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().editModel(node);
	                        break;
	                    case 'rename-model':
	                    	var node = item.parentMenu.contextNode;
	                    	node.getOwnerTree().treeEditor.triggerEdit(node);	                    	
	                        break;	                        
	                }
	            }
	        }
	})
	
    ,getModel: function(node) {
		var model;

		// get path for non-root node
		if (node !== this.root) {
			model = node.text;
		}
		// path for root node is it's path attribute
		else {
			model = node.attributes.path || '';
		}

		return model;
	}
	
	,getSchema: function(node) {
		return node.attributes.schema || '';
	}
	
	,deleteModel: function(node)
	{
		Ext.Msg.show({
			 title:'Delete'
			,msg:this.reallyWantText + ' delete <b>' + this.getModel(node) + '</b> model?'
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
						 cmd:'delete'
						,model:this.getModel(node)
						,schema:this.getSchema(node)
					},
					success: function(response, opts) {
				      var response = Ext.decode(response.responseText);
				      
				      if(response.success)
				      {
				      	node.remove();
				      	
				      	afStudio.vp.layout.west.items[0].root.reload();
				      	
				      	if(response.console)
				      	{	
				      		var console = afStudio.vp.layout.south.panel.getComponent('console');
				      		console.body.dom.innerHTML += response.console;
							console.body.scroll("bottom", 1000000, true );				      		
				      	}				      	
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
	
	,renameModel: function(node, newValue, oldValue) 
	{
		Ext.Msg.show({
			title:'Rename'
			,msg: this.reallyWantText + ' rename model\'s phpName from <b>' + oldValue + '</b> to <b>' + newValue + '</b>?'
			,icon: Ext.Msg.WARNING
			,buttons: Ext.Msg.YESNO
			,width: 400
			,scope: this
			,fn: function(response) {
				// do nothing if answer is not yes
				if('yes' !== response) {
					node.setText(oldValue);
					this.getEl().dom.focus();
					return;
				}
				// setup request options
				var options = {
					url: this.url
					,method: this.method
					,scope: this
					//,callback:this.cmdCallback
					,node: node
					,params: {
						 cmd:'rename'
						,model:oldValue
						,renamedModel:newValue
						,schema:this.getSchema(node)
					},
					success: function(response, opts) {
				      var response = Ext.decode(response.responseText);
				      
				      if(response.success)
				      {
				      	afStudio.vp.layout.west.items[0].root.reload();
				      	
				      	if(response.console)
				      	{
				      		var console = afStudio.vp.layout.south.panel.getComponent('console');
				      		console.body.dom.innerHTML+=response.console;
							console.body.scroll( "bottom", 1000000, true );
				      	}
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
	
	,editModel: function(node) {
		//afStudio.vp.layout.center.panel.body.mask('Loading, please Wait...', 'x-mask-loading');
		Ext.Ajax.request({
		   scope:this,
		   url: '/appFlowerStudio/models',
		   params: { 
			   xaction:'read',
			   model: this.getModel(node),
			   schema: this.getSchema(node)
		   },
		   success: function(result, request) {
			   var data = Ext.decode(result.responseText);
			   	var fieldsGrid=new afStudio.models.gridFieldsPanel({
			   		'title':'Editing '+this.getModel(node),
			   		_data:data,
			   		model: this.getModel(node),
					schema: this.getSchema(node)
			   	});		
			   	
				var modelGrid = new afStudio.models.modelGridPanel({
					title:'ModelGrid '+this.getModel(node),
					_data:data
				});
				var editTab = new Ext.TabPanel({
					activeTab: 0,
					items:[modelGrid,fieldsGrid]
				});
				afStudio.vp.addToPortal(editTab, true);
		   }
		});		
	}	
}); 

// register xtype
Ext.reg('afStudio.models.treePanel', afStudio.models.treePanel);

// eof
