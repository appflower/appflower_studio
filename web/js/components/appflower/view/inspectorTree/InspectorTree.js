Ext.ns('afStudio.view.inspector');

/**
 * The InspectorTree view, represents the whole model structure.
 * 
 * @class afStudio.view.inspector.InspectorTree
 * @extends Ext.tree.TreePanel
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.InspectorTree = Ext.extend(Ext.tree.TreePanel, {
	/**
	 * The associated with this tree controller.
	 * @cfg {afStudio.controller.BaseController} (Required) controller
	 */

	autoScroll : true,
	
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
			expanded: true,
			modelNode: root,
			properties: {
				name: view ? String.format("{0} ({1}-{2})", view.uri, view.place, view.placeType) : ''
			}
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
		afStudio.view.inspector.InspectorTree.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	},
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	_afterInitComponent : function() {
		var me = this;
		//activate treeSorter
		this.treeSorter = new afStudio.view.inspector.InspectorSorter(this);		
	},
	
	/**
	 * Expands a specified path in this tree based on tree-model association.
	 * @public 
	 * @param {Node} mn The model node
	 * @param {Function} callback The callback function, called with two parameters:
	 * <ul>
	 * 		<li><b>success</b>: {Boolean} success The result of expanding operation</li>
	 * 		<li><b>node</b>: {TreeNode} node The last expanded node</li>
	 * </ul>
	 */
    expandPathByModelNode : function(mn, callback) {
    	var path = mn.getPath();
    	
        if (Ext.isEmpty(path)) {
            if (callback) {
                callback(false, undefined);
            }
            return;
        }
        var keys    = path.split(this.pathSeparator),
        	curNode = this.root;
        if (curNode.modelNode.id != keys[1]) { // invalid root
            if (callback) {
                callback(false, null);
            }
            return;
        }
        var index = 1;
        var f = function() {
            if (++index == keys.length) {
                if (callback) {
                    callback(true, curNode);
                }
                return;
            }
            var c = curNode.findChildByAssociatedModel(keys[index]);
            if (!c) {
                if (callback) {
                    callback(false, curNode);
                }
                return;
            }
            curNode = c;
            c.expand(false, false, f);
        };
        curNode.expand(false, false, f);
    },
    //eo expandPathByModelNode
	
	/**
	 * Returns view component by associated with it model.
	 * @public
	 * @interface
	 * @param {afStudio.model.Node} node The model node
	 * @return {afStudio.view.inspector.TreeNode} node
	 */
	getCmpByModel : function(node) {
		var root = this.getRootNode(),
			cmp;
		
    	cmp = root.findChildBy(function(vNode) {
    		return vNode.modelNode == node; 
    	}, null, true);
    	
    	if (!cmp) {
			this.expandPathByModelNode(node, function(s, n) {
				if (s === true) {
					cmp = n;
				}
			});
    	}		
    	
    	return cmp;
	},
	
	/**
	 * Ext Template method
	 * Initializes events.
	 * @private
	 */
	initEvents : function() {
		afStudio.view.inspector.InspectorTree.superclass.initEvents.apply(this, arguments);
		
		var me = this,
			 sm = me.getSelectionModel();
		
		me.on({
			scope: me,
			
			/**
			 * @relayed controller
			 */
			modelNodeInsert: me.onModelNodeInsert, 
			/**
			 * @relayed controller
			 */
			modelNodeAppend: me.onModelNodeAppend,
			/**
			 * @relayed controller
			 */
			modelNodeRemove: me.onModelNodeRemove,
			/**
			 * @relayed controller
			 */
			modelNodeSelect: me.onModelNodeSelect,
			/**
			 * @relayed controller
			 */
			modelPropertyChanged: me.onModelPropertyChanged,
			/**
			 * @relayed controller
			 */
			modelReconfigure: me.onModelNodeReconfigure,
			
			contextmenu:  me.onNodeContextMenu,
			
			nodedragover: me.onNodeDragOver,
			
			nodedrop: me.onNodeDrop
		});
		
		me.mon(sm, {
			selectionchange : me.onNodeSelectionChange,
			scope: me
		});
	},
	//eo initEvents
	
	/**
	 * Relayed <u>modelNodeSelect</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeSelect}.
	 * @protected
	 * @interface
	 */
	onModelNodeSelect : function(mn, trigger) {
		if (trigger != this) {
			afStudio.Logger.info('@view [InspectorTree] onModelNodeSelect');
			var viewNode = this.getCmpByModel(mn);
			
			if (!viewNode.isSelected()) {
				this.selectPath(viewNode.getPath());
			}
		}
	},
		
	/**
	 * Relayed <u>modelNodeAppend</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeAppend}.
	 * @protected
	 * @interface
	 */
	onModelNodeAppend : function(ctr, parent, node, index) {
		afStudio.Logger.info('@view [InspectorTree] "modelNodeAppend"');
		var viewNode = this.getCmpByModel(parent);
		viewNode.reload(function() {
			var viewNode = this.getCmpByModel(node);
			viewNode.select();
		}, this);
	},
	
	/**
	 * Relayed <u>modelNodeInsert</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeInsert}.
	 * @protected
	 * @interface
	 */
	onModelNodeInsert : function(ctr, parent, node, refNode) {
		afStudio.Logger.info('@view [InspectorTree] "modelNodeInsert"');
		var viewNode = this.getCmpByModel(parent);
		viewNode.reload(function() {
			var viewNode = this.getCmpByModel(node);
			viewNode.select();
		}, this);
	},
	
	/**
	 * Relayed <u>modelNodeRemove</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeRemove}.
	 * @protected
	 * @interface
	 */
	onModelNodeRemove : function(ctr, parent, node) {
    	afStudio.Logger.info('@view [InspectorTree] "modelNodeRemove"');
    	var viewNode = this.getCmpByModel(node);
    	if (viewNode) {
    		viewNode.remove(true);
    	}
	},
	
	/**
	 * Relayed <u>modelPropertyChanged</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelPropertyChanged}.
	 * @protected
	 * @interface
	 */
	onModelPropertyChanged : function(node, p, v) {
		afStudio.Logger.info('@view [InspectorTree] "modelPropertyChanged"', node, p, v);
		var viewNode = this.getCmpByModel(node);
		if (viewNode.labelProperty == p) {
			viewNode.setText(Ext.value(v, '(none)'));
		}
	},	

	/**
	 * Relayed <u>modelReconfigure</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelReconfigure}.
	 * @protected
	 * @interface
	 */
	onModelNodeReconfigure : function(node) {
		afStudio.Logger.info('@view [InspectorTree] "reconfigure"', node);
		var viewNode = this.getCmpByModel(node.parentNode ? node.parentNode : node);
		viewNode.reload(function() {
			var viewNode = this.getCmpByModel(node);
			viewNode.select();
		}, this);
	},
	
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
	
	/**
	 * <u>nodedragover</u> event listener. 
	 * More details {@link Ext.tree.TreePanel#nodedragover}.
	 * @protected 
	 */
	onNodeDragOver : function(de) {
		var n = de.dropNode, p = de.point, t = de.target,
			dm = n.modelNode, 
			tm = t.modelNode;
		if (p == 'append' || (dm.tag != tm.tag) || (dm.parentNode != tm.parentNode)) {
			return false;
		}
	},
	
	/**
	 * <u>nodedrop</u> event listener.
	 * More details {@link Ext.tree.TreePanel#nodedrop}. 
	 * @protected
	 */
	onNodeDrop : function(de) {
		var n = de.dropNode.modelNode, p = de.point, t = de.target.modelNode;
	    if (p == "above") {
	        t.parentNode.insertBefore(n, t);
	    } else if (p == "below") {
	        t.parentNode.insertBefore(n, t.nextSibling);
	    }
	},
	
	/**
	 * This tree selection-model <u>selectionchange</u> event listener.
	 * @param {DefaultSelectionModel} sm This tree selection-model
	 * @param {TreeNode} node The new selection
	 * @protected
	 */
	onNodeSelectionChange : function(sm, node) {
		if (node) {
			afStudio.Logger.info('@view [InspectorTree] "selectModelNode"', node.modelNode);
			this.controller.selectModelNode(node.modelNode, this);
		}
	}
});

afStudio.view.inspector.nodeType = {}

/**
 * @type 'inspector.inspectorTree'
 */
Ext.reg('inspector.inspectorTree', afStudio.view.inspector.InspectorTree);