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
	 * Selects node
	 * @param {Ext.tree.TreeNode} node The node to be selected
	 */
	,selectNode : function(node) {
		this.selectPath(node.getPath());
	}//eo selectNode
    
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var rootNode = new Ext.tree.AsyncTreeNode({
			path:'root',
			text: _this.title || '', 
			draggable: false
		});
		
		return {
		    root: rootNode,
		    rootVisible: false,			
			tools: [{
				id: 'refresh', 
				handler: function() {
					this.loader.load(this.root);
				}, 
				scope: this
			}]
		};
	}//eo _beforeInitComponent
	
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {		
		Ext.apply(this, 
			Ext.applyIf(this.initialConfig, afStudio.navigation.BaseItemTreePanel.prototype._beforeInitComponent.createDelegate(this)())
		);				
		afStudio.navigation.BaseItemTreePanel.superclass.initComponent.apply(this, arguments);
		afStudio.navigation.BaseItemTreePanel.prototype._afterInitComponent.createDelegate(this)();
	}	
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
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
		
		//Tree events
		_this.on({
			contextmenu: _this.onNodeContextMenu,
			dblclick: _this.onNodeDblClick,
			scope: _this
	    });
	}//eo _afterInitComponent
	
	/**
	 * <u>dblclick</u> event listener
	 * @protected
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e The event object
	 */
	,onNodeDblClick : Ext.emptyFn
	
	/**
	 * <u>contextmenu</u> event listener
	 * For moere detailed information look at {@link Ext.tree.TreePanel#contextmenu} 
	 * @protected 
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e The event object 
	 */
	,onNodeContextMenu : Ext.emptyFn
	
});