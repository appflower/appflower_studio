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
	 * Ext Template method
	 * @override
	 * @private
	 */	
	initComponent : function() {
		var root = this.controller.getRootNode(),
			view = this.controller.widget;
		
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
		
		afStudio.view.inspector.TreePanel.superclass.initComponent.apply(this, arguments);
		
		//activate treeSorter
		this.treeSorter = new afStudio.view.inspector.InspectorSorter(this);		
		
		this._afterInitComponent();
	},
	//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	_afterInitComponent : function() {
		var _me = this;
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
			/**
			 * @relayed controller
			 */
			modelNodeRemove: _me.onModelNodeRemove,
			/**
			 * @relayed controller
			 */
			modelNodeAppend: _me.onModelNodeAppend
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