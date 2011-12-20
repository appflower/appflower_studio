/**
 * LayoutItem 
 * 
 * @class afStudio.navigation.LayoutItem
 * @extends afStudio.navigation.BaseItemTreePanel
 * @author Nikolai Babinski
 */
afStudio.navigation.LayoutItem = Ext.extend(afStudio.navigation.BaseItemTreePanel, {
	
	/**
	 * @cfg {String} baseUrl (defaults to '/appFlowerStudio/layout')
	 */
	baseUrl : '/appFlowerStudio/layout',
	
	/**
	 * @cfg {String} layoutMetaUrl (defaults to '/afsLayoutBuilder/get')
	 */
	layoutMetaUrl : '/afsLayoutBuilder/get',

	/**
	 * @cfg {String} addNewPageUrl (defaults to '/afsLayoutBuilder/new')
	 */
	addNewPageUrl : '/afsLayoutBuilder/new',

	/**
	 * @cfg {String} renamePageUrl (defaults to '/afsLayoutBuilder/rename')
	 */
	renamePageUrl : '/afsLayoutBuilder/rename',

	/**
	 * @cfg {String} deletePageUrl (defaults to '/afsLayoutBuilder/delete')
	 */
	deletePageUrl : '/afsLayoutBuilder/delete',	
	
    /**
     * Text message is shown when node editor's value is invalid. 
     * @cfg {String} editorFieldInvalid
     */
    editorFieldInvalid : 'Page name is invalid! <br /> accepts only alpha-numeric symbols and "_", begins from "_" or alpha.',
	
    /**
     * Default leaf node configuration object.
     * @cfg {Object} leafNodeCfg
     */
    leafNodeCfg : {
    	text: 'NewPage',
    	iconCls: 'icon-layout',
    	type: 'page',    	
    	leaf: true
    },
    
	/**
	 * "Application" node type context menu.
	 * @property appContextMenu
	 * @type {Ext.menu.Menu}  
	 */
	appContextMenu : new Ext.menu.Menu({
        items: [
        {
            itemId: 'app-add-page',
            text: 'Add Layout',
            iconCls: 'icon-models-add'
		}],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            		
            	tree.addLeafNode(node);
            } 
        }
	}),	
	
	/**
	 * "Page" node type context menu
	 * @property pageContextMenu
	 * @type {Ext.menu.Menu}
	 */
	pageContextMenu : new Ext.menu.Menu({		
        items: [
        {
            itemId: 'edit-page',
            text: 'Edit Layout',
            iconCls: 'icon-models-edit'
		},{
            itemId: 'rename-page',
            text: 'Rename Layout',
            iconCls: 'icon-edit'
		},{
       		itemId: 'delete-page',
            text: 'Delete Layout',
            iconCls: 'icon-models-delete'
        },{
       		itemId: 'set_as_homepage',
            text: 'Set Layout as Homepage',
            iconCls: 'icon-models-set_as_homepage'
        }],
        listeners: {
            itemclick: function(item) {            	
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            	
                switch (item.itemId) {
                    case 'edit-page':
                    	tree.runNode(node);
                    break;
                    
                    case 'rename-page':
                    	tree.treeEditor.triggerEdit(node);
                    break;
                    
                    case 'delete-page':
                    	tree.deletePage(node);
                	break;
                	
                	case 'set_as_homepage':
						tree.setPageAsHomepage(node);
					break;
                }
            }
        }
	}),
	//eo pageContextMenu	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var me = this;
		
		var treeLoader = new Ext.tree.TreeLoader({
			url: this.baseUrl,
			baseParams: {
				cmd: 'getList'
			}
		});		
		
		return {			
			title: 'Layouts',
		    loader: treeLoader,
			iconCls: 'icon-layers',
			bbar: {
				items: [
				'->',
				{
					text: 'Add Layout',
					iconCls: 'icon-layout-add',
					scope: me,
					handler: me.onAddPageClick
				}]
			}
		};		
	},
	
	/**
	 * Ext Template method
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.navigation.LayoutItem.superclass.initComponent.apply(this, arguments);
	},
	
	/**
	 * Adds new page to <b>this</b> tree item.
	 * "Add Page" <u>click</u> event listener.
	 */
	onAddPageClick : function() {
		var me = this, 
			rootNode = this.getRootNode(),
			selectedNode = this.getSelectionModel().getSelectedNode();
			
		if (rootNode.hasChildNodes()) {
			
			if (!Ext.isEmpty(selectedNode)) {
				
				if (selectedNode.isLeaf()) {
					this.addLeafNode(selectedNode.parentNode);				
				} else {
					this.addLeafNode(selectedNode);
				}
				
			} else {
				this.addLeafNode(rootNode.firstChild);
			}
		}
	},	
	
	/**
	 * Loads a page associated with the node into Layout Designer.
	 * @override
	 *  
	 * @param {Ext.tree.TreeNode} layoutNode
	 */
	runNode : function(layoutNode) {
		var me = this,
			page = me.getNodeAttribute(layoutNode, 'text'),
			app = me.getParentNodeAttribute(layoutNode, 'text');
		
		afStudio.xhr.executeAction({
		   url: me.layoutMetaUrl,
		   params: {
		       app: app,
		       page: page
		   },
		   mask: String.format('Loading layout "{0}" metadata...', page),
		   showNoteOnSuccess: false,
		   run: function(response) {
			   afStudio.vp.addToWorkspace(
			      new afStudio.layoutDesigner.DesignerPanel({
			       		layoutMeta: response.content,
			       		layoutApp: app,
			       		layoutPage: page				   
			      }), 
			   	  true
			   );			   	
		   }
		});
	},
	
	/**
	 * Fires when a node is double clicked.
	 * @override
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e
	 */
	onNodeDblClick : function(node, e) {
        if (this.getNodeAttribute(node, 'type') == 'page') {
        	this.runNode(node);        	
        }
	},
	
	/**
	 * Fires when a node is right clicked.
	 * @override
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e
	 */
	onNodeContextMenu : function(node, e) {		
		var me = this,
			menu;
		
        node.select();
        
        switch (node.attributes.type) {
        	case 'app' :
        		menu = me.appContextMenu;
        	break;
        	
        	case 'page' :
        		menu = me.pageContextMenu;
        	break;
        }
        
	    if (menu) {
    		menu.contextNode = node;
        	menu.showAt(e.getXY());
		}
	},
	
	/**
	 * @override
	 * @private
	 */
	addNodeController : function(node) {
		var me = this,
 			appName = this.getParentNodeAttribute(node, 'text'),
 			page = this.getNodeAttribute(node, 'text');

		this.executeAction({
			url: me.addNewPageUrl,
			params: {
	            app: appName,
	            page: page
		    },
		    loadingMessage: String.format('"{0}" page creation...', page),
		    logMessage: String.format('Layout "{0}" was created', page),
		    run: function(response) {
		    	this.refreshNode(appName, page, this.runNode);
		    },
		    error: function(response) {
		    	node.remove();
		    }
		});
	},
	
	/**
	 * @override
	 * @private
	 */
	renameNodeController : function(node, value, startValue) {
		var me = this,
 			appName = this.getParentNodeAttribute(node, 'text');
 			
		this.executeAction({
			url: me.renamePageUrl,
			params: {
	            app: appName,
	            page: startValue,
	            name: value
		    },
		    loadingMessage: String.format('Renaming page from "{0}" to {1} ...', startValue, value),		    
		    logMessage: String.format('Layout "{0}" was renamed to "{1}"', startValue, value),		    
		    run: function(response) {
		    	this.refreshNode(appName, value, this.runNode);
		    },		    
		    error: function(response) {
		    	node.setText(startValue);
		    }
		});
	},
	
	/**
	 * Deletes page.
	 * @param {Ext.tree.TreeNode} node The page associated to this node being deleted
	 */
	deletePage : function(node) {		
		var me = this,
			rootNode = this.getRootNode(),
			appName = this.getParentNodeAttribute(node, 'text'),
			pageName = this.getNodeAttribute(node, 'text'),
			confirmText = String.format('Are you sure you want to delete page "{0}"?', pageName);
		
		Ext.Msg.confirm('Layout Designer', confirmText, function(buttonId) {
			if (buttonId == 'yes') {
				me.executeAction({
					url: me.deletePageUrl,
					params: {
			            app: appName,
			            page: pageName
				    },
				    loadingMessage: String.format('"{0}" page deleting ...', pageName),
				    logMessage: String.format('Layout "{0}" was deleted', pageName),
				    run: function(response) {
				    	this.loadRootNode(function() {
				    		this.selectChildNodeByText(rootNode, appName).expand();
				    		afStudio.vp.clearWorkspace();	
				    	});
				    }
				});     		
			}
		});		
	},
	
	/**
	 * Sets specified node as a homepage.
	 * @private
	 * @param {Ext.tree.TreeNode} node
	 */
    setPageAsHomepage : function(node) {
		var actionUrl = afStudioWSUrls.pageSetAsHomepage,
			widgetUri = this.getNodeAttribute(node, 'widgetUri');
		
		this.executeAction({
            url: actionUrl,
            params: {widgetUri: widgetUri},
            loadingMessage: String.format('Set {0} as homepage...', widgetUri),
            logMessage: String.format('Layout "{0}" was set as homepage.', widgetUri)
        });     		
	}
});

/**
 * @type 'afStudio.navigation.layoutItem'
 */
Ext.reg('afStudio.navigation.layoutItem', afStudio.navigation.LayoutItem);