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

//		iconCls: 'icon-tree-db',
//	    iconCls: 'icon-tree-table'		
		
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
	
	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.addEvents(
			'dbnodeclick'
		);
		
		var treeSorter = new Ext.tree.TreeSorter(_this, {
			folderSort: true
		});
		
		_this.on({
			'click': Ext.util.Functions.createDelegate(_this.onNodeClick, _this)
		});
		
	}//eo _afterInitComponent
	
});

/**
 * @type 'afStudio.dbQuery.dbStructureTree'
 */
Ext.reg('afStudio.dbQuery.dbStructureTree', afStudio.dbQuery.DBStructureTree);