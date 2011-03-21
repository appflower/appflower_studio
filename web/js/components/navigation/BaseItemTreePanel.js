Ext.ns('afStudio.navigation');

afStudio.navigation.BaseTreeEditor = Ext.extend(Ext.tree.TreeEditor, {	
	 //prevent dbclick editing
	 beforeNodeClick : Ext.emptyFn
});

/**
 * BaseItemTreePanel the base navigation tree item 
 * 
 * @class afStudio.navigation.BaseItemTreePanel
 * @extends Ext.tree.TreePanel
 * @author Nikolai
 */
afStudio.navigation.BaseItemTreePanel = Ext.extend(Ext.tree.TreePanel, {
	
	/**
	 * @cfg {String} baseUrl required
	 */	
	
	/**
	 * @cfg {Boolean} animate (defaults to true)
	 */
    animate : true 

    /**
     * @cfg {Boolean} autoScroll (defaults to true)   
     */
    ,autoScroll : true
	
    /**
     * Returns node's attribute
     * @param {Ext.tree.TreeNode} node required
     * @param {String} attribute required
     * @param {Mixed} defaultValue optional
     * @return attribute / null
     */
    ,getNodeAttribute : function(node, attribute, defaultValue) {
    	return node.attributes[attribute]
    				? node.attributes[attribute] 
    				: (defaultValue ? defaultValue : null);
    }//eo getNodeAttribute
    
    /**
     * Returns parent node attribute of passed in node
     * look at {@link #getNodeAttribute}
     * @return attribute / null 
     */
    ,getParentNodeAttribute : function(node, attribute, defaultValue) {
    	return this.getNodeAttribute(node.parentNode, attribute, defaultValue);
    }
    
    /**
	 * Selects node
	 * @param {Ext.tree.TreeNode} node The node to be selected
	 */
	,selectNode : function(node) {
		this.selectPath(node.getPath());
	}//eo selectNode
	
	/**
	 * Constructor
	 * @param {Object} config
	 */
	,constructor : function(config) {
		var _this = this;
		
		var rootNode = new Ext.tree.AsyncTreeNode({
			path:'root',
			text: _this.title || '', 
			draggable: false
		});
		
		Ext.apply(config, {
			
		    root: rootNode,
		    rootVisible: false,
			tools: [
			{
				id: 'refresh', 
				handler: _this.loadItem, 
				scope: this
			}]			
		});
		
		afStudio.navigation.BaseItemTreePanel.superclass.constructor.call(this, config);
	}//eo constructor
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {
		
		//activate treeEditor
		this.treeEditor = new afStudio.navigation.BaseTreeEditor(this, {
			cancelOnEsc: true,
			completeOnEnter: true,
			ignoreNoChange: true
		});
		
		afStudio.navigation.BaseItemTreePanel.superclass.initComponent.apply(this, arguments);
	}//eo initComponent 
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initEvents : function() {
		afStudio.navigation.BaseItemTreePanel.superclass.initEvents.apply(this, arguments);

		var _this = this;
	 
		//Loader Events
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
			beforecomplete: _this.onEditorBeforeComplete,
			complete: 		_this.onEditorComplete,
			canceledit: 	_this.onEditorCancelEdit,
			scope: _this
		});
		
		//Tree events
		_this.on({
			contextmenu: _this.onNodeContextMenu,			
			dblclick: _this.onNodeDblClick,			
			scope: _this
	    });
	}//eo initEvents	
	
	/**
	 * Abstract method called when tree's item was double clicked.
	 * <u>dblclick</u> event listener
	 * @protected
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e The event object
	 */
	,onNodeDblClick : Ext.emptyFn
	
	/**
	 * Abstract method called when tree's item contextmenu event was fired.
	 * <u>contextmenu</u> event listener
	 * For moere detailed information look at {@link Ext.tree.TreePanel#contextmenu} 
	 * @protected
	 *  
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e The event object 
	 */
	,onNodeContextMenu : Ext.emptyFn
	
	/**
	 * Loads item
	 */
	,loadItem : function() {
		this.loader.load(this.root);		
	}//eo loadItem
	
	,onEditorBeforeComplete : Ext.emptyFn
	
	,onEditorComplete : Ext.emptyFn
	
	,onEditorCancelEdit : Ext.emptyFn	
	
});