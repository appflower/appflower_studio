/**
 * WidgetItem
 *  
 * @class afStudio.navigation.WidgetItem
 * @extends afStudio.navigation.BaseItemTreePanel
 */
afStudio.navigation.WidgetItem = Ext.extend(afStudio.navigation.BaseItemTreePanel, {
	
	/**
	 * @cfg {String} baseUrl
	 */
	baseUrl : afStudioWSUrls.getModulesUrl()	
	
    /**
     * @cfg {Object} branchNodeCfg (defaults to empty object)
     * Default branch node configuration object.
     */
    ,branchNodeCfg : {
    	text: 'NewModule',
    	type: 'module',
    	allowChildren: true,
    	iconCls: 'icon-folder',
    	children: []
    }
	
    /**
	 * @property appContextMenu
	 * "Application" node type context menu.
	 * @type {Ext.menu.Menu}
     */
	,appContextMenu : new Ext.menu.Menu({
        items: [
        {
       		itemId: 'add-module',
            text: 'Add module',
            iconCls: 'icon-models-add'
        }],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            	
                switch (item.itemId) {
                    case 'add-module':
                    	tree.onAddModule(node);
                    break;
                }
            }
        }
	})//eo appContextMenu
	
    /**
	 * @property moduleContextMenu
	 * "Module" node type context menu.
	 * @type {Ext.menu.Menu}
     */
	,moduleContextMenu : new Ext.menu.Menu({
        items: [
        {
       		itemId: 'rename-module',
            text: 'Rename module',
            iconCls: 'icon-edit'
        },{
       		itemId: 'delete-module',
            text: 'Delete module',
            iconCls: 'icon-models-delete'
        }],
        listeners: {
            itemclick: function(item) {            	
        		var node = item.parentMenu.contextNode,
        			tree = node.getOwnerTree();

                switch (item.itemId) {
                	case 'rename-module':
                		tree.treeEditor.triggerEdit(node);
                	break;
                    case 'delete-module':
                    	tree.deleteNodeModule(node);
                    break;
                }
            }
        }
	})//eo moduleContextMenu

    /**
	 * @property xmlContextMenu
	 * "Xml" node type context menu.
	 * @type {Ext.menu.Menu}
     */
	,xmlContextMenu : new Ext.menu.Menu({
        items: [
        {
            itemId: 'edit-xml',
            text: 'Edit Widget',
            iconCls: 'icon-models-edit'
		},{
            itemId: 'rename-xml',
            text: 'Rename Widget',
            iconCls: 'icon-edit'
		},{
       		itemId: 'delete-xml',
            text: 'Delete Widget',
            iconCls: 'icon-models-delete'
        }],
        listeners: {
            itemclick: function(item) {
        		var node = item.parentMenu.contextNode,
        			tree = node.getOwnerTree();
            	
                switch (item.itemId) {
                    case 'delete-xml':
                    	tree.deleteNodeXml(node);
                    break;                    
                    case 'edit-xml':
                    	tree.runNode(node);
                    break;                    
					case 'rename-xml':
						tree.treeEditor.triggerEdit(node);
					break;	                        
                }
            }
        }
	})//eo xmlContextMenu
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var treeLoader = new Ext.tree.TreeLoader({
			url: this.baseUrl,
			baseParams: {
				cmd: 'get'
			}
		});
		
		return {			
			title: 'Widgets',
		    loader: treeLoader,
			iconCls: 'icon-models',
			bbar: {
				items: [
				'->',
				{
					text: 'Add Widget',
					iconCls: 'icon-widgets-add',
					handler: _this.onAddWidget,
					scope: _this
				},'-',{
					text: 'Add Module',
					iconCls: 'icon-models-add',
					handler: _this.onAddModule,
					scope: _this
				}]
			}
		};		
	}//eo _beforeInitComponent
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.navigation.WidgetItem.superclass.initComponent.apply(this, arguments);
	}//eo initComponent
	
	/**
	 * Returns module name for the node.
	 * @param {Ext.tree.TreePanel} node
	 * @return {String} application name
	 */
    ,getNodeModule : function(node) {
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
	}//eo getNodeModule
	
	/**
	 * Returns application name for the node.
	 * @param {Ext.tree.TreePanel} node
	 * @return {String} application name
	 */
	,getNodeApp : function(node) {
		var nodeType = this.getNodeAttribute(node, 'type'),
			app;

		switch (nodeType) {
			case "app":
        		app = this.getNodeAttribute(node, 'text');
        	break;
        	case "module": case "xml":
        		app = this.getNodeAttribute(node, 'app');
        	break;
        }

		return app;
	}//eo getNodeApp
	
	,getNodeActionPath : function(node) {
		return this.getNodeAttribute(node, 'actionPath');
	}
	
	,getNodeSecurityPath : function(node) {
		return this.getNodeAttribute(node, 'securityPath');
	}
	
	/**
	 * Handles {@link #appContextMenu} menu's <b>itemclick</b> event listener and 
	 * button's "Add Module" <b>click</b> event listener.
	 */
	,onAddModule : function(node) {
		this.appContextMenu
		var root = this.getRootNode();
		
		if (!node.ownerTree) {
			//if node is selected search it's node app
			node = this.getSelectionModel().getSelectedNode();
						
			//if no node is selected the select first child of root
			if (!node) {				
				node = root.firstChild;
			} else {
				if (node.attributes.type != 'app') {	
					node = root.findChild('text', node.attributes.app);
				}
			}
		}
		this.addBranchNode(node, {app: this.getNodeApp(node)});
	}//eo onAddModule
		
	/**
	 * Checks if node's type is valid
	 * @param {String} nodeType The node type <b>'app'/'module'/'xml'</b> 
	 * @return {Boolean}
	 */
	,isValidNodeType : function(nodeType) {        
        return ['app', 'module', 'xml'].indexOf(nodeType) != -1; 
	}//eo isValidNodeType
	
	/**
	 * @override
	 */
	,isValidNodeName : function(node, name) {
		var nt = this.getNodeAttribute(node, 'type');
		
		if (['app', 'module'].indexOf(nt) != -1) {			
			return this.constructor.superclass.isValidNodeName.call(this, node, name);
		} else {
			return /^[^\d]\w*\.xml$/im.test(name) ? true : false;
		}		
	}//eo isValidNodeName
	
	/**
	 * @override
	 */
	,runNode : function(node) {
		this.addWidgetDesignerForNode(node);		
	}//eo runNode
	
	/**
	 * Fires when a node is double clicked.
	 * @override
	 * 
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e
	 */
	,onNodeDblClick : function(node, e) {
        if (this.getNodeAttribute(node, 'type') == 'xml') {
        	this.runNode(node);
        }
	}//eo onNodeDblClick	
	
	/**
	 * Fires when a node is right clicked.
	 * @override
	 * 
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e
	 */
	,onNodeContextMenu : function(node, e) {
		var _this = this,
			nt = this.getNodeAttribute(node, 'type');
			
        node.select();
        
        if (_this.isValidNodeType(nt)) {
        	var menu = _this[nt + 'ContextMenu'];
    		menu.contextNode = node;
        	menu.showAt(e.getXY());
        }
	}//eo onNodeContextMenu
	
	/**
	 * @override
	 */
	,addNodeController : function(node) {
		var _this = this,
			nt = this.getNodeAttribute(node, 'type');

        if (_this.isValidNodeType(nt)) {
        	_this['addNode' + nt.ucfirst()](node);
        }			
	}//eo addNodeController
	
	/**
	 * @override
	 */
	,renameNodeController : function(node, value, startValue) {			
		var _this = this,
			nt = this.getNodeAttribute(node, 'type');

        if (_this.isValidNodeType(nt)) {
        	_this['renameNode' + nt.ucfirst()](node, value, startValue);
        }	
	}//eo renameNodeController
	
	/**
	 * Add Widget button handler.
	 */
	,onAddWidget : function() {
		var _this = this;
		
		var wb = new afStudio.wd.WidgetsBuilder({
			modelsUrl: afStudioWSUrls.getModelsUrl(),
			fieldsUrl: afStudioWSUrls.getModelsUrl(),
			listeners: {
				widgetcreated: function(widgetUri, response) {
					_this.onItemActivate();					
					//TODO action and security path needed
					afStudio.showWidgetDesigner(widgetUri);
				}
			}
		});
		
		wb.show();
	}//eo onAddWidget
	
	/**
	 * Adds module.
	 * @param {Ext.tree.TreeNode} node The node being added
	 */
	,addNodeModule : function(node) {
		var _this = this,
			module = this.getNodeModule(node),
			app = this.getNodeApp(node);
		
		this.executeAction({
			url: _this.baseUrl,
			params: {
				cmd: 'addModule',
				moduleName: module,
				app: app
		    },
		    loadingMessage: String.format('"{0}" module creation...', module),
		    logMessage: String.format('Widgets: module "{0}" was created', module),
		    run: function(response) {
		    	this.refreshNode(app, module);
		    },
			error: function(response) {
		    	node.remove();
		    }
		});
	}//eo addNodeModule
	
	/**
	 * Renames module.
	 * @param {Ext.tree.TreeNode} node The node being renamed
	 * @param {String} value The new node's value
	 * @param {String} startValue The old node's value
	 */
	,renameNodeModule : function(node, value, startValue) {
		var renameParams = {
		 	params: {
				cmd: 'renameModule',
				moduleName: startValue,
				renamedModule: value,
				app: this.getNodeApp(node)		
		 	},
		 	refreshNode: this.getNodeApp(node),
		 	msg: 'module'
		};
		
		this.renameNode(renameParams, value, startValue);			
	}//eo renameNodeXml
	
	/**
	 * Renames <b>xml</b> nodes.
	 */
	,renameNodeXml : function(node, value, startValue) {
		afStudio.Msg.info('Renaming "xml" node', 'back-end is not implemented');
	}//eo renameNodeXml
	
	/**
	 * Basic method executes node rename action.
	 * @param {Object} renameObj
	 * @param {String} newNodeValue
	 * @param {String} oldNodeValue
	 */
	,renameNode : function(renameObj, newNodeValue, oldNodeValue) {
		var _this = this,
			refresh = renameObj.refreshNode ? renameObj.refreshNode : this.getRootNode();
			
		this.executeAction({
			url: _this.baseUrl,
			params: renameObj.params,
		    loadingMessage: String.format('Renaming {0} from "{1}" to {2} ...', renameObj.msg, oldNodeValue, newNodeValue),		    
		    logMessage: String.format('Widgets: {0} "{1}" was renamed to "{2}"', renameObj.msg, oldNodeValue, newNodeValue),
		    run: function(response) {
		    	this.refreshNode(refresh, newNodeValue);
		    },		    
		    error: function(response) {
		    	node.setText(oldNodeValue);
		    }
		});
	}//eo renameNode 	
	
	/**
	 * Deletes module.
	 * @param {Ext.tree.TreeNode} node
	 */
	,deleteNodeModule : function(node) {
		var	deleteParams = {
			params: {
				 cmd: 'deleteModule',
				 moduleName: this.getNodeModule(node),
				 app: this.getNodeApp(node)
			},
			item: node.text,
			msg: 'module'
		};
		
		this.deleteNode(deleteParams);
	}//eo deleteNodeModule

	/**
	 * Deletes widget.
	 * @param {Ext.tree.TreeNode} node
	 */
	,deleteNodeXml : function(node) {
		afStudio.Msg.info('Delete "xml" node', 'back-end is not implemented');
	}//eo deleteNodeXml
	
	/**
	 * Basic method executes node delete action.
	 * @param {Object} deleteObj
	 */
	,deleteNode : function(deleteObj) {
		var _this = this,		
			confirmText = String.format('Are you sure you want to delete {0} "{1}"?', deleteObj.msg, deleteObj.item);
		
		Ext.Msg.confirm('Plugins', confirmText, function(buttonId) {
			if (buttonId == 'yes') {
				_this.executeAction({
					url: _this.baseUrl,
					params: deleteObj.params,
				    loadingMessage: String.format('{0} "{1}" deleting ...', deleteObj.msg, deleteObj.item),
				    logMessage: String.format('Widgets: {0} "{1}" was deleted', deleteObj.msg, deleteObj.item),
				    run: function(response) {
				    	this.loadRootNode(function() {
				    		afStudio.vp.clearPortal();	
				    	});
				    }
				});     		
			}
		});				
	}//eo deleteNode

    ,addWidgetDesignerForNode : function(node) {
        var actionPath = this.getNodeActionPath(node),
        	securityPath = this.getNodeSecurityPath(node),
        	widgetUri = node.attributes.widgetUri;
	
        this.addWidgetDesigner(widgetUri, actionPath, securityPath);
    }
    
	,addWidgetDesigner : function(widgetUri, actionPath, securityPath) {		
		afStudio.vp.addToPortal({
			xtype: 'afStudio.wd.widgetPanel',
			actionPath: actionPath,
			securityPath: securityPath,
	        widgetUri: widgetUri
		}, true);		
	}//eo addWidgetDesigner	
 
}); 

/**
 * @type 'afStudio.navigation.widgetItem'
 */
Ext.reg('afStudio.navigation.widgetItem', afStudio.navigation.WidgetItem);