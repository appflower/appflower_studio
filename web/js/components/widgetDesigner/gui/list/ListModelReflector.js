Ext.ns('afStudio.wd.list');

/**
 * @mixin ListModelReflector
 * @singleton
 * 
 * @author Nikolai Babinski
 */
afStudio.wd.list.ListModelReflector = (function() {
	
	return {
		
		/**
		 * @override
		 */
		correctExecutorLine : function(line, type, node, property) {
			if (['Action', 'Description'].indexOf(line) != -1) {
				var pt = this.getExecutorToken(node.parentNode.tag);
				line = pt + line;
			}
			
			return line;
		},		
		
		executeAddTitle : function(node) {
			this.setHeaderTitle(node);
			this.header.show();
			if (this.ownerCt && Ext.isFunction(this.ownerCt.doLayout)) {
				this.ownerCt.doLayout();
			}
		},
		executeRemoveTitle : function(node, cmp) {
			this.unmapCmpFromModel(node);
			this.hideHeader();
		},
		/**
		 * Updates title's value(<u>_content</u>).
		 */		
		executeUpdateTitle_content : function(node, cmp, p, v) {
			cmp.setTitle(v.trim() ? v : '&#160;');
		},
		
		executeAddRootDescription : function(node) {
			var dsc = this.getTopToolbar().getComponent('desc');
			dsc.show();
		},
		executeRemoveRootDescription : function(node, cmp) {
			var dsc = this.getTopToolbar().getComponent('desc');
			dsc.hide();
			this.doLayout();
		},
		executeUpdateRootDescription_content : function(node, cmp, p, v) {
			var cmp = this.getTopToolbar().getComponent('desc');
			cmp.get(0).setText(v.trim() ? v : '&#160;');
		},
		
		/**
		 * Checks if the selection model {@link #selModel} is check-box.
		 * @return {Boolean}
		 */
		hasCheckboxSelModel : function() {
			return this.selModel instanceof Ext.grid.CheckboxSelectionModel;			
		},
		
		/**
		 * Reset selection model {@link #selModel}
		 * @private
		 * @param {Ext.grid.AbstractSelectionModel} sm The selection model being set
		 */
		setSelModel : function(sm) {
			Ext.destroy(this.sm);
			this.selModel = sm;
			this.selModel.init(this);
		},
		
		/**
		 * Adds new column and associates it with passed in modal.
		 * @protected
		 * @param {Node} node The model node, this node will be associated with newly created column
		 * @param {Number} idx The column being created index inside {@link Ext.grid.ColumnModel}
		 * @param {Boolean} (Optional) insert The flag to avoid idx incrementation in 
		 * executing insertion culumn operation when CheckboxSelectionModel is used.
		 * (defaults to false)  
		 */
		executeAddColumn : function(node, idx, insert) {
			var cm = this.getColumnModel(),
				pColumn = this.getModelNodeProperties(node),
				oColumn = this.createColumn(pColumn);
			idx = !insert && this.hasCheckboxSelModel() ? ++idx : idx;
			cm.config.splice(idx, 0, oColumn);
			cm.setConfig(cm.config);
		},
		
		/**
		 * Removes column.
		 * @protected
		 * @param {Node} node The model node which was removed
		 * @param {Array} clm The column being removed. More details {@link #columnMapper}
		 */
		executeRemoveColumn : function(node, clm) {
			var cm = this.getColumnModel(),
				idx = clm[1];
			this.unmapCmpFromModel(node);
			cm.config.splice(idx, 1);
			cm.setConfig(cm.config);
		},
		
		/**
		 * Inserts column before the refClm column(associated with refNode).
		 * @protected
		 * @param {Node} node The model node, is the source for newly created column which is being inserted
		 * @param {Node} refNode The model node associated with the column before which insertion will be done
		 * @param {Array} refClm The column before which insertion take place. More details {@link #columnMapper}
		 */
		executeInsertColumn : function(node, refNode, refClm) {
			var idx = refClm[1];
			this.executeAddColumn(node, idx, true);	
		},
		
		/**
		 * Updates column's <u>label</u> property.
		 * @param {Node} node The column model node
		 * @param {Array} clm The column which label being updated. More details {@link #columnMapper}
		 * @param {String} p The property name
		 * @param {String} v The label property value to be set
		 */
		executeUpdateColumnLabel : function(node, clm, p, v) {
			var cm = this.getColumnModel(),
				idx = clm[1];
			cm.setColumnHeader(idx, v);
		},
		/**
		 * Updates column's <u>hidden</u> property.
		 */
		executeUpdateColumnHidden : function(node, clm, p, v) {
			var cm = this.getColumnModel(),
				idx = clm[1];
			cm.setHidden(idx, v);
		},
		/**
		 * Updates column's <u>hideable</u> property.
		 */
		executeUpdateColumnHideable : function(node, clm, p, v) {
			var cm = this.getColumnModel(),
				idx = clm[1];
			cm.config[idx].hideable = v;
			cm.setConfig(cm.config);
		},
		/**
		 * Updates column's <u>resizable</u> property.
		 */
		executeUpdateColumnResizable : function(node, clm, p, v) {
			var cm = this.getColumnModel(),
				idx = clm[1];
			cm.config[idx].fixed = !v;
			cm.setConfig(cm.config);
		},
		/**
		 * Updates column's <u>width</u> property.
		 */
		executeUpdateColumnWidth : function(node, clm, p, v) {
			var cm = this.getColumnModel(),
				idx = clm[1];
			cm.config[idx].width = v;
			cm.setConfig(cm.config);
		},
		
		/**
		 * Updates fields' <u>select</u> property => updates grid's selection model  
		 * @protected
		 * @param {Node} node The fields model node
		 * @param {Object} cmp The component associated with model node
		 * @param {String} p The property name - "select"
		 * @param {Mixed} v The "select" property value
		 */
		executeUpdateFieldsSelect : function(node, cmp, p, v) {
			var cm = this.getColumnModel();
			if (v) {
				var cbsm = new Ext.grid.CheckboxSelectionModel();
				this.setSelModel(cbsm);
				cm.config.unshift(cbsm);
				cm.setConfig(cm.config);
			} else {
				var rsm = new Ext.grid.RowSelectionModel();
				this.setSelModel(rsm);
				cm.config.shift();
				cm.setConfig(cm.config);
			}
		},
		/**
		 * Updates fields' <u>exportable</u> property.
		 */
		executeUpdateFieldsExportable : function(node, cmp, p, v) {
			v ? cmp.show() : cmp.hide();
			this.updateActionBarVisibilityState();
		},
		/**
		 * Updates fields' <u>selectable</u> property.
		 */
		executeUpdateFieldsSelectable : function(node, cmp, p, v) {
			var	bSel = cmp[0], bDesel = cmp[1];					
			v ? (bSel.enable(), bDesel.enable()) : (bSel.disable(), bDesel.disable());
			this.updateActionBarVisibilityState();
		},
		/**
		 * Updates fields' <u>expandButton</u> property.
		 */
		executeUpdateFieldsExpandButton : function(node, cmp, p, v) {
			v ? cmp.show() : cmp.hide();
			this.updateActionBarVisibilityState();
		},
		/**
		 * Updates fields' <u>pager</u> property.
		 */
		executeUpdateFieldsPager : function(node, cmp, p, v) {
			v ? cmp.show() : cmp.hide();
			this.doLayout();
		},

		/**
		 * Adds a row-action to actions column and associates it with passed in modal.
		 * @protected
		 * @param {Node} node The model node, this node will be associated with newly created row-action
		 * @param {Number} idx The row-action index inside row-actions column {@link afStudio.wd.list.ActionColumn}
		 */
		executeAddRowactionsAction : function(node, idx) {
			var cm = this.getColumnModel(),
			  	ac = cm.getColumnById('action-column'),
				pAction = this.getModelNodeProperties(node);
				
			if (!ac) {
				ac = this.createRowActionColumn([pAction]);
				cm.config.push(ac);
				cm.setConfig(cm.config);
			} else {
				var oAction = this.createRowAction(pAction);
				ac.items.splice(idx, 0, oAction);
				this.updateActionsColumnWidth();
			}
			this.view.refresh();
		},
		
		/**
		 * Removes row-action.
		 * @protected
		 * @param {Node} The model node to which removing action is associated
		 * @param {Array} act The action being removed. More details {@link #rowActionMapper}
		 */
		executeRemoveRowactionsAction : function(node, act) {
			var cm = this.getColumnModel(),
			  	ac = cm.getColumnById('action-column'),
			  	idx = act[1];
			this.unmapCmpFromModel(node);
			ac.items.splice(idx, 1);
			if (ac.items.length == 0) {
				cm.config.pop();
				cm.setConfig(cm.config);
			} else {
				this.updateActionsColumnWidth();
			}
			this.view.refresh();
		},
		
		/**
		 * Inserts row-action before the refCmp row-action(associated with refNode).
		 * @protected
		 * @param {Node} node The model node, is the source for newly created row-action which is being inserted
		 * @param {Node} refNode The model node associated with the row-action before which insertion will be done
		 * @param {Array} refCmp The row-action before which insertion take place. More details {@link #rowActionMapper}
		 */
		executeInsertRowactionsAction : function(node, refNode, refCmp) {
			var idx = refCmp[1];
			this.executeAddRowactionsAction(node, idx);	
		},
		
		/**
		 * Updates rowaction's <u>name</u> property.
		 */
		executeUpdateRowactionsActionName : function(node, cmp, p, v) {
			var act = cmp[0],
				oldValue = act.name;
			act.name = v;
			act.tooltip = (Ext.isEmpty(act.tooltip) || act.tooltip == oldValue) ? v : act.tooltip;
			act.altText = (Ext.isEmpty(act.altText) || act.altText == oldValue) ? v : act.altText;
			this.view.refresh();
		},
		/**
		 * Updates rowaction's <u>iconCls</u> property.
		 */
		executeUpdateRowactionsActionIconCls : function(node, cmp, p, v) {
			cmp[0].iconCls = v;
			this.view.refresh();
		},
		/**
		 * Updates rowaction's <u>icon</u> property.
		 */
		executeUpdateRowactionsActionIcon : function(node, cmp, p, v) {
			cmp[0].icon = v;
			this.view.refresh();
		},
		/**
		 * Updates rowaction's <u>text</u> property.
		 */
		executeUpdateRowactionsActionText : function(node, cmp, p, v) {
			cmp[0].altText = v ? v : cmp[0].name;
			this.view.refresh();
		},
		/**
		 * Updates rowaction's <u>tooltip</u> property.
		 */
		executeUpdateRowactionsActionTooltip : function(node, cmp, p, v) {
			cmp[0].tooltip = v ? v : cmp[0].name;
			this.view.refresh();
		},
		
		/**
		 * Removes action destroying it and unmapping from associated model node.
		 * @protected
		 * @param {Node} The model node an action is associated with
		 * @param {Object} The action being removed
		 */
		removeAction : function(node, act) {
			act.destroy();
			this.unmapCmpFromModel(node);
			this.updateActionBarVisibilityState();
		},
		
		/**
		 * Sets action <u>name</u> property.
		 * @protected
		 * @param {Object} act The action whose name property being set
		 * @param {String} v The name value
		 */
		setActionName : function(act, v) {
			var oldValue = act.name;
			act.name = v;
			if (Ext.isEmpty(act.text) || act.text == oldValue) {
				act.setText(v);
			}
		},
		
		/**
		 * Sets action <u>style</u> property.
		 * @protected
		 * @param {Object} act The action whose name property being set
		 * @param {String} v The name value
		 */
		setActionStyle : function(act, v) {
			act.el.dom.removeAttribute('style', '');
			act.el.applyStyles(v);
		},
		
		/**
		 * Adds action.
		 */
		executeAddActionsAction : function(node, idx) {
			var ab = this.getActionToolBar(),
				pAction = this.getModelNodeProperties(node),
				oAction = this.createAction(pAction);
			ab.insertButton(idx, oAction);
			this.updateActionBarVisibilityState();
		},
		/**
		 * Removes action.
		 */
		executeRemoveActionsAction : function(node, act) {
			this.removeAction(node, act[0]);
		},
		/**
		 * Inserts action.
		 */
		executeInsertActionsAction : function(node, refNode, refAct) {
			var idx = refAct[1];
			this.executeAddActionsAction(node, idx);
		},
		/**
		 * Updates action's <u>name</u> property.
		 */		
		executeUpdateActionsActionName : function(node, cmp, p, v) {
			this.setActionName(cmp[0], v);
		},
		/**
		 * Updates action's <u>text</u> property.
		 */		
		executeUpdateActionsActionText : function(node, cmp, p, v) {
			cmp[0].setText(v ? v : cmp[0].name);
		},
		/**
		 * Updates action's <u>iconCls</u> property.
		 */		
		executeUpdateActionsActionIconCls : function(node, cmp, p, v) {
			cmp[0].setIconClass(v);
		},
		/**
		 * Updates action's <u>tooltip</u> property.
		 */		
		executeUpdateActionsActionTooltip : function(node, cmp, p, v) {
			cmp[0].setTooltip(v);	
		},
		/**
		 * Updates action's <u>icon</u> property.
		 */		
		executeUpdateActionsActionIcon : function(node, cmp, p, v) {
			cmp[0].setIcon(v);
		},
		/**
		 * Updates action's <u>style</u> property.
		 */		
		executeUpdateActionsActionStyle : function(node, cmp, p, v) {
			this.setActionStyle(cmp[0], v);
		},
		
		/**
		 * Adds more-action.
		 */
		executeAddMoreactionsAction : function(node, idx, insert) {
			var ab = this.getActionToolBar(),
		    	m  = ab.getComponent('more').menu,
				pAction = this.getModelNodeProperties(node),
				oAction = this.createMoreAction(pAction);
			//idx + 3 because of previous 3 components "exports", "sel-all" and "desel-all"	
			idx = !insert ? idx + 3 : idx; 	
			m.insert(idx, oAction);
			this.updateActionBarVisibilityState();
		},
		/**
		 * Removes more-action.
		 */
		executeRemoveMoreactionsAction : function(node, act) {
			this.removeAction(node, act[0]);			
		},
		/**
		 * Inserts more-action.
		 */
		executeInsertMoreactionsAction : function(node, refNode, refAct) {
			var idx = refAct[1];
			this.executeAddMoreactionsAction(node, idx, true);
		},
		/**
		 * Updates more-action's <u>name</u> property.
		 */		
		executeUpdateMoreactionsActionName : function(node, cmp, p, v) {
			this.setActionName(cmp[0], v);
		},
		/**
		 * Updates more-action's <u>text</u> property.
		 */		
		executeUpdateMoreactionsActionText : function(node, cmp, p, v) {
			cmp[0].setText(v ? v : cmp[0].name);
		},
		/**
		 * Updates more-action's <u>iconCls</u> property.
		 */		
		executeUpdateMoreactionsActionIconCls : function(node, cmp, p, v) {
			cmp[0].setIconClass(v);
		},
		/**
		 * Updates more-action's <u>icon</u> property.
		 */		
		executeUpdateMoreactionsActionIcon : function(node, cmp, p, v) {
			cmp[0].icon = v;
			try {
				cmp[0].el.child('img').set({src: v});
			} catch(e){}
		},
		/**
		 * Updates more-action's <u>style</u> property.
		 */		
		executeUpdateMoreactionsActionStyle : function(node, cmp, p, v) {
			cmp[0].style = v;
			try {
				this.setActionStyle(cmp[0], v);
			} catch(e){}
		}
	};
})();


/**
 * Extends base mixin {@link afStudio.wd.ModelReflector} class.
 */
Ext.applyIf(afStudio.wd.list.ListModelReflector, afStudio.wd.ModelReflector);