/**
 * PluginItem
 *  
 * @class afStudio.navigation.PluginItem
 * @extends afStudio.navigation.BaseItemTreePanel
 * @author Nikolai Babinski
 */
afStudio.navigation.PluginItem = Ext.extend(afStudio.navigation.BaseItemTreePanel, {
	
	/**
	 * @cfg {String} baseUrl
	 */
	baseUrl : afStudioWSUrls.pluginListUrl
	
    /**
     * @cfg {Object} branchNodeCfg (defaults to empty object)
     * Default branch node configuration object.
     */
    ,branchNodeCfg : {    
    	text: 'NewPlugin',
    	type: 'plugin',
    	allowChildren: true,
    	iconCls: 'icon-folder',
    	children: []
    }	
	
    /**
	 * @property pluginContextMenu
	 * "Plugin" node type context menu.
	 * @type {Ext.menu.Menu}
     */
	,pluginContextMenu : new Ext.menu.Menu({
		items: [
		{
            itemId: 'add-module',
            text: 'Add Module',
            iconCls: 'icon-models-add'			
		},{
       		itemId: 'rename-plugin',
            text: 'Rename Plugin',
            iconCls: 'icon-edit'
        },{
       		itemId: 'delete-plugin',
            text: 'Delete Plugin',
            iconCls: 'icon-models-delete'
        }],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            	
                switch (item.itemId) {
                	case 'delete-plugin':
                    	tree.deleteNodePlugin(node);
                	break;
                
					case 'rename-plugin':
						tree.treeEditor.triggerEdit(node);						
					break;
					
					case 'add-module':
						tree.addBranchNode(node, {
					 		text: 'NewModule',
    						type: 'module'
					 	});
					break;
                }
            }
        }
	})//eo pluginContextMenu
	
    /**
	 * @property moduleContextMenu
	 * "Module" node type context menu.
	 * @type {Ext.menu.Menu}
     */
	,moduleContextMenu : new Ext.menu.Menu({
        items: [
        {
       		itemId: 'rename-module',
            text: 'Rename Module',
            iconCls: 'icon-edit'
        },{
       		itemId: 'delete-module',
            text: 'Delete Module',
            iconCls: 'icon-models-delete'
        }],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            	
                switch (item.itemId) {
                    case 'delete-module':
                    	tree.deleteNodeModule(node);
                    break;
                    
					case 'rename-module':
						tree.treeEditor.triggerEdit(node);						
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
            itemId: 'edit-plugin-xml',
            text: 'Edit Widget',
            iconCls: 'icon-models-edit'
		},{
            itemId: 'rename-plugin-xml',
            text: 'Rename Widget',
            iconCls: 'icon-edit'
		},{
       		itemId: 'delete-plugin-xml',
            text: 'Delete Widget',
            iconCls: 'icon-models-delete'
        }],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            	
                switch (item.itemId) {
                    case 'delete-plugin-xml':                    	
                    	tree.deleteNodeXml(node);
                    break;
                    
                    case 'edit-plugin-xml':
                    	tree.runNode(node);
                    break;
                    
					case 'rename-plugin-xml':
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
			url: this.baseUrl
		});
		
		return {			
			title: 'Plugins',
		    loader: treeLoader,
			iconCls: 'icon-af-plugin',
			bbar: {
				items: [
				'->',
				{
					text: 'Add Widget',
					iconCls: 'icon-widgets-add',
					handler: _this.onAddWidget,
					scope: _this
				},{
					text: 'Add plugin',
					iconCls: 'icon-plugin-add',
					handler: _this.onAddPluginClick,
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
		afStudio.navigation.PluginItem.superclass.initComponent.apply(this, arguments);
	}//eo initComponent
	
	/**
	 * Adds new plugin to the this tree item.
	 */
	,onAddPluginClick : function() {
		var rootNode = this.getRootNode();
			
		this.addBranchNode(rootNode);
	}//eo onAddPluginClick
	
	/**
	 * Add Widget button handler.
	 */
	,onAddWidget : function() {
		var me = this,
			url = afStudioWSUrls.modelListUrl;
		
		var wb = new afStudio.wd.WidgetsBuilder({
			modelsUrl: url,
			fieldsUrl: url,
			placeType: 'plugin',
			listeners: {
				widgetcreated: function(response) {
					var path = String.format('/{0}/{1}/{2}.xml', me.root.text, response.data.place, response.data.widgetUri);
					 
					me.loadRootNode(function() {
						this.selectPath(path, 'text', function(success, node) {
							if (success) {
								me.showWidgetDesignerForNode(node);
							} else {
								me.initialItemState();
								var cfg = Ext.copyTo({}, response.data, 'actionPath, securityPath, place, placeType');
								cfg.uri = response.data.widgetUri;
								afStudio.WD.showWidgetDesigner(cfg);
							}
						});
					});					
				}
			}
		});
		
		wb.show();
	}//eo onAddWidget
	
	/**
	 * Checks if node's type is valid
	 * @param {String} nodeType The node type <b>'plugin'/'module'/'xml'</b> 
	 * @return {Boolean}
	 */
	,isValidNodeType : function(nodeType) {        
        return ['plugin', 'module', 'xml'].indexOf(nodeType) != -1; 
	}//eo isValidNodeType
	
	/**
	 * @override
	 */
	,isValidNodeName : function(node, name) {
		var nt = this.getNodeAttribute(node, 'type');
		
		if (['plugin', 'module'].indexOf(nt) != -1) {			
			return this.constructor.superclass.isValidNodeName.call(this, node, name);
		} else {
			return /^[^\d]\w*\.xml$/im.test(name) ? true : false;
		}
	}//eo isValidNodeName
	
	/**
	 * @override
	 */
	,runNode : function(node) {		
		this.showWidgetDesignerForNode(node);
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
	 * Adds <b>plugin</b> node.
	 * @param {Ext.tree.TreeNode} node
	 */
	,addNodePlugin : function(node) {
		var _this    = this,
			rootNode = _this.getRootNode(),
 			plugin   = this.getNodeAttribute(node, 'text', '');
		
		this.executeAction({
			url: afStudioWSUrls.pluginAddUrl,
			params: {
				name: plugin
		    },
		    loadingMessage: String.format('"{0}" plugin creation...', plugin),
		    logMessage: String.format('Plugins: plugin "{0}" was created', plugin),
		    run: function(response) {
		    	this.refreshNode(rootNode, plugin);
		    },
			error: function(response) {
		    	node.remove();
		    }		    
		});
	}//eo addNodePlugin

	,addNodeModule : function(node) {
		var _this    = this,
			module   = this.getNodeAttribute(node, 'text'),
 			plugin   = this.getParentNodeAttribute(node, 'text');
		
		this.executeAction({
			url: afStudioWSUrls.moduleAddUrl,
			params: {
        		type: 'plugin',
            	place: plugin,
            	name: module 				
		    },
		    loadingMessage: String.format('"{0}" module creation...', module),
		    logMessage: String.format('Plugins: module "{0}" was created', module),
		    run: function(response) {
		    	this.refreshNode(plugin, module);
		    },
			error: function(response) {
		    	node.remove();
		    }		    
		});		
	}//eo addNodeModule
	
	/**
	 * Renames plugin.
	 * @param {Ext.tree.TreeNode} node The plugin node.
	 * @param {String} value The new plugin name.
	 * @param {String} startValue The old plugin name.
	 */
	,renameNodePlugin : function(node, value, startValue) {
		var renameParams = {
			params: {
				newValue: value,
				oldValue: startValue
			},
			url: afStudioWSUrls.pluginRenameUrl,
			node: node,
			msg: 'plugin'
		};

		this.renameNode(renameParams, value, startValue);
	}//eo renameNodePlugin

	,renameNodeModule : function(node, value, startValue) {
		var renameParams = {
		 	params: {
		 		type: 'plugin',
				place: this.getParentNodeAttribute(node, 'text'),
				name: startValue,
			 	renamed: value
		 	},		 	
			url: afStudioWSUrls.moduleRenameUrl,
			node: node,
		 	refreshNode: this.getParentNodeAttribute(node, 'text'),
		 	msg: 'module'
		};
		
		this.renameNode(renameParams, value, startValue);		
	}//eo renameNodeModule

	,renameNodeXml : function(node, value, startValue) {
		var pluginName = this.getParentNodeAttribute(node.parentNode, 'text'),
			moduleName = this.getParentNodeAttribute(node, 'text');
		
		var renameParams = {
		 	params: {
		 		type: 'plugin',
		 		place: pluginName,
		 		moduleName: moduleName,
				oldValue: startValue,			
			 	newValue: value
		 	},
		 	url: afStudioWSUrls.widgetRenameUrl,
		 	node: node,
		 	refreshNode: pluginName,
		 	msg: 'widget'
		};

		this.renameNode(renameParams, value, startValue);
	}//eo renameNodeXml
	
	,renameNode : function(renameObj, newNodeValue, oldNodeValue) {
		var _this     = this,
			refresh   = renameObj.refreshNode ? renameObj.refreshNode : _this.getRootNode(),
			actionUrl = renameObj.url ? renameObj.url : _this.baseUrl;
			
		this.executeAction({
			url: actionUrl,
			params: renameObj.params,
		    loadingMessage: String.format('Renaming {0} from "{1}" to {2} ...', renameObj.msg, oldNodeValue, newNodeValue),		    
		    logMessage: String.format('Plugins: {0} "{1}" was renamed to "{2}"', renameObj.msg, oldNodeValue, newNodeValue),
		    run: function(response) {
		    	this.refreshNode(refresh, newNodeValue, function() {
		    		this.getRootNode().expandChildNodes();
		    	});
		    },		    
		    error: function(response) {
		    	renameObj.node.setText(oldNodeValue);
		    }
		});
	}//eo renameNode 
		
	,deleteNodePlugin : function(node) {
		var	deleteParams = {
			params: {
				name: node.text
			},
			url: afStudioWSUrls.pluginDeleteUrl,
			item: node.text,
			msg: 'plugin'
		};
		
		this.deleteNode(deleteParams);
	}//eo deleteNodePlugin

	,deleteNodeModule : function(node) {
		var	deleteParams = {
			params : {
            	type: 'plugin',
            	place: node.parentNode.text,
            	name: node.text
			},
			url: afStudioWSUrls.moduleDeleteUrl,
			item: node.text,
			msg: 'module'
		};
		
		this.deleteNode(deleteParams);
	}//eo deleteNodeModule

	,deleteNodeXml : function(node) {
		var pluginName = this.getParentNodeAttribute(node.parentNode, 'text'),
			moduleName = this.getParentNodeAttribute(node, 'text');		
		
		var	deleteParams = {
			params: {
		 		type: 'plugin',
		 		place: pluginName,
		 		moduleName: moduleName,
				name: node.text
			},
			url: afStudioWSUrls.widgetDeleteUrl,
			item: node.text,
			msg: 'widget'
		};
		
		this.deleteNode(deleteParams);
	}//eo deleteNodeXml
	
	,deleteNode : function(deleteObj) {
		var _this       = this,		
		 	confirmText = String.format('Are you sure you want to delete {0} "{1}"?', deleteObj.msg, deleteObj.item),
			actionUrl   = deleteObj.url ? deleteObj.url : _this.baseUrl;
		
		Ext.Msg.confirm('Plugins', confirmText, function(buttonId) {
			if (buttonId == 'yes') {
				_this.executeAction({
					url: actionUrl,
					params: deleteObj.params,
				    loadingMessage: String.format('{0} "{1}" deleting ...', deleteObj.msg, deleteObj.item),
				    logMessage: String.format('Plugins: {0} "{1}" was deleted', deleteObj.msg, deleteObj.item),
				    run: function(response) {
				    	this.loadRootNode(this.initialItemState);
				    	afStudio.vp.clearWorkspace();
				    }
				});     		
			}
		});				
	}//eo deleteNode
	
	/**
	 * Opens Widget Designer for specified node.
	 * @private
	 * @param {Ext.tree.TreeNode} node
	 */
    ,showWidgetDesignerForNode : function(node) {
		var pluginName = this.getParentNodeAttribute(node.parentNode, 'text');
		
        afStudio.WD.showWidgetDesigner({
			uri: this.getNodeAttribute(node, 'widgetUri'),
			actionPath: this.getNodeAttribute(node, 'actionPath'),
			actionName: this.getNodeAttribute(node, 'actionName'),
			securityPath: this.getNodeAttribute(node, 'securityPath'),
			placeType: 'plugin',
			place: pluginName
        });
    }//eo showWidgetDesignerForNode	
});

/**
 * @type afStudio.navigation.pluginItem
 */
Ext.reg('afStudio.navigation.pluginItem', afStudio.navigation.PluginItem);