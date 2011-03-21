Ext.ns('afStudio.models');

/**
 * Models TreeEditor
 * @class afStudio.models.treeEditor
 * @extends Ext.tree.TreeEditor
 */
afStudio.models.treeEditor = Ext.extend(Ext.tree.TreeEditor, {	
	 //prevent dbclick editing
	 beforeNodeClick : Ext.emptyFn
});


/**
 * Models TreePanel
 * @class afStudio.models.treePanel
 * @extends Ext.tree.TreePanel
 */
afStudio.models.treePanel = Ext.extend(Ext.tree.TreePanel, {
	
	/**
	 * Models context menu
	 */
	contextMenu : new Ext.menu.Menu({
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
	            iconCls: 'icon-edit'				
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
	
	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	,_initCmp : function() {
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
				handler: Ext.util.Functions.createDelegate(_this.onAddNode, _this)
			}]
		}); 
		
		return {			
			title: 'Models',
			iconCls: 'icon-databases',
			autoScroll: true,
			url: window.afStudioWSUrls.getModelsUrl(),
			method: 'post',
			reallyWantText: 'Do you really want to',
		    root: rootNode,
			rootVisible: false,
			tools: [
			{
				id: 'refresh', 
				handler: function() {
					this.loader.load(rootNode);
				}, 
				scope: this
			}],
			bbar: bottomToolBar
		};
	} //eo _initCmp

	
	/**
	 * Template method
	 * @private
	 */	
	,initComponent : function() {		
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
		
		_this.addEvents(
			/**
			 * @event <u>modelcreated</u> Fires after a new model was created 
			 * @param {Ext.tree.TreeNode} node The created Model's node
			 */
			'modelcreated',
			
			/**
			 * @event <u>modeldeleted</u> Fires after a model was deleted
			 */
			'modeldeleted'
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
			canceledit: Ext.util.Functions.createDelegate(_this.onCancelEdit, _this),
			beforecomplete: Ext.util.Functions.createDelegate(_this.onBeforeComplete, _this)
		});		

		//Model Tree events
		_this.on({
			//showing context menu for each node
			contextmenu: function(node, e) {
	            node.select();
	            var c = node.getOwnerTree().contextMenu;
	            c.contextNode = node;
	            c.showAt(e.getXY());
	        },
	        dblclick : Ext.util.Functions.createDelegate(_this.onModelDbClick, _this)
		});
	}
	
	/**
	 * Template method
	 * @private
	 */
	,onRender : function() {
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
	
	,maskModelTree : function(message) {
		this.body.mask(message ? message : 'Loading, please Wait...', 'x-mask-loading');
	}
	
	,unmaskModelTree : function() {
		this.body.unmask();
	}
	
	/**
	 * Validates Model name
	 * @param {String} modelName
	 * @return {Boolean} true if name is valid otherwise false
	 */
	,isValidModelName : function(modelName) {
		return /^[^\d]\w*$/im.test(modelName) ? true : false;
	}
	
	/**
	 * Reloads models tree 
	 * @param {Function} callback The callback to run after reloading
	 */
	,reloadModels : function(callback) {
		Ext.isFunction(callback) ? this.getRootNode().reload(callback) 
		: this.getRootNode().reload(); 
	}
	
	/**
	 * Selects Model
	 * @param {Ext.tree.TreeNode} node The Model's node
	 */
	,selectModel : function(node) {		
		this.selectPath(node.getPath());
	}

	/**
	 * Walks throuth models and selects model by text
	 * @param {Ext.Node} node
	 */	
	,selectModelNode : function(node) {
		var _this = this;
		Ext.each(this.getRootNode().childNodes, function(n){
			if (n.text == node.text) {
				_this.getSelectionModel().select(n);
				return false;	
			}
		});		
	}
	
	/**
	 * Models Tree <u>dbclick</u> event listener
	 * @param {Node} node The Model dbclicked
	 * @param {Ext.EventObject} e
	 */
	,onModelDbClick : function(node,  e) {
		this.editModel(node);
	}
	
	/**
	 * "Add Model" button <u>click</u> event listener
	 */
	,onAddNode : function() {
		var _this = this,
			 root = _this.getRootNode(),
			 node = {text: 'NewModel', leaf: true, NEW_NODE: true};
		
		if (root.hasChildNodes()) {
			Ext.applyIf(node, {
				iconCls: root.childNodes[0].attributes.iconCls
			});
		}
		
		var newNode = _this.getRootNode().appendChild(new Ext.tree.TreeNode(node));
		_this.selectModel(newNode);
		_this.treeEditor.triggerEdit(newNode);		
	}
	
	,onBeforeComplete : function(editor, newValue, oldValue) {
		var _this = this;
		//validates model
		if (!_this.isValidModelName(newValue)) {			
			return false;			
		}
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
			_this.addModel(node);
		} else {
			if (newValue != oldValue) {			
				_this.renameModel(node, newValue, oldValue);
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
	
    ,getModel : function(node) {
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
	
	,getSchema : function(node) {
		return node.attributes.schema || '';
	}
	
	/**
	 * Adds Model - new node to the Models tree.
	 * @param {Ext.tree.TreeNode} node
	 */
	,addModel : function(node) {
		var _this = this;
		
		_this.maskModelTree('Processing request...');
		
		Ext.Ajax.request({
			url: _this.url,
			method: _this.method,			
			node: node,
			params: {
				cmd: 'add',
				model: _this.getModel(node),
				schema: _this.getSchema(node)
			},
			callback: function(opts, success, response) {
				_this.unmaskModelTree();
				
				var response = Ext.decode(response.responseText);
		      
		        if (response.success && success) {
		        	delete node.attributes.NEW_NODE;
		        	var path = node.getPath();
					_this.reloadModels(function(){_this.selectModelNode(node);});
					
		      		if (response.console) {	
			      		var console = afStudio.vp.layout.south.panel.getComponent('console');
			      		console.body.dom.innerHTML += response.console;
						console.body.scroll("bottom", 1000000, true );				      		
			      	}
			      	
			      	_this.editModel(node);
			      	
			      	_this.fireEvent('modelcreated', node);
			    }
			      
		      	Ext.Msg.show({
				  title: response.success ? 'Success' : 'Failure',
				  msg: response.message,
				  buttons: Ext.Msg.OK,
				  width: 400
		      	});		      	
		    }
		});				
	} //eo addModel
	
	,deleteModel : function(node) {
		
		var _this = this;
		
		Ext.Msg.show({
			title: 'Delete',
			msg: this.reallyWantText + ' delete <b>' + this.getModel(node) + '</b> model?',
			icon: Ext.Msg.WARNING,
			buttons: Ext.Msg.YESNO,
			width: 400,			
			fn: function(response) {
				// do nothing if answer is not yes
				if('yes' !== response) {
					_this.getEl().dom.focus();
					return;
				}
				
				_this.maskModelTree('Processing request...');
				
				Ext.Ajax.request({
					url: _this.url,
					method: _this.method,					
					node: node,
					params: {
						cmd: 'delete',
						model: _this.getModel(node),
						schema: _this.getSchema(node)
					},
					success: function(response, opts) {
					  _this.unmaskModelTree();
					  
				      var response = Ext.decode(response.responseText);
				      
				      if (response.success) {
				      	  node.remove();
				      	
				      	  _this.fireEvent('modeldeleted');
				      	  _this.fireEvent("logmessage",_this,"model "+node.text+" deleted");
				      	  afStudio.vp.clearPortal();
				      	 
				      	  _this.reloadModels();
				      	
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
	}//eo deleteModel
	
	,renameModel : function(node, newValue, oldValue) { 
		var _this = this;		
		
		Ext.Msg.show({
			title: 'Rename',
			msg: _this.reallyWantText + ' rename model\'s name from <b>' + oldValue + '</b> to <b>' + newValue + '</b>?',
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

				_this.maskModelTree('Processing request...');
				
				Ext.Ajax.request({
					url: _this.url,
					method: _this.method,					
					node: node,
					params: {
						cmd: 'rename',
						model: oldValue,
						renamedModel: newValue,
						schema: _this.getSchema(node)
					},
					success: function(response, opts) {
					  _this.unmaskModelTree();	
					  
				      var response = Ext.decode(response.responseText);
				      
				      if (response.success) {
				      	_this.reloadModels(function(){_this.selectModelNode(node);});
				      	_this.fireEvent("logmessage",_this,"rename model");
				      	//update Model's Grids editor 
				      	_this.editModel(node);
				      	
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
	}//eo renameModel
		
	,editModel : function(node) {
		var _this = this;
		
		afStudio.vp.mask({region:'center'});
		Ext.Ajax.request({
		   url: window.afStudioWSUrls.getModelsUrl(),
		   params: { 
			   xaction: 'read',
			   model: _this.getModel(node),
			   schema: _this.getSchema(node)
		   },
		   success: function(result, request) {		   	
		       var data = Ext.decode(result.responseText);
		       
			   var modelTab = new afStudio.models.ModelTab({
				    _node:node,
			   		fieldsStructure: data,
			   		modelName: _this.getModel(node),
			   		schemaName: _this.getSchema(node)
			   });
               afStudio.vp.addToPortal(modelTab, true);
				
		       afStudio.vp.unmask('center');
		   }
		});
	}//eo editModel
	
}); 

// register xtype
Ext.reg('afStudio.models.treePanel', afStudio.models.treePanel);