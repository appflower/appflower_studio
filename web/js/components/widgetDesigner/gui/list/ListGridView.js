Ext.ns('afStudio.wd.list');

/**
 * ListGridView.
 * 
 * @class afStudio.wd.list.ListGridView
 * @extends Ext.grid.GridView
 * @author Nikolai Babinski
 */
afStudio.wd.list.ListGridView = Ext.extend(Ext.grid.GridView, {
    
	/**
     * Click handler for the shared column dropdown menu, called on beforeshow. Builds the menu
     * which displays the list of columns for the user to show or hide.
	 * @override
     * @private
	 */
    beforeColMenuShow : function() {
        var colModel = this.cm,
            colCount = colModel.getColumnCount(),
            colMenu  = this.colMenu,
            i;

        colMenu.removeAll();
        
        for (i = 0; i < colCount; i++) {
        	var clm = colModel.config[i];
            if (clm.hideable !== false && clm.xtype != 'listactioncolumn') {
                colMenu.add(new Ext.menu.CheckItem({
                    text       : colModel.getColumnHeader(i),
                    itemId     : 'col-' + colModel.getColumnId(i),
                    checked    : !colModel.isHidden(i),
                    disabled   : colModel.config[i].hideable === false,
                    hideOnClick: false
                }));
            }
        }
    },
    //eo beforeColMenuShow
	
	/**
     * This is always intended to be called after renderUI. Sets up listeners on the UI elements
     * and sets up options like column menus, moving and resizing.
	 * @override
     * @private
	 */
	afterRenderUI : function() {
		var grid = this.grid;
		
        this.initElements();

        // get mousedowns early
        Ext.fly(this.innerHd).on('click', this.handleHdDown, this);

        this.mainHd.on({
            scope    : this,
            mouseover: this.handleHdOver,
            mouseout : this.handleHdOut,
            mousemove: this.handleHdMove
        });

        this.scroller.on('scroll', this.syncScroll,  this);
        
        if (grid.enableColumnResize !== false) {
            this.splitZone = new Ext.grid.GridView.SplitDragZone(grid, this.mainHd.dom);
        }

        if (grid.enableColumnMove) {
            this.columnDrag = new afStudio.wd.list.ListGridView.ColumnDragZone(grid, this.innerHd);            
            this.columnDrop = new Ext.grid.HeaderDropZone(grid, this.mainHd.dom);
        }
        
        //configure header menu
        if (grid.enableHdMenu !== false) {
        	
			this.hmenu = new Ext.menu.Menu({
				id: grid.id + "-hctx",
				
				show: function(el, pos, parentMenu) {
			        this.parentMenu = parentMenu;
			        if (!this.el) {
			            this.render();
			        }
			        this.fireEvent("beforeshow", this);
			        this._el = el;
			        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign, this.defaultOffsets), parentMenu);
			    }
			});
			
			this.colMenu = new Ext.menu.Menu({id: grid.id + "-hcols-menu"});
			this.colMenu.on({
				scope: this,
				beforeshow: this.beforeColMenuShow,
				itemclick: this.handleColumnMenuClick
			});
			
			this.hmenu.add(
				{itemId: 'renameClm', text: 'Rename Column'},				
				{itemId: 'deleteClm', text: 'Delete Column'},
				'-',
				{
                    itemId: "columns",
                    text: this.columnsText,
                    menu: this.colMenu,
                    hideOnClick: false,
                    iconCls: 'x-cols-icon'
				}
			);
			this.hmenu.on("itemclick", this.handleHdMenuClick, this);
		}
		
        if (grid.trackMouseOver) {
            this.mainBody.on({
                scope    : this,
                mouseover: this.onRowOver,
                mouseout : this.onRowOut
            });
        }

        if (grid.enableDragDrop || grid.enableDrag) {
            this.dragZone = new Ext.grid.GridDragZone(grid, {
                ddGroup : grid.ddGroup || 'GridDD'
            });
        }

        this.updateHeaderSortState();
	},
	//eo afterRenderUI
	
	/**
	 * Attached as the 'itemclick' handler to the header's column submenu (if available).
	 * @private
	 * @param {Ext.menu.Item} item The menu item being clicked.
	 * @return {Boolean}
	 */
	handleColumnMenuClick : function(item) {
		var index = this.hdCtxIndex,
			   cm = this.cm, 
			   ds = this.ds;
			   
	    index = cm.getIndexById(item.itemId.substr(4));	    
	    if (index != -1) {
	        if (item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1) {
	            this.onDenyColumnHide();
	            return false;
	        }
	        cm.setHidden(index, item.checked);
	    }
	    
		return true;
	},
	//eo handleColumnMenuClick
	
	/**
	 * Attached as the 'itemclick' handler to the header menu.
     * @override
	 * @private
	 * @param {Ext.menu.Item} item The menu item being clicked.
	 * @return {Boolean}
	 */
	handleHdMenuClick : function(item) {
		var index = this.hdCtxIndex,
			   cm = this.cm,
			   ds = this.ds,
		dataIndex = cm.getDataIndex(index);
			   
		switch (item.itemId) {
			case 'renameClm':
				var hd = this.findHeaderCell(item.parentMenu._el);
				this.editHeader(hd.firstChild, index);
			break;				
				
			case 'deleteClm':
				var clm = cm.config[index];
				this.grid.removeColumn(clm);
			break;
		}
		return true;
	},
	//eo handleHdMenuClick
	
	/**
	 * Starts edit the column.
	 * @private
	 * @param {HtmlElement} el
	 * @param {Number} index The column index
	 */
	editHeader : function(el, index) {
		var grid = this.grid,
			cm = this.cm,
			clm = cm.config[index],
			header = cm.getColumnHeader(index);
		
		var node = grid.getModelByCmp(clm),
			fld = grid.getPropertyEditor(node, 'label'),		
			ed = new Ext.grid.GridEditor(fld);
		
		ed._node = node;
		ed.on('complete', this.onHeaderEditComplete, this); 
		ed.startEdit(el, header);
	},
	//eo editHeader
	
	/**
	 * Header editor <u>complete</u> event listener
	 * @param {Ext.Editor} ed The editor
	 * @param {Mixed} v The current field value
	 * @param {Mixed} sv The original field value
	 */
	onHeaderEditComplete : function(ed, v, sv) {
		var node = ed._node;
		if (v != sv) {
			node.setProperty('label', v);
		}
	},
	//eo onHeaderEditComplete	
	
    /**
     * Called when a header cell is clicked - shows the menu if the click happened over a trigger button
     * @override
     * @private
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     */	
	handleHdDown : function(e, t) {
       var colModel  = this.cm,
           hd        = this.findHeaderCell(t),
           index     = this.getCellIndex(hd),
           menu      = this.hmenu,
           menuItems = menu.items,
           menuCls   = this.headerMenuOpenCls;
		
            		
		if (Ext.fly(t).hasClass('x-grid3-hd-btn')) {
			e.stopEvent();
			
			Ext.fly(hd).addClass(menuCls);
			
			this.hdCtxIndex = index;
			
	        menu.on('hide', function() {
	            Ext.fly(hd).removeClass(menuCls);
	        }, this, {single: true});
	        
	        menu.show(t, 'tl-bl?');
	        
		} else {
			if (index !== false) {
				var clmId  = this.cm.getColumnId(index);
				if (Ext.isDefined(clmId)) {			
					var clm = this.cm.getColumnById(clmId);
					//checkbox selection model column and rowactions column are not editable 
					if (clmId == 'checker' || clm.xtype == 'listactioncolumn') {
						return false;
					}
				}
				this.editHeader(hd.firstChild, index);
			}
		}
	}
	//eo handleHdDown
});

/**
 * ColumnDragZone is responsible for dragging List View columns.
 * @class afStudio.wd.list.ListGridView.ColumnDragZone
 * @extends Ext.grid.GridView.ColumnDragZone
 * @author Nikolai
 */
afStudio.wd.list.ListGridView.ColumnDragZone = Ext.extend(Ext.grid.GridView.ColumnDragZone, {
    /**
     * Before drag event handler.
     * For more information look at {@link Ext.dd.DragZone#onBeforeDrag} 
     * @param {Object} data An object containing arbitrary data to be shared with drop targets
     * @param {Event} e The event object
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     */	
   	onBeforeDrag : function(data, e) {
		var cm    = this.view.cm,
			index = this.view.findCellIndex(data.header),
			clmId = index !== false ? cm.getColumnId(index) : null;
		
		if (Ext.isDefined(clmId)) {
			var clm = cm.getColumnById(clmId);			
			//checker {@link Ext.grid.CheckboxSelectionModel} and actions column should not be draggable 
			if (clmId == 'checker' || clm.xtype == 'listactioncolumn') {
				return false;
			}
		}
        
        return true;
	}//eo onBeforeDrag
	
	/**
	 * Before the dragged item is dropped onto the target and optionally cancel the onDragDrop.
	 * For more information look at {@link Ext.dd.DragZone#beforeDragDrop}
     * @param {Ext.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag drop event is valid, else false to cancel
	 */
	,beforeDragDrop : function(target, e, id) {		
		var cm     = this.view.cm,
			data = this.getDragData(e),
			index  = this.view.findCellIndex(data.header),
			clmId  = index !== false ? cm.getColumnId(index) : undefined;
		
		if (Ext.isDefined(clmId)) {			
			var clm = cm.getColumnById(clmId);
			//The others columns shouldn't be drop onto checker {@link Ext.grid.CheckboxSelectionModel}
			//and actions columns
			if (clmId == 'checker' || clm.xtype == 'listactioncolumn') {
				this.onInvalidDrop(target, e, id);
				return false;
			}
		}
		
		return true;
	}//eo beforeDragDrop
});