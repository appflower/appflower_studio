Ext.ns('afStudio.view.inspector');

/**
 * The InspectorTree view, represents the whole model structure.
 * 
 * @class afStudio.view.inspector.TreePanel
 * @extends Ext.tree.TreePanel
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.TreePanel = Ext.extend(Ext.tree.TreePanel, {
	/**
	 * The associated with this tree controller.
	 * @cfg {afStudio.controller.BaseController} (Required) controller
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var root = this.controller.getRootNode(),
			view = this.controller.widget;
		
		this.enableDD = true;
		
		this.root = {
			text: String.format("{0} ({1}-{2})", view.uri, view.place, view.placeType),
			expanded: true,
			modelNode: root
		};
		
		var l = this.loader;
		if (!l) {
			l = new afStudio.view.inspector.InspectorLoader();
		} else if (Ext.isObject(l) && !l.load) {
            l = new afStudio.view.inspector.InspectorLoader(l);
        }
        this.loader = l;
	},
	//eo _beforeInitComponent
	
	/**
	 * Ext Template method
	 * @override
	 * @private
	 */	
	initComponent : function() {
		this._beforeInitComponent();
		afStudio.view.inspector.TreePanel.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	},
	//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	_afterInitComponent : function() {
		var _me = this;
		//activate treeSorter
		this.treeSorter = new afStudio.view.inspector.InspectorSorter(this);		
	},
	//eo _afterInitComponent 
	
	/**
	 * Returns view component by associated with it model.
	 * @public
	 * @interface
	 * @param {afStudio.model.Node} node The model node
	 * @return {Object} node
	 */
	getCmpByModel : function(node) {
		var root = this.getRootNode(),
			cmp;
		
    	cmp = root.findChildBy(function(vNode) {
    		return vNode.modelNode == node; 
    	}, null, true);
    	
    	return cmp;
	},
	//eo getCmpByModel	
	
	/**
	 * Ext Template method
	 * Initializes events.
	 * @private
	 */
	initEvents : function() {
		afStudio.view.inspector.TreePanel.superclass.initEvents.apply(this, arguments);
		
		var _me = this;
		
		_me.on({
			scope: _me,
			
			contextmenu:  _me.onNodeContextMenu,
			nodedragover: _me.onNodeDragOver,
			nodedrop: _me.onNodeDrop,
			/**
			 * @relayed controller
			 */
			modelNodeInsert: _me.onModelNodeInsert, 
			/**
			 * @relayed controller
			 */
			modelNodeAppend: _me.onModelNodeAppend,
			/**
			 * @relayed controller
			 */
			modelNodeRemove: _me.onModelNodeRemove
		});
	},
	//eo initEvents
	
	/**
	 * <u>contextmenu</u> event listener. 
	 * More details {@link Ext.tree.TreePanel#contextmenu}. 
	 * @protected
	 */
	onNodeContextMenu : function(node, e) {
		var menu = node.contextMenu;
		node.select();
		if (menu) {
			menu.contextNode = node;
		    menu.showAt(e.getXY());
		}
	},
	//eo onNodeContextMenu
	
	/**
	 * <u>nodedragover</u> event listener. 
	 * More details {@link Ext.tree.TreePanel#nodedragover}. 
	 */
	onNodeDragOver : function(de) {
		var n = de.dropNode, p = de.point, t = de.target;
		if (p == 'append' || (n.modelNode.tag != t.modelNode.tag)) {
			return false;
		}
	},
	//eo onNodeDragOver
	
	/**
	 * <u>nodedrop</u> event listener.
	 * More details {@link Ext.tree.TreePanel#nodedrop}. 
	 */
	onNodeDrop : function(de) {
		var n = de.dropNode.modelNode, p = de.point, t = de.target.modelNode;
	    if (p == "above") {
	        t.parentNode.insertBefore(n, t);
	    } else if (p == "below") {
	        t.parentNode.insertBefore(n, t.nextSibling);
	    }
	},
	//eo onNodeDrop
	
	/**
	 * Relayed <u>modelNodeAppend</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeAppend}.
	 * @protected
	 * @interface
	 */
	onModelNodeAppend : function(ctr, parent, node, index) {
		console.log('@view [InspectorTree] "modelNodeAppend"', parent, node);
		var viewNode = this.getCmpByModel(parent);
		viewNode.reload(function() {
			this.item(index).select();
		});
	},
	//eo onModelNodeAppend
	
	/**
	 * Relayed <u>modelNodeInsert</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeInsert}.
	 * @protected
	 * @interface
	 */
	onModelNodeInsert : function(ctr, parent, node, refNode) {
		console.log('@view [InspectorTree] "modelNodeInsert"', parent, node, refNode);
		var viewNode = this.getCmpByModel(parent);
		viewNode.reload(function() {
			var viewNode = this.getCmpByModel(node);
			viewNode.select();
		}, this);
	},
	//eo onModelNodeInsert
	
	/**
	 * Relayed <u>modelNodeRemove</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeRemove}.
	 * @protected
	 * @interface
	 */
	onModelNodeRemove : function(ctr, parent, node) {
    	console.log('@view [InspectorTree] "modelNodeRemove"', parent, node);
    	var viewNode = this.getCmpByModel(node);
    	if (viewNode) {
    		viewNode.remove(true);
    	}
	}
	//eo onModelNodeRemove
	
});

afStudio.view.inspector.nodeType = {}

/**
 * @type 'inspector.treePanel'
 */
Ext.reg('inspector.treePanel', afStudio.view.inspector.TreePanel);