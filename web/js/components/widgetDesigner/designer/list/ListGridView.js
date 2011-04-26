Ext.ns('afStudio.wd.list');

/**
 * ListGridView.
 * 
 * @class afStudio.wd.list.ListGridView
 * @extends Ext.grid.GridView
 * @author Nikolai
 */
afStudio.wd.list.ListGridView = Ext.extend(Ext.grid.GridView, {

	/**
	 * @cfg {String} invalidColumnName (defaults to )
	 * Invalid column name text.
	 */	 
	invalidColumnName : 'Column name must contain only characters, digits or "_" and start from character or "_"'	 
    
	/**
	 * @override
	 *  
     * @private
     * Click handler for the shared column dropdown menu, called on beforeshow. Builds the menu
     * which displays the list of columns for the user to show or hide.
	 */
    ,beforeColMenuShow : function() {        
        var colModel = this.cm,
            colCount = colModel.getColumnCount(),
            colMenu  = this.colMenu,
            i;

        colMenu.removeAll();

        for (i = 0; i < colCount; i++) {
            if (colModel.config[i].hideable !== false && !colModel.config[i].uninit) {
                colMenu.add(new Ext.menu.CheckItem({
                    text       : colModel.getColumnHeader(i),
                    itemId     : 'col-' + colModel.getColumnId(i),
                    checked    : !colModel.isHidden(i),
                    disabled   : colModel.config[i].hideable === false,
                    hideOnClick: false
                }));
            }
        }
    }//eo beforeColMenuShow
	
	/**
	 * @override
	 *  
     * @private
     * This is always intended to be called after renderUI. Sets up listeners on the UI elements
     * and sets up options like column menus, moving and resizing.
	 */
	,afterRenderUI : function() {
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
            this.columnDrag = new Ext.grid.GridView.ColumnDragZone(grid, this.innerHd);
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
			        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);
			    }
			});
			
			this.colMenu = new Ext.menu.Menu({id:grid.id + "-hcols-menu"});
			this.colMenu.on({
				scope: this,
				beforeshow: this.beforeColMenuShow,
				itemclick: this.handleColumnMenuClick
			});
			
			this.hmenu.add(
				{itemId: "addClmBefore", text: 'Add Column Before'},
				{itemId: "addClmAfter", text: 'Add Column After'},
				{itemId: "renameClm", text: 'Rename Column'},				
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
	}//eo afterRenderUI
	
	/**
	 * Attached as the 'itemclick' handler to the header's column submenu (if available).
	 * @private
	 * 
	 * @param {Ext.menu.Item} item The menu item being clicked.
	 * @return {Boolean}
	 */
	,handleColumnMenuClick : function(item) {
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
	}//eo handleColumnMenuClick
	
	/**
	 * Returns first uninitialised column index.
	 * @private
	 * @return {Number} column index. 
	 */
	,getUninitColumn : function() {
		for (var i = 0; i < this.cm.config.length; i++) {
			var column = this.cm.config[i];
			if (column.uninit) {
				return i;
			}
		}
		
		return 0;
	}//eo getUninitColumn
	
	/**
     * @override
     *  
	 * @private
	 * Attached as the 'itemclick' handler to the header menu.
	 *  
	 * @param {Ext.menu.Item} item The menu item being clicked.
	 * @return {Boolean}
	 */
	,handleHdMenuClick : function(item) {
		var index = this.hdCtxIndex,			
			   cm = this.cm,
			   ds = this.ds,
		dataIndex = cm.getDataIndex(index);			   
			   
		switch (item.itemId) {				
			case 'addClmAfter':
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit = false;
				this.cm.moveColumn(_index, index + 1);
				this.cm.setHidden(index + 1, false);
			break;
				
			case 'addClmBefore' :
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit = false;
				this.cm.moveColumn(_index, index);
				this.cm.setHidden(index, false);
			break;							
				
			case 'renameClm':
				var hd = this.findHeaderCell(item.parentMenu._el);
				this.editHeadColumn(hd.firstChild, index);
			break;				
				
			case 'deleteClm':
				var visibleCount = cm.getColumnCount(true);
				if (visibleCount > 1) {
					cm.setHidden(index, true);
					cm.config[index].uninit = true;
					cm.config[index].header = this.grid.columnName;
				}
			break;
		}
		return true;
	}//eo handleHdMenuClick
	
	/**
	 * Starts edit the column. 
	 * @private
	 * 
	 * @param {HtmlElement} el
	 * @param {Number} index The column index
	 */
	,editHeadColumn : function(el, index) {
		var _this = this,
			headerName = this.cm.getColumnHeader(index);
		
		var ed = new Ext.grid.GridEditor(new Ext.form.TextField({
			allowBlank: false,
			maskRe: /[\w]/,
			validator: function(value) {
				return /^[^\d]\w*$/im.test(value) ? true : _this.invalidColumnName;					
			}
		}));
		
		ed._index = index;		
		ed.on('complete', this.onHeadColumnEditComplete, this); 
		ed.startEdit(el, headerName);
	}//eo editHeadColumn
	
	/**
	 * Header column <u>complete</u> event listener
	 * @param {Ext.Editor} ed The editor
	 * @param {Mixed} v The current field value
	 * @param {Mixed} sv The original field value
	 */
	,onHeadColumnEditComplete : function(ed, v, sv) {
		var index = ed._index,
			 grid = this.grid,
			   cm = this.cm;

		if (v != sv) {
			cm.setColumnHeader(index, v);
			grid.fireEvent('changeColumnLabel', cm.config[index], index, v);
		}
	}//eo onHeadColumnEditComplete	
	
    /**
     * @override
     * 
     * @private
     * Called when a header cell is clicked - shows the menu if the click happened over a trigger button
     * 
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     */	
	,handleHdDown : function(e, t) {
       var colModel  = this.cm,
           hd        = this.findHeaderCell(t),
           index     = this.getCellIndex(hd),
           sortable  = colModel.isSortable(index),
           menu      = this.hmenu,
           menuItems = menu.items,
           menuCls   = this.headerMenuOpenCls;
		
            		
		if (Ext.fly(t).hasClass('x-grid3-hd-btn')) {
			e.stopEvent();
			
			Ext.fly(hd).addClass(menuCls);
			
			this.hdCtxIndex = index;
			
	        menu.on('hide', function() {
	            Ext.fly(hd).removeClass(menuCls);
	        }, this, {single:true});
	        
	        menu.show(t, 'tl-bl?');
	        
		} else {
			//Start header editing 
			this.editHeadColumn(hd.firstChild, index);
		}
	}//eo handleHdDown
	
});