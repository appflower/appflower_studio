Ext.ns('afStudio.dbQuery');

/**
 * DBStructureTree
 * 
 * @class afStudio.dbQuery.DBStructureTree
 * @extends Ext.tree.TreePanel
 * @author Nick
 */
afStudio.dbQuery.DBStructureTree = Ext.extend(Ext.tree.TreePanel, {
	
	/**
	 * @cfg {String} structureUrl required (defaults to "/afsDatabaseQuery/databaseList")
	 * This tree loader's URL
	 */
	structureUrl : '/afsDatabaseQuery/databaseList'
	
	/**
	 * Masks tree
	 * @param {String} msg optional
	 */
	,maskTree : function(msg) {		
		this.body.mask(msg ? msg : 'loading...');
	}
	
	/**
	 * Unmasks tree
	 */
	,unmaskTree : function() {
		this.body.unmask();
	}	
	
	/**
	 * The {@link Ext.tree.TreeLoader} <u>beforeload</u> event listener
	 * look at {@link Ext.tree.TreeLoader#beforeload} 
	 */
	,onBeforeLoad : function(loader, node, callback) {
		this.maskTree.defer(10, this, ['loading...']);
	}
	
	/**
	 * The {@link Ext.tree.TreeLoader} <u>load</u> event listener
	 * look at {@link Ext.tree.TreeLoader#load} 
	 */
	,onLoad : function(loader, node, xhr) {
		this.unmaskTree();
	}
	
	/**
	 * <u>click</u> event listener, look at {@link Ext.tree.TreePanel#click} 
	 * @param {Ext.data.Node} node
	 * @param {Ext.EventObject} e
	 */
	,onNodeClick : function(node, e) {		
		this.fireEvent('dbnodeclick', node, e, node.isLeaf() ? 'table' : 'database');
	}	
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var rootNode = new Ext.tree.AsyncTreeNode({
			id: 'database',
			text: 'Databases',
			expanded: true
		});
		
		return {
			layout: 'fit', 
			margins: '0 0 0 5',			
			boxMinWidth: 150,
            animate: true,
            autoScroll: true, 
            containerScroll: true,            
            rootVisible: false,
            root: rootNode,
         	dataUrl: _this.structureUrl   
		}
	}
	
	//private 
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));				
		afStudio.dbQuery.DBStructureTree.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}	
	

	/**
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this,
		   loader = _this.getLoader();
		
		_this.addEvents(
			/**
			 * @event 'dbnodeclick' Fires when node is clicked
			 * @param {Ext.data.node} node The clicked node
			 * @param {Ext.EventObject} e This event object
			 * @param {String} type The node's type - "table"/"database" 
			 */
			'dbnodeclick'
		);
		
		var treeSorter = new Ext.tree.TreeSorter(_this, {
			folderSort: true
		});
		
		//Tree Events
		_this.on({
			click: _this.onNodeClick,
			buffer: 500,
			scope: _this
		});
		
		loader.on({
			beforeload: _this.onBeforeLoad,
			load: _this.onLoad, 
			scope: _this
		});
		
	}//eo _afterInitComponent
	
});

/**
 * @type 'afStudio.dbQuery.dbStructureTree'
 */
Ext.reg('afStudio.dbQuery.dbStructureTree', afStudio.dbQuery.DBStructureTree);