Ext.ns('afStudio.models');

/**
 * Models TreeEditor
 * @class afStudio.models.treeEditor
 * @extends Ext.tree.TreeEditor
 */
afStudio.models.TreeEditor = Ext.extend(Ext.tree.TreeEditor, {	
	 //prevent dbclick editing
	 beforeNodeClick : function(node, e) {
	 }
});


/**
 * ModelTree
 * @class afStudio.models.ModelTree
 * @extends Ext.tree.TreePanel
 */
afStudio.models.ModelTree = Ext.extend(Ext.tree.TreePanel, {
	
	/**
	 * @cfg {String} ModelTree URL (defaults to "/appFlowerStudio/models") 
	 */
	url: afStudioWSUrls.modelListUrl
	
	/**
	 * Masks ModelTree
	 * @param {String} (optional) message The message to use in the mask
	 */
	,maskModelTree : function(message) {
		this.body.mask(message ? message : 'Loading, please Wait...', 'x-mask-loading');
	}
	
	/**
	 * Unmasks ModelTree
	 */
	,unmaskModelTree : function() {
		this.body.unmask();
	}	
	
	/**
	 * Selects Model's node
	 * @param {Ext.tree.TreeNode} node The Model's node to select
	 */
	,selectModel : function(node) {		
		this.selectPath(node.getPath());
	}
	
	,findModelByName : function(name) {
		return this.getRootNode().findChild('text', name);
	}
	
	/**
	 * Reloads models tree 
	 * @param {Function} callback The callback function to be run after reloading
	 */
	,reloadModels : function(callback) {		
		if (Ext.isFunction(callback)) {
			 this.getRootNode().reload(callback)
		} else {
			this.getRootNode().reload();
		}
	}
	
	/**
	 * Hadles "refresh" tools click
	 * look at {@link Ext.Panel#tools}
	 * @param {Ext.EventObject} e
	 * @param {Ext.Element} toolEl
	 * @param {Ext.Panel} p
	 * @param {Object} tc
	 */
	,refreshModels : function(e, toolEl, p, tc) {
		this.reloadModels();
	}
	
	/**
	 * Returns <u>schema</u> attribute of Model
	 * @param {Ext.tree.TreeNode} node
	 * @return {String} schema
	 */
	,getSchema: function(node) {
		return node.attributes.schema || undefined;
	}
	
    ,getModel: function(node) {
		return node.text;
	}
	
	
	/**
	 * ModelTree <u>click</u> event listener
	 * @param {Ext.tree.TreeNode} node
	 * @param {Ext.EventObject} e
	 */
	,onModelClick : function(node, e) {
	}
	
	/**
	 * ModelTree <u>dbclick</u> event listener
	 * @param {Ext.Node} node The Model dbclicked node
	 * @param {Ext.EventObject} e
	 * @protected
	 */
	,onModelDbClick : Ext.emptyFn
	
	/**
	 * ModelTree's Loader <u>beforeload</u> event listener
	 * look at {@link Ext.tree.TreeLoader#beforeload}
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node
	 * @param {Function} callback
	 */
	,onLoaderBeforeLoad : function(loader, node, callback) {		
		this.maskModelTree();				
	}
	
	/**
	 * ModelTree's Loader <u>load</u> event listener
	 * look at {@link Ext.tree.TreeLoader#load}
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node
	 * @param {XHR} response
	 */
	,onLoaderLoad : function(loader, node, response) {
		this.unmaskModelTree();
		this.fireEvent('modelsload', loader, response);
	}
	
	/**
	 * ModelTree's Loader <u>loadexception</u> event listener
	 * look at {@link Ext.tree.TreeLoader#loadexception}
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node
	 * @param {XHR} response
	 */
	,onLoaderLoadException : function(loader, node, response) {
		this.unmaskModelTree();
	}
	
	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var rootNode = new Ext.tree.AsyncTreeNode({
			path:'root',
			text: 'ModelRoot', 
			draggable: false
		});		

		var modelTools =  [{
			id: 'refresh', 
			handler: Ext.util.Functions.createDelegate(_this.refreshModels, _this)
		}];
		
		var modelLoader = new Ext.tree.TreeLoader({
			url: this.modelsUrl || this.url,
			baseParams: {
				cmd: 'get'
			}
		});	
		
		return {			
			title: 'Models',			
			loader: modelLoader,
			iconCls: 'icon-models',
			autoScroll: true,			
			method: 'post',
		    root: rootNode,
			rootVisible: false,
			tools: modelTools
		};
	}//eo _initCmp

	
	/**
	 * Template method
	 * @private
	 */	
	,initComponent: function() {		
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.models.ModelTree.superclass.initComponent.apply(this, arguments);
		this._initEvents();
	}//eo initComponent
	
	/**
	 * @private
	 */
	,_initEvents : function() {
		var _this = this;
		
		_this.addEvents(
			'modelsload'
		);
		
		//ModelTree events
		_this.on({
			dblclick : Ext.util.Functions.createDelegate(_this.onModelDbClick, _this), 
			
			afterrender : function() {
				
				//Loader events	
				_this.loader.on({
					 beforeload : Ext.util.Functions.createDelegate(_this.onLoaderBeforeLoad, _this),
					 load : Ext.util.Functions.createDelegate(_this.onLoaderLoad, _this),
					 loadexception : Ext.util.Functions.createDelegate(_this.onLoaderLoadException, _this)
				});				
			}
		});		
		
		_this.root.expand();
	}//eo _initEvents
}); 

// register xtype
Ext.reg('afStudio.models.modelTree', afStudio.models.ModelTree);