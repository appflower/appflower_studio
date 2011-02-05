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
		
		var treeLoader = new Ext.tree.TreeLoader({
			url: _this.baseUrl,
			baseParams: {
				cmd: 'get'
			}
		});
		
		return {
//			reallyWantText: 'Do you really want to',
		    root: rootNode,
		    rootVisible: false,
		    loader: treeLoader,			
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
	}//eo _afterInitComponent	
});