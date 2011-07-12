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
	 * @override
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
	}
	//eo initComponent
	
});

afStudio.view.inspector.TreePanel.nodeTypes = {};

/**
 * @type 'inspector.treePanel'
 */
Ext.reg('inspector.treePanel', afStudio.view.inspector.TreePanel);