Ext.ns('afStudio.theme.desktop.menu.view');

/**
 * @mixin afStudio.theme.desktop.menu.view.ModelReflector
 * Provides instruments for a view to be ready reflect model changes. 
 * 
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.menu.view.ModelReflector = (function() {
    
    return {
        
        /**
         * Returns executor token.
         * @override
         * @param {String} s
         * @return {String} token 
         */
        getExecutorToken : function(s) {
            return s.ucfirst();
        },
        
        /**
         * Corrects line of executor's type.
         * @override
         * 
         * @return {String} line
         */
        correctExecutorLine : function(line, type, node, property) {
            var ctrlType = node.getOwnerTree().getModelType();

            if (ctrlType == 'main') {
                line = 'MainItem'
            }
            
            if (node.isRoot) {
                line = 'Root' + line;
            }
            
            return line;
        },

        /**
         * Updates menu title.
         */
        executeUpdateRootMainItemTitle : function(node, item, p, v, oldValue) {
            this.setTitle(v);
        },
        
        /**
         * Updates menu iconCls.
         */
        executeUpdateRootMainItemIconCls : function(node, item, p, v, oldValue) {
            v = Ext.util.Format.trim(v);
            this.setTitleIconCls(v);
        },
        
        /**
         * Updates menu icon image.
         */
        executeUpdateRootMainItemIcon : function(node, item, p, v, oldValue) {
            this.setTitleIcon(v);
        },
        
        /* Main menu */
        
        /**
         * Adds main menu item.
         * @param {Node} parent The item's parent node
         * @param {Node} n The item node being added
         * @param {Number} idx The item's index inside parent menu
         */
        executeAddMainItem : function(parent, n, idx) {
            var parentCmp = this.getCmpByModel(parent),
                nDef = this.getNodeDef(n),
                nCmp = this.createMainMenuItem(nDef);
            
            //root menu item
            if (parent.isRoot && parentCmp == null) {
                this.insert(idx, nCmp);
                this.doLayout();
                
            //submenu item
            } else {
                //has menu
                if (parentCmp.menu) {
	                parentCmp.menu.insert(idx, nCmp);
	                parentCmp.menu.doLayout();
                
                //create menu
                } else {
                    var menu = {
						ignoreParentClicks: true,
						items: [nCmp],
	                    ownerCt: parentCmp
                    };
		            parentCmp.menu = Ext.menu.MenuMgr.get(menu);
                    if (parentCmp.el) {
                        parentCmp.el.addClass('x-menu-item-arrow');
                    }
                }
            }
        },
        //eo executeAddMainItem
        
        /**
         * Removes main menu item.
         * @param {Node} parent The item's parent node
         * @param {Node} n The item node being deleted
         * @param {Ext.menu.Item} nCmp The menu item associated with item's node
         */
        executeRemoveMainItem : function(parent, n, nCmp) {
            var parentCmp = this.getCmpByModel(parent);
            
            Ext.destroy(nCmp);
            
            if (!parent.isRoot && parentCmp.menu.items.length == 0) {
                Ext.destroy(parentCmp.menu);
                parentCmp.menu = null;
                if (parentCmp.el) {
                    parentCmp.el.removeClass('x-menu-item-arrow');
                }
            }
        },
        
        /**
         * Inserts main menu item.
         * @param {Node} parent The item's parent node
         * @param {Node} n The item node being inserted
         */
        executeInsertMainItem : function(parent, n) {
            var idx = parent.indexOf(n);
            this.executeAddMainItem(parent, n, idx);
        },
        
        /**
         * label
         */        
        executeUpdateMainItemLabel : function(node, item, p, v, oldValue) {
            item.setText(v ? v : node.getPropertyValue('name'));
        },
        /**
         * name
         */
        executeUpdateMainItemName : function(node, item, p, v, oldValue) {
            if (Ext.isEmpty(item.text) || item.text == oldValue) {
                item.setText(v);
            }
        },
        /**
         * iconCls
         */
        executeUpdateMainItemIconCls : function(node, item, p, v, oldValue) {
            item.setIconClass(v);
        },
        /**
         * icon
         */
        executeUpdateMainItemIcon : function(node, item, p, v, oldValue) {
            item.iconEl.dom.src = v ? v : Ext.BLANK_IMAGE_URL;
        },
        
        /* Tools menu */
        
        
        /**
         * Adds tools menu item.
         * @param {Node} parent The item's parent node
         * @param {Node} n The item node being added
         * @param {Number} idx The item's index inside parent menu
         */
        executeAddTool : function(parent, n, idx) {
            var nDef = this.getModelNodeProperties(n),
                nCmp = this.createToolsMenuItem(nDef);
                
            idx++;
            
            this.insertToolItem(idx, nCmp);
        },
        
        /**
         * Removes tools menu item.
         * @param {Node} parent The item's parent node
         * @param {Node} n The item node being deleted
         * @param {Ext.menu.Item} nCmp The menu item associated with item's node
         */
        executeRemoveTool : function(parent, n, nCmp) {
            Ext.destroy(nCmp);
        },
        
        /**
         * Inserts tools menu item at specified position.
         * @param {Node} parent The item's parent node
         * @param {Node} n The item node being inserted
         */
        executeInsertTool : function(parent, n) {
            var idx = parent.indexOf(n);
            this.executeAddTool(parent, n, idx);
        },
        
        /**
         * text
         */        
        executeUpdateToolText : function(node, item, p, v, oldValue) {
            item.setText(v ? v : node.getPropertyValue('name'));
        },
        /**
         * name
         */
        executeUpdateToolName : function(node, item, p, v, oldValue) {
            if (Ext.isEmpty(item.text) || item.text == oldValue) {
                item.setText(v);
            }
        },
        /**
         * iconCls
         */
        executeUpdateToolIconCls : function(node, item, p, v, oldValue) {
            item.setIconClass(v);
        },
        /**
         * icon
         */
        executeUpdateToolIcon : function(node, item, p, v, oldValue) {
            item.iconEl.dom.src = v ? v : Ext.BLANK_IMAGE_URL;
        }
    };
})();

/**
 * Extends base mixin {@link afStudio.view.ModelReflector}
 */
Ext.applyIf(afStudio.theme.desktop.menu.view.ModelReflector, afStudio.view.ModelReflector);