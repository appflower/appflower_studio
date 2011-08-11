Ext.ns('afStudio.wd.list');

/**
 * @mixin ModelReflector
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.list.ModelReflector = (function() {
	
	return {
		
		/**
		 * Checks if the selection model {@link #selModel} is check-box.
		 * @private
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
		 * Adds new column and associate it with passed in modal.
		 * @protected
		 * @param {Node} node The model node, this node will be associated with newly created column
		 * @param {Number} idx The column being created index inside {@link Ext.grid.ColumnModel}
		 * @param {Boolean} (Optional) insert The flag to avoid idx incrementation in executing insertion culumn operation with CheckboxSelectionModel.
		 * (defaults to false)  
		 */
		executeAddColumn : function(node, idx, insert) {
			console.log('@reflector [ListView] executeAddColumn', node, idx);
			
			var cm = this.getColumnModel(),
				pColumn = this.getModelNodeProperties(node),
				oColumn = this.createColumn(pColumn, idx);
				
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
			console.log('@reflector [ListView] executeRemoveColumn', node, clm);
			
			var m = this.getModelNodeMapper(),
				cm = this.getColumnModel(),
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
			console.log('@reflector [ListView] executeInsertColumn', node, refNode, refClm);
			
			var m = this.getModelNodeMapper(),
				cm = this.getColumnModel(),
				idx = refClm[1];
			this.executeAddColumn(node, idx, true);	
		},
		
		/**
		 * Updates fields' select property => updates grid's selection model  
		 * @protected
		 * @param {Node} node The fields model node
		 * @param {Object} cmp The component associated with model node
		 * @param {String} p The property name - "select"
		 * @param {Mixed} v The "select" property value
		 */
		executeUpdateFieldsSelect : function(node, cmp, p, v) {
			console.log('@reflector [ListView] executeUpdateFieldsSelect', node, cmp, p, v);
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
		 * Remove action executor dispatcher.
		 */
		executeRemoveAction : function(node, act) {
			var executor = this.getExecutor(this.EXEC_REMOVE, node.parentNode.tag);
			if (executor) {
				executor(node, act);
			}
		},
		
		/**
		 * Removes row-action.
		 * @param {Node} The model node to which removing action is associated
		 * @param {Array} act The action being removed. More details {@link #rowActionMapper}
		 */
		executeRemoveRowactions : function(node, act) {
			console.log('@reflector [ListView] executeRemoveRowactions', node, act);
			var cm = this.getColumnModel(),
			  	ac = cm.getColumnById('action-column'),
			  	idx = act[1];
			this.unmapCmpFromModel(node);
			ac.items.splice(idx, 1);
			if (ac.items.length == 0) {
				cm.config.pop();
				cm.setConfig(cm.config);
			}
			this.view.refresh();
		}		
	};
})();
