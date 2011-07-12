Ext.ns('afStudio.view.inspector');

/**
 * The InspectorTree view, represents the whole model.
 * 
 * @class afStudio.view.inspector.TreePanel
 * @extends Ext.tree.TreePanel
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.TreePanel = Ext.extend(Ext.tree.TreePanel, {

	/**
	 * The associated with this tree controller 
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
	},
	//eo initComponent
	
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
			contextmenu:  _me.onNodeContextMenu
		});
	},
	//eo initEvents
	
	/**
	 * <u>contextmenu</u> event listener. More details {@link Ext.tree.TreePanel#contextmenu}. 
	 * @protected
	 */
	onNodeContextMenu : function(node, e) {
		var menu = node.initContextMenu() || node.contextMenu;
		node.select();
		menu.contextNode = node;
	    menu.showAt(e.getXY());
	}
	
});

afStudio.view.inspector.TreePanel.nodeTypes = {};

/**
 * @type 'inspector.treePanel'
 */
Ext.reg('inspector.treePanel', afStudio.view.inspector.TreePanel);