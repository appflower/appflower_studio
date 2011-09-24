/**
 * ModelItem
 * 
 * @class afStudio.navigation.ModelItem
 * @extends afStudio.navigation.BaseItemTreePanel
 * @author Nikolai
 */
afStudio.navigation.ModelItem = Ext.extend(afStudio.navigation.BaseItemTreePanel, {	
	/**
	 * @cfg {String} baseUrl
	 */
	baseUrl : afStudioWSUrls.modelListUrl
	
    /**
     * @cfg {Object} leafNodeCfg
     * Empty model node configuration object.
     */
    ,leafNodeCfg : {
    	text: 'NewModel',
    	iconCls: 'icon-model',    	
    	leaf: true
    }
	
	/**
	 * @property modelContextMenu
	 * "Model" node context menu
	 * @type {Ext.menu.Menu}
	 */
	,modelContextMenu : new Ext.menu.Menu({
        items: [
        {
            itemId: 'edit-model',
            text: 'Edit model',
            iconCls: 'icon-models-edit'
        },{
            itemId: 'rename-model',
            text: 'Rename model',
            iconCls: 'icon-edit'
		},{
       		itemId: 'delete-model',
            text: 'Delete model',
            iconCls: 'icon-models-delete'
		}],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode,
            		tree = node.getOwnerTree();
            	
                switch (item.itemId) {                	
                    case 'delete-model':                    	
                    	tree.deleteNodeModel(node);
                    break;
                    
                    case 'edit-model':
                    	tree.runNode(node);
                    break;
                    
                    case 'rename-model':
                    	tree.treeEditor.triggerEdit(node);	                    	
                    break;
                }
            }
        }
	})//eo modelContextMenu
	
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
			title: 'Models',
		    loader: treeLoader,
			iconCls: 'icon-databases',
			bbar: {
				items: [
				'->',
				{
					text: 'Add Model',
					iconCls: 'icon-models-add',
					handler: _this.onAddModelClick,
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
		afStudio.navigation.ModelItem.superclass.initComponent.apply(this, arguments);
	}//eo initComponent
	
	/**
	 * Adds new model to the tree item.
	 * Add Model button <u>click</u> event listener. 
	 */
	,onAddModelClick : function() {
		var _this = this, 
			rootNode = this.getRootNode();
			
		this.addLeafNode(rootNode);
	}//eo onAddModelClick
	
	/**
	 * Loads a model.
	 * @override
	 *  
	 * @param {Ext.tree.TreeNode} layoutNode
	 */
	,runNode : function(node) {
		var _this  = this,
			 model = this.getNodeAttribute(node, 'text'),
			schema = this.getNodeAttribute(node, 'schema');
			
		this.executeAction({
			url: _this.baseUrl,
			params: {
			   xaction: 'read',
			   model: model,
			   schema: schema
		    },
		    showNoteOnSuccess: false,
		    loadingMessage: String.format('Loading model "{0}"...', model),
		    run: function(response) {
			    var modelTab = new afStudio.models.ModelTab({
				    _node: node,
			   		fieldsStructure: response,
			   		modelName: model,
			   		schemaName: schema
			    });
                afStudio.vp.addToWorkspace(modelTab, true);
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
       	this.runNode(node);
	}//eo onNodeDblClick
	
	/**
	 * @override
	 */
	,onNodeContextMenu : function(node, e) {
        node.select();
        this.modelContextMenu.contextNode = node;
    	this.modelContextMenu.showAt(e.getXY());
	}//eo onNodeContextMenu
	
	/**
	 * @override
	 */
	,addNodeController : function(node) {
		var _this  = this,
			model  = this.getNodeAttribute(node, 'text'),
			schema = this.getNodeAttribute(node, 'schema');

		this.executeAction({
			url: _this.baseUrl,
			params: {
				cmd: 'add',
				model: model,
				schema: schema
		    },
		    loadingMessage: String.format('"{0}" model creation...', model),
		    logMessage: String.format('Models: model "{0}" was created', model),
		    run: function(response) {
		    	this.refreshNode(this.root, model, this.runNode);
		    },
			error: function(response) {
		    	node.remove();
		    }		    
		});
	}//eo addNodeController
	
	/**
	 * @override
	 */
	,renameNodeController : function(node, value, startValue) {
		var _this = this,
			rootNode = this.getRootNode(),
			schema = this.getNodeAttribute(node, 'schema');
 			
		this.executeAction({
			url: _this.baseUrl,
			params: {
				cmd: 'rename',
				model: startValue,
				renamedModel: value,
				schema: schema
		    },
		    loadingMessage: String.format('Renaming model from "{0}" to {1} ...', startValue, value),		    
		    logMessage: String.format('Models: model "{0}" was renamed to "{1}"', startValue, value),		    
		    run: function(response) {
		    	this.refreshNode(rootNode, value, this.runNode);
		    },		    
		    error: function(response) {
		    	node.setText(startValue);
		    }
		});
	}//eo renameNodeController
	
	/**
	 * Deletes model.
	 * @param {Ext.tree.TreeNode} node
	 */
	,deleteNodeModel : function(node) {		
		var _this = this,
			rootNode = this.getRootNode(),
			model  = this.getNodeAttribute(node, 'text'),
			schema = this.getNodeAttribute(node, 'schema'),
			confirmText = String.format('Are you sure you want to delete model "{0}" ?', model);
		
		Ext.Msg.confirm('Models', confirmText, function(buttonId) {
			if (buttonId == 'yes') {
				
				_this.executeAction({
					url: _this.baseUrl,
					params: {
						cmd: 'delete',
						model: model,
						schema: schema
					},
				    loadingMessage: String.format('Model "{0}" deleting ...', model),
				    logMessage: String.format('Models: model "{0}" was deleted', model),
				    run: function(response) {
				    	this.loadRootNode(function() {				    		
				    		afStudio.vp.clearWorkspace();
				    	});
				    }
				});     		
			}
		});
	}//eo deleteModel
}); 

/**
 * @type 'afStudio.navigation.modelItem'
 */
Ext.reg('afStudio.navigation.modelItem', afStudio.navigation.ModelItem);