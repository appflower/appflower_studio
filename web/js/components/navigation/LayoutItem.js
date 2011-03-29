/**
 * LayoutItem 
 * 
 * @class afStudio.navigation.LayoutItem
 * @extends afStudio.navigation.BaseItemTreePanel
 * @author Nikolai
 */
afStudio.navigation.LayoutItem = Ext.extend(afStudio.navigation.BaseItemTreePanel, {
	
	/**
	 * @cfg {String} baseUrl (defaults to '/appFlowerStudio/layout')
	 */
	baseUrl : '/appFlowerStudio/layout'
	
	/**
	 * @cfg {String} layoutMetaUrl (defaults to '/afsLayoutBuilder/get')
	 */
	,layoutMetaUrl : '/afsLayoutBuilder/get'

	/**
	 * @cfg {String} addNewPageUrl (defaults to '/afsLayoutBuilder/new')
	 */
	,addNewPageUrl : '/afsLayoutBuilder/new'

	/**
	 * @cfg {String} renamePageUrl (defaults to '/afsLayoutBuilder/rename')
	 */
	,renamePageUrl : '/afsLayoutBuilder/rename'

	/**
	 * @cfg {String} deletePageUrl (defaults to '/afsLayoutBuilder/delete')
	 */
	,deletePageUrl : '/afsLayoutBuilder/delete'	
	
    /**
     * @cfg {String} editorFieldInvalid
     * Text message is shown when node editor's value is invalid. 
     */
    ,editorFieldInvalid : 'Page name is invalid! <br /> accepts only alphanumeric symbols and "_", begins from "_" or alpha and ends with <b>.xml</b>.'
	
    /**
     * @cfg {Object} leafNodeCfg
     * Default leaf node configuration object.
     */
    ,leafNodeCfg : {
    	text: 'newPage.xml',
    	iconCls: 'icon-layout',
    	type: 'page',    	
    	leaf: true
    }
    
	/**
	 * @property appContextMenu
	 * "Application" node type context menu.
	 * @type {Ext.menu.Menu}  
	 */
	,appContextMenu : new Ext.menu.Menu({
        items: [
        {
            itemId: 'app-add-page',
            text: 'Add Page',
            iconCls: 'icon-models-add'
		}],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            		
            	tree.addLeafNode(node);
            }//eo itemclick 
        }
	})//eo appContextMenu	
	
	/**
	 * @property pageContextMenu
	 * "Page" node type context menu
	 * @type {Ext.menu.Menu}
	 */
	,pageContextMenu : new Ext.menu.Menu({		
        items: [
        {
            itemId: 'edit-page',
            text: 'Edit Page',
            iconCls: 'icon-models-edit'
		},{
            itemId: 'rename-page',
            text: 'Rename Page',
            iconCls: 'icon-edit'
		},{
       		itemId: 'delete-page',
            text: 'Delete Page',
            iconCls: 'icon-models-delete'
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
                }
            }
        }
	})//eo pageContextMenu	
	
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
				cmd: 'getList'
			}
		});		
		
		return {			
			title: 'Layout',
		    loader: treeLoader,
			iconCls: 'icon-layout_content',
			bbar: {
				items: [
				'->',
				{
					text: 'Add Page',
					iconCls: 'icon-pages-add',
					handler: _this.onAddPageClick,
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
		afStudio.navigation.LayoutItem.superclass.initComponent.apply(this, arguments);
	}//eo initComponent
	
	/**
	 * Loads a page associated with the node into Layout Designer.
	 * @override
	 *  
	 * @param {Ext.tree.TreeNode} layoutNode
	 */
	,runNode : function(layoutNode) {
		var _this = this,
			 page = _this.getNodeAttribute(layoutNode, 'text'),
			  app = _this.getParentNodeAttribute(layoutNode, 'text');
		
		afStudio.vp.mask(String.format('Loading {0} page metadata...', page));
		
		Ext.Ajax.request({
		   url: _this.layoutMetaUrl,
		   params: {
		       app: app,
		       page: page
		   },
		   success: function(xhr, opt) {		   
			   afStudio.vp.unmask();
			   var response = Ext.decode(xhr.responseText);
			   if (response.success) {
				   afStudio.vp.addToPortal(
				      new afStudio.layoutDesigner.DesignerPanel({
				       		layoutMeta: response.content,
				       		layoutApp: app,
				       		layoutPage: page				   
				      }), 
				   	  true
				   );			   	
			   } else {
			   	   Ext.Msg.alert('Error', response.content);
			   }
		   },
		   failure: function(xhr, opt) {
		   	   afStudio.vp.unmask();
		       Ext.Msg.alert('Error', String.format('Status code {0}, message {1}', xhr.status, xhr.statusText));
		   }
		});
	}//eo runNode
	
	/**
	 * Fires when a node is double clicked.
	 * @override
	 * 
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e
	 */
	,onNodeDblClick : function(node, e) {
        if (this.getNodeAttribute(node, 'type') == 'page') {
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
			 menu;
		
        node.select();
        
        switch (node.attributes.type) {
        	case 'app' :
        		menu = _this.appContextMenu;
        	break;
        	
        	case 'page' :
        		menu = _this.pageContextMenu;
        	break;
        }
        
	    if (menu) {
    		menu.contextNode = node;
        	menu.showAt(e.getXY());
		}
	}//eo onNodeContextMenu
	
	/**
	 * @override 
	 */
	,isValidNodeName : function(node, name) {
		return /^[^\d]\w*\.xml$/im.test(name) ? true : false;
	}//eo isValidNodeName
	
	/**
	 * @override
	 */
	,addNodeController : function(node) {
		var _this = this,
 			appName = this.getParentNodeAttribute(node, 'text'),
 			page = this.getNodeAttribute(node, 'text'),
 			pageTitle = page.substring(0, page.lastIndexOf('.xml'));

		this.executeAction({
			url: _this.addNewPageUrl,
			params: {
	            app: appName,
	            page: page,
	            title: pageTitle
		    },
		    loadingMessage: String.format('"{0}" page creation...', page),
		    logMessage: String.format('Layout Designer: page "{0}"  was created', page),
		    run: function(response) {
		    	this.refreshNode(appName, page, this.runNode);
		    }
		});
	}//eo addNodeController
	
	/**
	 * @override
	 */
	,renameNodeController : function(node, value, startValue) {
		var _this = this,
 			appName = this.getParentNodeAttribute(node, 'text');
 			
		this.executeAction({
			url: _this.renamePageUrl,
			params: {
	            app: appName,
	            page: startValue,
	            name: value
		    },
		    loadingMessage: String.format('Renaming page from "{0}" to {1} ...', startValue, value),		    
		    logMessage: String.format('Layout Designer: page "{0}" was renamed to "{1}"', startValue, value),		    
		    run: function(response) {
		    	this.refreshNode(appName, value, this.runNode);
		    },		    
		    error: function(response) {
		    	node.setText(startValue);
		    }
		});
	}//eo renameNodeController
	
	/**
	 * Deletes page.
	 * @param {Ext.tree.TreeNode} node The page associated to this node being deleted
	 */
	,deletePage : function(node) {		
		var _this = this,
			rootNode = this.getRootNode(),
			appName = this.getParentNodeAttribute(node, 'text'),
			pageName = this.getNodeAttribute(node, 'text'),
			confirmText = String.format('Are you sure you want to delete page "{0}"?', pageName);
		
		Ext.Msg.confirm('Layout Designer', confirmText, function(buttonId) {
			if (buttonId == 'yes') {
				_this.executeAction({
					url: _this.deletePageUrl,
					params: {
			            app: appName,
			            page: pageName
				    },
				    loadingMessage: String.format('"{0}" page deleting ...', pageName),
				    logMessage: String.format('Layout Designer: page "{0}" was deleted', pageName),
				    run: function(response) {				    	
				    	this.loadRootNode(function() {
				    		this.selectChildNodeByText(rootNode, appName).expand();
				    		afStudio.vp.clearPortal();	
				    	});
				    }
				});     		
			}
		});		
	}//eo deletePage
	
	/**
	 * Adds new page to an application.
	 */
	,onAddPageClick : function() {
		var _this = this, 
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
	}//eo addPage 
});

/**
 * @type 'afStudio.navigation.layoutItem'
 */
Ext.reg('afStudio.navigation.layoutItem', afStudio.navigation.LayoutItem);