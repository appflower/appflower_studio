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
			expanded: true,
			modelNode: root,
			properties: {
				name: String.format("{0} ({1}-{2})", view.uri, view.place, view.placeType)
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
	//eo getCmpByModel	
	
	/**
	 * Ext Template method
	 * Initializes events.
	 * @private
	 */
	initEvents : function() {
		afStudio.view.inspector.TreePanel.superclass.initEvents.apply(this, arguments);
		
		var _me = this,
			 sm = _me.getSelectionModel();
		
		_me.on({
			scope: _me,
			
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
			modelNodeRemove: _me.onModelNodeRemove,
			/**
			 * @relayed controller
			 */
			modelNodeSelect: _me.onModelNodeSelect,
			/**
			 * @relayed controller
			 */
			modelPropertyChanged: _me.onModelPropertyChanged,
			
			contextmenu:  _me.onNodeContextMenu,
			
			nodedragover: _me.onNodeDragOver,
			
			nodedrop: _me.onNodeDrop
		});
		
		_me.mon(sm, {
			selectionchange : _me.onNodeSelectionChange,
			scope: _me
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
			console.log('@view [InspectorTree] onModelNodeSelect');
			var viewNode = this.getCmpByModel(mn);
			this.selectPath(viewNode.getPath());
		}
	},
	//eo onModelNodeSelect
		
	/**
	 * Relayed <u>modelNodeAppend</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeAppend}.
	 * @protected
	 * @interface
	 */
	onModelNodeAppend : function(ctr, parent, node, index) {
		console.log('@view [InspectorTree] "modelNodeAppend"');
		var viewNode = this.getCmpByModel(parent);
		viewNode.reload(function() {
			var viewNode = this.getCmpByModel(node);
			viewNode.select();
		}, this);
	},
	//eo onModelNodeAppend
	
	/**
	 * Relayed <u>modelNodeInsert</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeInsert}.
	 * @protected
	 * @interface
	 */
	onModelNodeInsert : function(ctr, parent, node, refNode) {
		console.log('@view [InspectorTree] "modelNodeInsert"');
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
    	console.log('@view [InspectorTree] "modelNodeRemove"');
    	var viewNode = this.getCmpByModel(node);
    	if (viewNode) {
    		viewNode.remove(true);
    	}
	},
	//eo onModelNodeRemove	
	
	/**
	 * Relayed <u>modelPropertyChanged</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelPropertyChanged}.
	 * @protected
	 * @interface
	 */
	onModelPropertyChanged : function(node, p, v) {
		console.log('@view [InspectorTree] "modelPropertyChanged"', node, p, v);
		var viewNode = this.getCmpByModel(node);
		if (viewNode.labelProperty == p) {
			viewNode.setText(Ext.value(v, '(none)'));
		}
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
	//eo onNodeContextMenu
	
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
	//eo onNodeDragOver
	
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
	//eo onNodeDrop
	
	/**
	 * This tree selection-model <u>selectionchange</u> event listener.
	 * @param {DefaultSelectionModel} sm This tree selection-model
	 * @param {TreeNode} node The new selection
	 * @protected
	 */
	onNodeSelectionChange : function(sm, node) {
		if (node) {
			console.log('@view [InspectorTree] "selectModelNode"', node.modelNode);
			this.controller.selectModelNode(node.modelNode, this);
		}
	}
	//eo onNodeClick
});

afStudio.view.inspector.nodeType = {}

/**
 * @type 'inspector.treePanel'
 */
Ext.reg('inspector.treePanel', afStudio.view.inspector.TreePanel);