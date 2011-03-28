/**
 * PluginItem
 *  
 * @class afStudio.navigation.PluginItem
 * @extends afStudio.navigation.BaseItemTreePanel
 * @author Nikolai
 */
afStudio.navigation.PluginItem = Ext.extend(afStudio.navigation.BaseItemTreePanel, {
	
	/**
	 * @cfg {String} baseUrl
	 */
	baseUrl : afStudioWSUrls.getPluginsUrl()	
	
    /**
     * @cfg {Object} branchNodeCfg (defaults to empty object)
     * Default branch node configuration object.
     */
    ,branchNodeCfg : {    
    	text: 'NewPlugin',
    	type: 'plugin',
    	allowChildren: true,    	
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
            text: 'Edit Page',
            iconCls: 'icon-models-edit'
		},{
            itemId: 'rename-plugin-xml',
            text: 'Rename Page',
            iconCls: 'icon-edit'
		},{
       		itemId: 'delete-plugin-xml',
            text: 'Delete Page',
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
			url: this.baseUrl,
			baseParams: {
				cmd: 'get'
			}
		});
		
		return {			
			title: 'Plugins',
		    loader: treeLoader,
			iconCls: 'icon-bricks',
			bbar: {
				items: [
				'->',
				{
					text: 'Add plugin',
					iconCls: 'icon-models-add',
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
	
	,onAddPluginClick : function() {
		var _this = this, 
			rootNode = this.getRootNode();
			
		this.addBranchNode(rootNode);
	}//eo onAddPluginClick
	
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
		afStudio.getWidgetsTreePanel().addWidgetDesignerForNode(node);
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
		var _this = this,
			rootNode = _this.getRootNode(),
 			plugin = this.getNodeAttribute(node, 'text', ''),
 			schema = this.getNodeAttribute(node, 'schema', '');
		
		this.executeAction({
			url: _this.baseUrl,
			params: {
				cmd: 'add',
				plugin: plugin,
				schema: schema
		    },
		    loadingMessage: String.format('"{0}" plugin creation...', plugin),
		    logmessage: String.format('Plugins: plugin "{0}" was created', plugin),
		    run: function(response) {
		    	this.refreshNode(rootNode, plugin);
		    }
		});
	}//eo addNodePlugin

	,addNodeModule : function(node) {
		
	}//eo addNodeModule 

	,addNodeXml : function(node) {
		
	}//eo addNodeXml
	
	,renameNodePlugin : function(node, value, startValue) {		
		var renameParams = {
			params: {
				cmd: 'renamePlugin',
				newValue: value,
				oldValue: startValue
			},
			msg: 'plugin'
		};

		this.renameNode(renameParams, value, startValue);
	}//eo renameNodePlugin

	,renameNodeModule : function(node, value, startValue) {
		var renameParams = {
		 	params: {
			 	cmd: 'renameModule',
			 	newValue: value,
				oldValue: startValue,			
				pluginName: this.getParentNodeAttribute(node, 'text')
		 	},
		 	refreshNode: this.getParentNodeAttribute(node, 'text'),
		 	msg: 'module'
		};
		
		this.renameNode(renameParams, value, startValue);		
	}//eo renameNodeModule

	,renameNodeXml : function(node, value, startValue) {
		var renameParams = {
		 	params: {
			 	cmd: 'renameXml',
			 	newValue: value,
				oldValue: startValue,			
				pluginName: this.getParentNodeAttribute(node.parentNode, 'text'),
				moduleName: this.getParentNodeAttribute(node, 'text')
		 	},
		 	refreshNode: this.getParentNodeAttribute(node, 'text'),
		 	msg: 'widget'
		};
		
		this.renameNode(renameParams, value, startValue);
	}//eo renameNodeXml
	
	,renameNode : function(renameObj, newNodeValue, oldNodeValue) {
		var _this = this,
			refresh = renameObj.refreshNode ? renameObj.refreshNode : _this.getRootNode();
			
		this.executeAction({
			url: _this.baseUrl,
			params: renameObj.params,
		    loadingMessage: String.format('Renaming {0} from "{1}" to {2} ...', renameObj.msg, oldNodeValue, newNodeValue),		    
		    logMessage: String.format('Plugins: {0} "{1}" was renamed to "{2}"', renameObj.msg, oldNodeValue, newNodeValue),
		    run: function(response) {
		    	this.refreshNode(refresh, newNodeValue);
		    },		    
		    error: function(response) {
		    	node.setText(oldNodeValue);
		    }
		});
	}//eo renameNode 
		
	,deleteNodePlugin : function(node) {
		var	deleteParams = {
			params : {
				cmd: 'deletePlugin',
				pluginName: node.text
			},
			item: node.text,
			msg: 'plugin'
		};
		
		this.deleteNode(deleteParams);
	}//eo deleteNodePlugin

	,deleteNodeModule : function(node) {
		var	deleteParams = {
			params : {
	 			cmd: 'deleteModule',
				pluginName: node.parentNode.text,
				moduleName: node.text
			},
			item: node.text,
			msg: 'module'
		};
		
		this.deleteNode(deleteParams);
	}//eo deleteNodePlugin

	,deleteNodeXml : function(node) {
		var	deleteParams = {
			params: {
				cmd: 'deleteXml',
				pluginName: node.parentNode.parentNode.text,
				moduleName: node.parentNode.text,
				xmlName: node.text
			},
			item: node.text,
			msg: 'widget'
		};
		
		this.deleteNode(deleteParams);
	}//eo deleteNodePlugin
	
	,deleteNode : function(deleteObj) {
		var _this = this;
		
		var confirmText = String.format('Are you sure you want to delete {0} "{1}"?', deleteObj.msg, deleteObj.item);
		
		Ext.Msg.confirm('Plugins', confirmText, function(buttonId) {
			if (buttonId == 'yes') {
				_this.executeAction({
					url: _this.baseUrl,
					params: deleteObj.params,
				    loadingMessage: String.format('"{0}" {1} deleting ...', deleteObj.msg, deleteObj.item),
				    logMessage: String.format('Plugins: {0} "{1}" was deleted', deleteObj.msg, deleteObj.item),
				    run: function(response) {
				    	this.loadRootNode(function() {
				    		//this.selectChildNodeByText(rootNode, appName).expand();
				    		afStudio.vp.clearPortal();	
				    	});
				    }
				});     		
			}
		});				
	}//eo deleteNode
}); 

/**
 * @type afStudio.navigation.pluginItem
 */
Ext.reg('afStudio.navigation.pluginItem', afStudio.navigation.PluginItem);