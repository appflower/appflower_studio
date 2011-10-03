Ext.ns('afStudio.wd.list');

/**
 * ListView - represents the list widget type.
 * 
 * @dependency {afStudio.data.Types} model types
 * @dependency {afStudio.wd.ModelMapper} ModelMapper mixin
 * @dependency {afStudio.wd.list.ListModelInterface} ListModelInterface mixin
 * @dependency {afStudio.wd.list.ModelReflector} ModelReflector mixin
 * 
 * @class afStudio.wd.list.ListView
 * @extends Ext.grid.GridPanel
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.wd.list.ListView = Ext.extend(Ext.grid.GridPanel, {
	/**
	 * The associated with this view controller.
	 * @cfg {afStudio.controller.BaseController} (Required) controller
	 */
	
	/**
	 * Rowaction width (defaults to 18).
	 * @property rowActionWidth
	 * @type {Number}
	 */
    rowActionWidth : 18,
	/**
	 * Rowactions column width (defaults to 58).
	 * @property actionsColumnWidth
	 * @type {Number}
	 */
    actionsColumnWidth : 58,
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var _me = this;
		
		/**
		 * Model->Component associations holder.
		 * @property modelMapper
		 * @type {Object}
		 */
		this.modelMapper = {};

		var columns = this.createColumns();
	
		var sm = this.resolveSelectionModel();

		var store = new Ext.data.ArrayStore({
			idIndex: 0,
			data: [[]],
			fields: []
		});
		
		var actions = this.createActions();
		
		var desc = this.createDescription();
		
		return {
			header: true,
	        store: store,
	        selModel: sm,
			columns: columns,
	        view: new afStudio.wd.list.ListGridView(),
	        columnLines: true,
	        autoScroll: true,
	        tbar: {
	        	xtype: 'container',
	        	defaults: {
	        		xtype: 'toolbar'
	        	},
	        	items: [actions, desc]
	        },
	        bbar: {
	        	xtype: 'paging',
	        	hidden: true,
		        store: store,
		        displayInfo: true
	        }
		};		
	},
	//eo _beforeInitComponent	
	
	/**
	 * Template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.wd.list.ListView.superclass.initComponent.apply(this, arguments);
		
		this._afterInitComponent();
	},
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	_afterInitComponent : function() {
		var _me = this;
		
		this.configureView();
	},
	//eo _afterInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	afterRender : function() {
		afStudio.wd.list.ListView.superclass.afterRender.call(this);

		//sets header visibility mode
		this.header.setVisibilityMode(Ext.Element.DISPLAY);
		if (!this.title) {
			this.hideHeader();
		}
	},
	
	/**
	 * Sets & registers view's title.
	 * @protected
	 * @param {Node} nTitle
	 */
	setHeaderTitle : function(nTitle) {
		var v = this.NODE_VALUE_MAPPER,
			vTitle = this.getModelNodeValue(nTitle);
		this.setTitle(vTitle[v] ?  vTitle[v] : '&#160;');
		this.mapCmpToModel(nTitle.id, this);
	},
	
	/**
	 * Hides view's header {@link #header}
	 * @protected
	 */
	hideHeader : function() {
		var h = this.getResizeEl().getHeight();
		this.header.hide();
		this.setHeight(h);
	},
	
	/**
	 * After construction view configuration
	 * @protected
	 */
	configureView : function() {
		var nodes = this.NODES,
			nodeIdMpr = this.NODE_ID_MAPPER,
				   v  = this.NODE_VALUE_MAPPER,
		    a = this.getActionToolBar(),
		    ma = a.getComponent('more').menu;
		
		//title    
		var nTitle = this.getModelNodeByPath(nodes.TITLE);
		if (nTitle) {
			this.setHeaderTitle(nTitle);
		}
		
		//top toolbar
		var nFields = this.getModelNode(nodes.FIELDS);
		
		var selAll = ma.getComponent('sel-all'),
			deselAll = ma.getComponent('desel-all'),
			exp = ma.getComponent('exports'),
			expView = a.getComponent('expanded-view');
		
		//mapping	
		this.mapCmpToModel(nFields.id + '#selectable', this.createMapper(
				function(){ return [selAll, deselAll]; }
		));
		selAll[nodeIdMpr] = deselAll[nodeIdMpr] = nFields.id + '#selectable';
		
		this.mapCmpToModel(nFields.id + '#exportable', exp);
		exp[nodeIdMpr] = nFields.id + '#exportable';
		
		this.mapCmpToModel(nFields.id + '#expandButton', expView);
		expView[nodeIdMpr] = nFields.id + '#expandButton';
		
		var pFields = this.getModelNodeProperties(nodes.FIELDS);
		pFields.selectable ? (selAll.enable(), deselAll.enable()) : (selAll.disable(), deselAll.disable());
		pFields.exportable ? exp.show() : exp.hide();
		pFields.expandButton ? expView.show() : expView.hide();
		
		this.updateActionBarVisibilityState();
		//end top toolbar
		
		//bottom toolbar
		if (this.isModelStatus(nodes.FIELDS, {pager: true})) {
			var bb = this.getBottomToolbar();
			bb.show();
			this.mapCmpToModel(nFields.id + '#pager', bb);
		}
	},
	//eo configureView
	
	/**
	 * Ext template method
	 * @private
	 */
	initEvents : function() {
		afStudio.wd.list.ListView.superclass.initEvents.call(this);
		
		var _me = this;
		
		this.on({
			scope: _me,
			
			contextmenu: function(e) {
				e.preventDefault();
			},
			
			columnmove: _me.onColumnMove,
			
			columnresize: _me.onColumnResize,
			
            /**
             * @relayed controller
             */
            modelNodeAppend: _me.onModelNodeAppend,
            /**
             * @relayed controller
             */
            modelNodeInsert: _me.onModelNodeInsert,
    		/**
    		 * @relayed controller
    		 */
            modelNodeRemove: _me.onModelNodeRemove,
    		/**
    		 * @relayed controller
    		 */
            modelPropertyChanged: _me.onModelPropertyChanged
		});
	},
	//eo initEvents
	
	/**
	 * Relayed <u>modelNodeAppend</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeAppend}.
	 * @protected
	 * @interface
	 */
	onModelNodeAppend : function(ctr, parent, node, index) {
		afStudio.Logger.info('@view [ListView] modelNodeAppend');
		var executor = this.getExecutor(this.EXEC_ADD, node);
		if (executor) {
			executor(node, index);
		}
	},
	//eo onModelNodeAppend
	
	/**
	 * Relayed <u>modelNodeInsert</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeInsert}.
	 * @protected
	 * @interface
	 */
	onModelNodeInsert : function(ctr, parent, node, refNode) {
		afStudio.Logger.info('@view [ListView] modelNodeInsert');
		var refCmp = this.getCmpByModel(refNode),
			executor = this.getExecutor(this.EXEC_INSERT, node);
		if (executor) {
			executor(node, refNode, refCmp);
		}
	},
	//eo onModelNodeInsert
	
	/**
	 * Relayed <u>modelNodeRemove</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeRemove}.
	 * @protected
	 * @interface
	 */
	onModelNodeRemove : function(ctr, parent, node) {
    	afStudio.Logger.info('@view [ListView] modelNodeRemove');
		var vCmp = this.getCmpByModel(node),
			executor = this.getExecutor(this.EXEC_REMOVE, node);
		if (executor) {
			executor(node, vCmp);
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
		afStudio.Logger.info('@view [ListView] modelPropertyChanged');
		var vCmp = this.getCmpByModel(node, p),
			executor = this.getExecutor(this.EXEC_UPDATE, node, p);
		if (executor) {
			executor(node, vCmp, p, v);
		}
	},
	
	/**
	 * <u>columnmove</u> event listener.
	 * Details {@link Ext.grid.GridPanel#columnmove}
	 * @param {Number} oldIndex
	 * @param {Number} newIndex
	 */
	onColumnMove : function(oldIndex, newIndex) {
		var cm = this.getColumnModel();
		
		if (oldIndex != newIndex) {
			var clm = cm.config[newIndex],
				node = this.getModelByCmp(clm),
				parent = node.parentNode;
				
			if (this.hasCheckboxSelModel()) {
				oldIndex--;
				newIndex--;
			}
			
			var idx = (oldIndex < newIndex) ? newIndex + 1 : newIndex;
			var target = parent.item(idx);
			
			parent.insertBefore(node, target);
		}
	},
	
	/**
	 * <u>columnresize</u> event listener.
	 * Details {@link Ext.grid.GridPanel#columnresize}
	 * @param {Number} idx
	 * @param {Number} w
	 */
	onColumnResize : function(idx, w) {
		var cm = this.getColumnModel(),
			node = this.getModelByCmp(cm.config[idx]);
		
		node.setProperty('width', w);
	},
	
	/**
	 * Updates action bar <u>visibility</u> state.
	 * @protected 
	 */
	updateActionBarVisibilityState : function() {
		var aBar = this.getActionToolBar(),		
			aHidden = 0;

		this.updateMoreActionVisibilityState();
			
		aBar.items.each(function(i) {
			if (i.hidden) {
				aHidden++;
			}
		});		
		if (aHidden > 0 && ((aHidden + 1)  == aBar.items.getCount())) {
			aBar.hide();
		} else {
			aBar.show();
		}		
		this.doLayout();
	},
	//eo updateActionBarVisibilityState
	
	/**
	 * Updates <i>more actions</i> <u>visibility</u> state.
	 * @protected
	 */
	updateMoreActionVisibilityState : function() {
		var aBar   = this.getActionToolBar(),		
			aMore  = aBar.getComponent('more'),
			bSel   = aMore.menu.getComponent('sel-all'),
			bDesel = aMore.menu.getComponent('desel-all');				
		
		if (bSel.disabled && bDesel.disabled) {
			var ic = 2;	
			aMore.menu.items.each(function(i) {
				if (i.hidden) {
					ic++;
				}
			});
			if (ic == aMore.menu.items.getCount()) {
				aMore.hide();
			} else {
				aMore.show();
			}
		} else {
			aMore.show();
		}		
	},
	//eo updateMoreActionVisibilityState
	
	/**
	 * Column mapper responsible for returning a column from column 
	 * model {@link #colModel} by model node's ID associated with it.
	 * @private
	 * @param {String} n The model node id
	 * @return {Array} column:
	 * <ul>
	 * 	<li><b>0</b> - {Ext.grid.Column} The column itself</li>
	 * 	<li><b>1</b> - {Number} The column's index inside column model</li>
	 * </ul> 
	 */
	columnMapper : function(n) {
		var nodeIdMpr = this.NODE_ID_MAPPER,
			cm = this.getColumnModel(),
			idx = Ext.each(cm.config, function(c){
					return !(c[nodeIdMpr] == n);
				  });
			
		return [cm.config[idx], idx];
	},
	
	/**
	 * RowAction mapper responsible for returning a row-action from action column
	 * by model node's ID associated with the action.
	 * @private
	 * @param {String} n The model node id
	 * @return {Array} row-action:
	 * <ul>
	 * 	<li><b>0</b> - {Object} The row-action itself</li>
	 * 	<li><b>1</b> - {Number} The row-action's index inside the action column</li>
	 * </ul> 
	 */
	rowActionMapper : function(n) {
		var nodeIdMpr = this.NODE_ID_MAPPER,
			cm = this.getColumnModel(),
			aClm = cm.getColumnById('action-column'),
			idx = Ext.each(aClm.items, function(a){
					return !(a[nodeIdMpr] == n);
				  });
			
		return [aClm.items[idx], idx] ;
	},
	
	/**
	 * Action mapper responsible for returning an action from action toolbar
	 * by model node's ID associated with the action.
	 * @private
	 * @param {String} n The model node id
	 * @return {Array} action:
	 * <ul>
	 * 	<li><b>0</b> - {Ext.Toolbar.Item} The action itself</li>
	 * 	<li><b>1</b> - {Number} The action's index inside the action toolbar items</li>
	 * </ul> 
	 */
	actionMapper : function(n) {
		var nodeIdMpr = this.NODE_ID_MAPPER,
			ab = this.getActionToolBar(),
			idx;
			
		ab.items.each(function(a, i, l) {
			if (i > l - 3) {
				return false;
			}
			if (a[nodeIdMpr] == n) {
				idx = i;
				return false;
			}
		});
				
		return [ab.items.itemAt(idx), idx];
	},
	
	/**
	 * MoreAction mapper responsible for returning an action from more-action menu
	 * by model node's ID associated with the action.
	 * @private
	 * @param {String} n The model node id
	 * @return {Array} action:
	 * <ul>
	 * 	<li><b>0</b> - {Ext.menu.Item} The action itself</li>
	 * 	<li><b>1</b> - {Number} The action's index inside the more-action menu items</li>
	 * </ul> 
	 */
	moreActionMapper : function(n) {
    	var nodeIdMpr = this.NODE_ID_MAPPER,
    		ab = this.getActionToolBar(),
    		more = ab.getComponent('more').menu,
    		idx;
    		
		more.items.each(function(a, i) {
			if (i > 2 && a[nodeIdMpr] == n) {
				idx = i;
				return false;
			}
		});
				
		return [more.items.itemAt(idx), idx];
	},
	
	/**
	 * Resolve selection model for the grid.
	 * @protected
	 * @return {Ext.grid.RowSelectionModel} selection model
	 */
	resolveSelectionModel : function() {
		return this.isModelStatus(this.NODES.FIELDS, {'select': true}) 
					? new Ext.grid.CheckboxSelectionModel() 
					: new Ext.grid.RowSelectionModel();
	},
	
	/**
	 * Creates columns.
	 * @protected
	 * @return {Object} column model {@link Ext.grid.ColumnModel} init object
	 */
	createColumns : function() {
		var _me = this,
			nodes = this.NODES,
			columns = [];
		
		var sm = this.resolveSelectionModel(); 	
		if (sm instanceof Ext.grid.CheckboxSelectionModel) {
			columns.push(sm);
		}
			
		if (_me.isModelNodeExists(nodes.COLUMN, true)) {
			var clm = _me.getColumns();
			
			for (var i = 0, l = clm.length; i < l; i++) {
				var c = this.createColumn(clm[i]);
				columns.push(c);
			}
		}
		
		//i:rowactions
		var ra = _me.getRowActions();
		if (!Ext.isEmpty(_me.getRowActions())) {
			columns.push(
				this.createRowActionColumn(ra)
			);
		}
		
		return columns;
	},
	//eo createColumns
	
	/**
	 * Creates grid's column object.
	 * @protected
	 * @param {Object} clm The column definition object
	 * @return {Object} column {@link Ext.grid.Column} init object
	 */
	createColumn : function(clm) {
		var clmId = clm[this.NODE_ID_MAPPER];
		
		this.mapCmpToModel(clmId, this.createMapper(this.columnMapper, clmId));
		
		var column = {
			id: clmId,
			header: clm.label
		};
		Ext.copyTo(column, clm, 'width, hidden, hideable');
		
		//add model node mapping
		column[this.NODE_ID_MAPPER] = clmId;
		
		return column;
	},
	//eo createColumn
	
	/**
	 * Removes grid's column.
	 * @param {Ext.grid.Column} clm The column being removed
	 */
	removeColumn : function(clm) {
		var n = this.getModelByCmp(clm);
		n.remove(true);
	},
	
	/**
	 * Creates grid's <i>action</i> column.
	 * @param {Array} actions The actions definition
	 * @return {Object} action column {Ext.grid.ActionColumn} init object
	 */
	createRowActionColumn : function(actions) {
		var	_me = this,
			aWidth = this.rowActionWidth,
			actClmWidth = this.actionsColumnWidth;
			
		var actClm = {
			id: 'action-column',
            xtype: 'listactioncolumn',
            header: 'Actions',
            menuDisabled: true,
            width: actClmWidth,
            fixed: true,
            items: []
		};
		
		Ext.iterate(actions, function(ra, idx) {
			var a = _me.createRowAction(ra);
			actClm.items.push(a);
		});
		actClm.width = (actions.length * aWidth) > actClmWidth ? (actions.length * aWidth) : actClmWidth;
		
		return actClm;
	},
	//eo createRowActionColumn
	
	/**
	 * Updates/Recalculated Actions column width.
	 * @protected
	 */
	updateActionsColumnWidth : function() {
		var cm = this.getColumnModel(),
			ac = cm.getColumnById('action-column'),
			idx = cm.getIndexById('action-column'),
			actNum = ac.items.length;
		
		var width = (actNum * this.rowActionWidth) > this.actionsColumnWidth ? (actNum * this.rowActionWidth) : this.actionsColumnWidth;
		cm.setColumnWidth(idx, width);
	},
	
	/**
	 * Creates row-action.
	 * @param {Object} action The row-action definition object
	 * @return {Object} row-action init object 
	 */
	createRowAction : function(action) {
		var actNodeId = action[this.NODE_ID_MAPPER];

		this.mapCmpToModel(actNodeId, this.createMapper(this.rowActionMapper, actNodeId));
		
		var rowAction = {
			name: action.name,
			iconCls: action.iconCls,
			icon: action.icon,
			altText: action.text ? action.text : action.name,
			tooltip: action.tooltip ? action.tooltip : action.name
		};
		
		//add model node mapping
		rowAction[this.NODE_ID_MAPPER] = actNodeId;
		
		return rowAction;
	},
	//eo createRowAction

	/**
	 * Returns action toolbar.
	 * @return {Ext.Toolbar} action toolbar
	 */
	getActionToolBar : function() {
		return this.getTopToolbar().getComponent('actions'); 
	},
	
	/**
	 * Creates actions toolbar.
	 * @protected
	 * @return {Object} actions {@link Ext.Toolbar} init object 
	 */
	createActions : function() {
		var actions = {
    		itemId: 'actions',
        	items: [
        	'->',
        	{
        		itemId: 'expanded-view',
        		text: 'Expanded View',
        		iconCls: 'icon-application-split'
        	},{
        		itemId: 'more',
    			text: 'More Actions',
				menu: {
					items: [
					{
						itemId: 'exports',
						text: 'Exports',
						iconCls: 'icon-database-save'
					},{
						itemId: 'sel-all',
						text: 'Select All'
					},{
						itemId: 'desel-all',
						text: 'Deselect All'
					}]
				}
        	}]
		};
		
		var moreAct = actions.items[2];
		
		//i:actions
		var act = this.getActions();
		if (!Ext.isEmpty(act)) {
			var alen = act.length
			for (var i = alen -1; i >= 0; i--) {
				actions.items.unshift(
					this.createAction(act[i])
				);
			}
		}
		
		//i:moreactions
		act = this.getMoreActions();
		if (!Ext.isEmpty(act)) {
			Ext.iterate(act, function(a) {
				moreAct.menu.items.push(
					this.createMoreAction(a)
				);
			}, this);
		}
		
		return actions;
	},
	//eo createActions
	
	/**
	 * @protected
	 * @param {Object} a The action definition
	 * @return {Object}
	 */
	createActionObj : function(a) {
		var action = {
			name: a.name,
			text: a.text ? a.text : a.name,
			iconCls: a.iconCls,
			icon: a.icon,
			tooltip: a.tooltip,
			style: a.style
		};			
		//add model node mapping
		action[this.NODE_ID_MAPPER] = a[this.NODE_ID_MAPPER];
		
		return action;
	},
	
	/**
	 * Creates action.
	 * @protected
	 * @param {Object} act The action definition object.
	 * @return {Object} action init object 
	 */
	createAction : function(act) {
		var actNodeId = act[this.NODE_ID_MAPPER];
		this.mapCmpToModel(actNodeId, this.createMapper(this.actionMapper, actNodeId));
		
		return this.createActionObj(act);		
	},
	//eo createIAction
	
	/**
	 * Creates more-action.
	 * @protected
	 * @param {Object} act The action definition object.
	 * @return {Object} action init object 
	 */
	createMoreAction : function(act) {
		var actNodeId = act[this.NODE_ID_MAPPER];
		this.mapCmpToModel(actNodeId, this.createMapper(this.moreActionMapper, actNodeId));
		
		return this.createActionObj(act);		
	},
	//eo createMoreAction
	
	createDescription : function() {
		var dsc = {
    		itemId: 'desc',
    		hidden: true,
        	items: {
        		xtype: 'tbtext',
        		style: 'white-space: normal;',
        		text: ''
        	}
		};
		
		var v =	this.NODE_VALUE_MAPPER,
			mpr = this.NODE_ID_MAPPER,
			nodes = this.NODES;
			
		var dn = this.getModelNodeByPath(nodes.DESCRIPTION);
		
		if (dn) {
			var descData = this.getModelNodeValue(dn);
			if (descData[v]) {
				dsc.hidden = false;
				dsc.items.text = descData[v]; 			
			}
			this.mapCmpToModel(descData[mpr], this.createMapper(function(){
				return this.getTopToolbar().getComponent('desc');
			}));
			dsc[mpr] = descData[mpr];
		}
		
		
		return dsc;
	},
	
	/**
	 * Clearing resources.
	 * @private
	 */
    onDestroy : function() {
        afStudio.wd.list.ListView.superclass.onDestroy.call(this);
        
		this.modelMapper = null;        
    }	
});

//@mixin ModelMapper
//important applyIf is used to have ability to use/override custom mapping/unmapping methods in the class
Ext.applyIf(afStudio.wd.list.ListView.prototype, afStudio.wd.ModelMapper);

//@mixin ListModelInterface
Ext.apply(afStudio.wd.list.ListView.prototype, afStudio.wd.list.ListModelInterface);

//@mixin ListModelReflector
Ext.apply(afStudio.wd.list.ListView.prototype, afStudio.wd.list.ListModelReflector);

/**
 * @type 'wd.listView'
 */
Ext.reg('wd.listView', afStudio.wd.list.ListView);