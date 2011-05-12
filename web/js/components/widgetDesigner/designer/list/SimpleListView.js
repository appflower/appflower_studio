Ext.ns('afStudio.wd.list');

/**
 * SimpleListView
 * 
 * @class afStudio.wd.list.SimpleListView
 * @extends Ext.grid.GridPanel
 * @author Nikolai
 */
afStudio.wd.list.SimpleListView = Ext.extend(Ext.grid.GridPanel, {
	
	/**
	 * @cfg {Object} viewMeta
	 * View metadata object.
	 */
	
	/**
	 * @cfg {String} columnName (defaults to "NewColumn")
	 * Default column name text. 
	 */
	columnName : 'newcolumn'	
	
	/**
	 * @cfg {Number} columnWidth (defaults to 80)
	 * Default column width.
	 */
	,columnWidth : 80
	
	/**
	 * @cfg {Number} maxColumns (defaults to 20)
	 * The number of maximum columns the view can handle. 
	 */
	,maxColumns : 30
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this,
			   vm = this.viewMeta,
		  columns = [];
		
		if (!Ext.isEmpty(vm['i:fields']['i:column'])) {
			var clm = vm['i:fields']['i:column'];
			
			if (Ext.isArray(clm)) {
				for (var i = 0; i < clm.length; i++) {
					var c = clm[i];
					columns.push({
						header:   c.label,
						name:     c.name,
						width:    c.width ? c.width : this.columnWidth,
						hidden:   c.hidden ? c.hidden.bool() : false,
						hideable: c.hideable ? c.hideable.bool() : true,
						fixed:    c.resizable ? !c.resizable.bool() : true
					});
				}
				for (var i = columns.length - 1; i < this.maxColumns; i++) {
					columns.push({
						header: this.columnName,
						width: this.columnWidth,
						hidden: true,
						fixed: true,
						uninit: true
					});
				}
				
			} else {
				columns.push({
					header:    clm.label,
					name:      clm.name,
					width:     clm.width ? clm.width : this.columnWidth,
					hidden:    clm.hidden ? clm.hidden.bool() : false,
					hideable:  clm.hideable ? clm.hideable.bool() : true,
					fixed:     clm.resizable ? !clm.resizable.bool() : true					
				});				
				for (var i = 1; i < this.maxColumns; i++) {
					columns.push({
						header: this.columnName,
						width: this.columnWidth,
						hidden: true,
						fixed: true,
						uninit: true
					});
				}				
			}
		}//eo columns

		var store = new Ext.data.ArrayStore({
			idIndex: 0,
			data: [[]],
			fields: []
		});
		
		//<i:actions>
		var iActions = {	        	
    		itemId: 'actions',
        	items: [        	
        	'->',
        	{
        		itemId: 'more',
    			text: 'More Actions',
				menu: {
					items: [
					{
						itemId: 'sel-all',
						text: 'Select All'
					},{
						itemId: 'desel-all',
						text: 'Deselect All'
					}]
				}        			
        	}]
		};		
		
		//<i:description>
		var iDescription = {
    		itemId: 'desc',
    		hidden: true,
        	items: {
        		xtype: 'tbtext',
        		style: 'white-space: normal;',
        		text: ''
        	}
		};
		if (vm['i:description'] && !Ext.isEmpty(Ext.util.Format.trim(vm['i:description']))) {
			iDescription.hidden = false;			
			iDescription.items.text = vm['i:description'];			
		}
		
		return {
			title: vm['i:title'],
	        store: store,      
			columns: columns,
	        view: new afStudio.wd.list.ListGridView(),
	        columnLines: true,
	        tbar: {
	        	xtype: 'container',
	        	defaults: {
	        		xtype: 'toolbar'
	        	},
	        	items: [iActions, iDescription]
	        },
	        bbar: {
	        	xtype: 'paging',
	        	hidden: Ext.isDefined(vm['i:fields'].pager) ? !(vm['i:fields'].pager.bool()) : false,
		        store: store,
		        displayInfo: true
	        }
		};		
	}//eo _beforeInitComponent	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wd.list.SimpleListView.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;		
		
		this.configureView();
		
		this.addEvents(
			/**
			 * @event 'changeColumnPosition' Fires when a column was moved from his previous position.
			 * @param {Ext.grid.Column} clm The column being moved.
			 * @param {Number} oldPos The column's previous(old) position.
			 * @param {Number} newPos The column's new position where it was moved.
			 */
			'changeColumnPosition',
			
			/**
			 * @event 'changeColumnLabel' Fires when a column's header was modified 
			 * @param {Ext.grid.Column} clm The column which header was modified.
			 * @param {Number} clmIndex The column index inside {@link Ext.grid.ColumnModel}.
			 * @param {String} value The header's new value.
			 */
			'changeColumnLabel',
			
			/**
			 * @event 'deleteColumn' Fires after a column was deleted
			 * @param {String} clmName The colomn <tt>name</tt> attribute
			 */
			'deleteColumn'
		);
		
		this.on({
			scope: _this,
			
			columnmove: _this.onColumnMove,
			
			contextmenu: function(e) {
				e.preventDefault();
			}
		});
	}//eo _afterInitComponent
	
	/**
	 * After construction view configuration 
	 */
	,configureView : function() {
		var vm = this.viewMeta,
		    bbar  = this.getTopToolbar(),
		    aBar  = bbar.getComponent('actions'),
		    aMore = aBar.getComponent('more');    
		
		//Actions    
		if (!Ext.isEmpty(vm['i:actions'])) {
			var act = vm['i:actions']['i:action'];
			//TODO add tooltip, icon, iconCls
			if (Ext.isArray(act)) {
				Ext.iterate(act, function(a, idx, array){	
					aBar.insertButton(0, {
						text: a.text ? a.text : a.name
					});
				});
			} else {				
				if (Ext.isDefined(act)) {
					aBar.insertButton(0, {
						text: act.text ? act.text : act.name
					});
				}
			}
		}
		
		//More Actions
		var moreActions = false;
		if (vm['i:fields']) {
			var selectable = vm['i:fields'].selectable ? vm['i:fields'].selectable.bool() : true;
			var exportable = vm['i:fields'].exportable ? vm['i:fields'].exportable.bool() : true;
			
			moreActions = selectable || exportable; 
			if (moreActions) {
				aMore.show();
			} else {
				aMore.hide();
			}
			
			if (selectable) {
				aMore.menu.getComponent('sel-all').enable();
				aMore.menu.getComponent('desel-all').enable();				
			} else {
				aMore.menu.getComponent('sel-all').disable();			
				aMore.menu.getComponent('desel-all').disable();				
			}
		}
		
		if (aBar.items.getCount() <= 2 && !moreActions) {
			aBar.hide();
		} else {
			aBar.show();	
		}
		//eo Actions
		
	}//eo configureView
	
	/**
	 * Handler of <u>columnmove</u> event.
	 * @param {Number} oldIndex
	 * @param {Number} newIndex
	 */
	,onColumnMove : function(oldIndex, newIndex) {
		if (oldIndex != newIndex) {
			var clm = this.getColumnModel().config[newIndex];
			this.fireEvent('changeColumnPosition', clm, oldIndex, newIndex);					
		}
	}//eo onColumnMove
});

/**
 * Adds Mixin ListMetaProcessor Class
 */
Ext.apply(afStudio.wd.list.SimpleListView.prototype, afStudio.wd.list.ListMetaProcessor);

/**
 * @type 'afStudio.wd.list.simpleListView'
 */
Ext.reg('afStudio.wd.list.simpleListView', afStudio.wd.list.SimpleListView);