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
	
    ,getModule : function(node) {
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
	
	,getXmlPath : function(node) {
		var path;

		switch (node.attributes.type) {
			case "app": case "module":
        		path = false;
    		break;
        	case "xml":
                path = node.attributes.xmlPath;
    		break;	
        }

		return path;
	}
	
	,getActionPath : function(node) {
		var path;

		switch (node.attributes.type) {
			case "app": case "module":
        		path = false;
    		break;
        	case "xml":
        		path = node.attributes.actionPath;
    		break;
        }

		return path;
	}
	
	,getSecurityPath : function(node) {
		var path;

		switch (node.attributes.type) {
			case "app": case "module":
        		path = false;
    		break;
        	case "xml":
        		path = node.attributes.securityPath;
    		break;
        }

		return path;
	}
	
	,getApp : function(node) {
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
	}//eo getApp
	
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
		this.addBranchNode(node, {app: this.getApp(node)});
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
	
	,onAddWidget : function() {
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
		var wb = new afStudio.wd.WidgetsBuilder({
			modelsUrl: afStudioWSUrls.getModelsUrl(),
			fieldsUrl: afStudioWSUrls.getModelsUrl()
		});
		wb.show()
	}//eo onAddWidget
		
	/**
	 * Adds "module" node type.
	 */
	,addNodeModule : function(node) {
		var _this = this,
			module = this.getModule(node),
			app = this.getApp(node);
		
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
	
	,renameNodeModule : function(node, value, startValue) {
		var renameParams = {
		 	params: {
				cmd: 'renameModule',
				moduleName: startValue,
				renamedModule: value,
				app: this.getApp(node)		
		 	},
		 	refreshNode: this.getApp(node),
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
	
	,deleteNodeModule : function(node) {
		var	deleteParams = {
			params: {
				 cmd: 'deleteModule',
				 moduleName: this.getModule(node),
				 app: this.getApp(node)
			},
			item: node.text,
			msg: 'module'
		};
		
		this.deleteNode(deleteParams);
	}//eo deleteNodeModule

	,deleteNodeXml : function(node) {
		afStudio.Msg.info('Delete "xml" node', 'back-end is not implemented');
	}//eo deleteNodeXml
	
	/**
	 * Basic node delete method.
	 * @param {Object} deleteObj
	 */
	,deleteNode : function(deleteObj) {
		var _this = this;
		
		var confirmText = String.format('Are you sure you want to delete {0} "{1}"?', deleteObj.msg, deleteObj.item);
		
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
        var actionPath = this.getActionPath(node);
        var securityPath = this.getSecurityPath(node);
        var widgetUri = node.attributes.widgetUri;

        this.addWidgetDesigner(widgetUri, actionPath, securityPath);
    }
    
	,addWidgetDesigner : function(widgetUri, actionPath, securityPath) {		
		afStudio.vp.mask({region:'center'});
		
		this.widgetDefinition = new afStudio.wd.WidgetDefinition({
			widgetUri: widgetUri,
			listeners: {
				datafetched: function(rootNode, definition) {			
					afStudio.vp.addToPortal({
						title: 'Widget Designer',
						collapsible: false,
						draggable: false,
						layout: 'fit',
						frame: false,
						items: [
						{
							xtype: 'afStudio.wd.designerTabPanel',
							border: false,
							actionPath: actionPath,
							securityPath: securityPath,
			                widgetUri: widgetUri,
			                rootNodeEl: rootNode
						}]
					}, true);

		            var WI = afStudio.getWidgetInspector();
		            WI.setRootNode(rootNode);

	       			afStudio.vp.unmask('center');
				}
			}
		});
		this.widgetDefinition.fetchAndConfigure();
	}//eo addWidgetDesigner
	
    ,saveWidgetDefinition : function() {
        this.widgetDefinition.save();
    }
}); 

/**
 * @type 'afStudio.navigation.widgetItem'
 */
Ext.reg('afStudio.navigation.widgetItem', afStudio.navigation.WidgetItem);