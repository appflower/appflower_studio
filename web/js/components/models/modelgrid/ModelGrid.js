Ext.ns('afStudio.models');

//TODO should get rid of overrides in almost all situations where extending can be used
Ext.override(Ext.form.Field,{
    initEvents : function(){
        this.mon(this.el, Ext.EventManager.getKeyEvent(), this.fireKey,  this);
        this.mon(this.el, 'focus', this.onFocus, this);

        // standardise buffer across all browsers + OS-es for consistent event order.
        // (the 10ms buffer for Editors fixes a weird FF/Win editor issue when changing OS window focus)
        this.mon(this.el, 'blur', this.onBlur, this, this.inEditor ? {buffer:10} : null);
    }
});

/**
 * @class afStudio.models.modelGridView
 * @extends Ext.grid.GridView
 */
afStudio.models.modelGridView = Ext.extend(Ext.grid.GridView, {
	
	/**
	 * @override
	 */
    beforeColMenuShow : function() {
        var cm       = this.cm,  
        	colCount = cm.getColumnCount();
        	
        this.colMenu.removeAll();
        
        for (var i = 0; i < colCount; i++) {
            if (cm.config[i].fixed !== true && cm.config[i].hideable !== false && !cm.config[i].uninit) {
                this.colMenu.add(new Ext.menu.CheckItem({
                    itemId: "col-" + cm.getColumnId(i),
                    text: cm.getColumnHeader(i),
                    checked: !cm.isHidden(i),
                    hideOnClick: false,
                    disabled: cm.config[i].hideable === false
                }));
            }
        }
    },
    //eo beforeColMenuShow
    
	/**
	 * @override
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
            this.columnDrag = new Ext.grid.GridView.ColumnDragZone(grid, this.innerHd);
            this.columnDrop = new Ext.grid.HeaderDropZone(grid, this.mainHd.dom);
        }
        
        var g = grid;
        
        if (g.enableHdMenu !== false) {
			this.hmenu = new Ext.menu.Menu({
				id: g.id + "-hctx",
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
			
			/*
			this.changetoMenu = new Ext.menu.Menu({
				id: g.id + "-hchangeto-menu",
				defaults: {
					xtype: 'menucheckitem',
					group: 'type'
				},
				items:[
					{itemId: "ctext",	     text: 'Text', checked: true},
					{itemId: "ccheckbox",	 text: 'Checkbox'},
					{itemId: "ccurrency",	 text: 'Currency'},
					{itemId: "cdate",		 text: 'Date'},
					{itemId: "cemail",		 text: 'Email Address'},
					{itemId: "cnumber",		 text: 'Number'},
					{itemId: "cpassword",	 text: 'Password'},					
					{itemId: "cphonenumber", text: 'Phone Number'},
					{itemId: "crate",		 text: 'Rate'},
					{itemId: "crelation",	 text: 'Relation'},
					{itemId: "cchoice", 	 text: 'Select'},
					{itemId: "ctime",		 text: 'Time'}
				]
			});
			this.changetoMenu.on({
				scope: this,
				itemclick: this.handleHdMenuClick
			});
			*/
			
			this.colMenu = new Ext.menu.Menu({id:g.id + "-hcols-menu"});
			this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
			this.colMenu.on("itemclick", this.columnMenuClick, this);
			
			this.hmenu.add(
				{itemId: "asc",  text: this.sortAscText, cls: "xg-hmenu-sort-asc"},
				{itemId: "desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc"},
				'-',
				{itemId: "addfb", text: 'Add Field Before'},
				{itemId: "addfa", text: 'Add Field After'},
				'-',
				{itemId: "dupb",    text: 'Duplicate Field'},
				{itemId: "editb",   text: 'Edit Field'},
				{itemId: "renameb", text: 'Rename Field'},				
				{itemId: 'deletef', text: 'Delete Field'},
				'-',
				//{itemId:"changeto", text: 'Change to', menu:this.changetoMenu},
				{
                    itemId:"columns",
                    hideOnClick: false,
                    text: this.columnsText,
                    menu: this.colMenu,
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
	
	columnMenuClick : function(item) {		
		var index = this.hdCtxIndex,
			   cm = this.cm, 
			   ds = this.ds;
			   
	    index = cm.getIndexById(item.itemId.substr(4));	    
	    if (index != -1) {
	        if (item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 2 ) {
	            this.onDenyColumnHide();
	            return false;
	        }
	        cm.setHidden(index, item.checked);
	    }
		return true;
	},
	
	getUninitColumn : function() {
		for (var i = 0; i < this.cm.config.length; i++) {
			var column = this.cm.config[i];
			if (column.uninit) {
				return i;
			}
		}
		return 0;
	},
	
	createDupheader : function(header) {
		for (var i = 1; i <= this.cm.config.length; i++) {
			var h = header + i;
			var flag = true;
			for (var j = 0; j < this.cm.config.length; j++) {
				if (h == this.cm.getColumnHeader(j)) {
					flag = false;
					break;
				}
			}
			if (flag) {
				return h;
			}
		}
		return header + (this.cm.config + 1);
	},
	
	handleHdMenuClick : function(item) {
		var index = this.hdCtxIndex,
			   cm = this.cm, 
			   ds = this.ds;
			   
		switch (item.itemId) {
			case "asc":
				ds.sort(cm.getDataIndex(index), "ASC");
				break;
				
			case "desc":
				ds.sort(cm.getDataIndex(index), "DESC");
				break;
				
			case 'addfa':
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit = false;
				this.cm.moveColumn(_index, index + 1);
				this.cm.setHidden(index + 1, false);
				break;
				
			case 'addfb' :
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit = false;
				this.cm.moveColumn(_index, index);
				this.cm.setHidden(index, false);
				break;
				
			case 'dupb':
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit = false;
				this.cm.moveColumn(_index, index + 1);
				var header = this.cm.getColumnHeader(index);
				this.cm.setColumnHeader(index + 1, this.createDupheader(header));
				this.cm.setHidden(index + 1, false);
				break;
				
			case 'renameb':
				var hd = this.findHeaderCell(item.parentMenu._el);
				this.editHeadColumn(hd.firstChild, index);
				break;
				
			case 'editb':
				var fd = cm.config[index].fieldDefinition || {};
				if (!item.renameWindow) {
					item.renameWindow = new afStudio.models.EditFieldWindow({
						gridView: this
					});
				}				
				item.renameWindow.fieldDefinition = fd;
				item.renameWindow.fieldIndex = index;
				item.renameWindow.show(item.el);				
				break;
				
			case 'deletef':
				var visibleCount = cm.getColumnCount(true);
				if (visibleCount > 2) {
					cm.setHidden(index, true);
					cm.setColumnHeader(index, this.grid.defautHeaderTitle);
					cm.setEditor(index, null);
					cm.config[index].uninit = true;
					cm.config[index].fieldDefinition.exists = false;
				}
				break;
				
			case 'ctext':
				var editor = this.grid.createEditer();
				cm.config[index].editor = editor;
				break;
				
			case 'ccheckbox':
				var editor = this.grid.createEditer(new Ext.form.Checkbox());
				cm.config[index].editor = editor;
				break;
				
			case 'cchoice':
				var editor = this.grid.createEditer(
					new Ext.form.ComboBox({
						typeAhead: true,
						triggerAction: 'all',
						lazyRender:true,
						mode: 'local',
						valueField:'field',
						displayField:'field',
						store:  new Ext.data.ArrayStore({
					        fields: [ 'field'],
					        data: []
						})
					}));
				editor.on('beforestartedit', function(editor, el, value) {
					var cstore = editor.field.store;
					var store = this.grid.store;
					cstore.removeAll();
					var rs = [];
					for(var i=0;i<store.getCount();i++){
						var record = store.getAt(i);
						var value = record.get(cm.getDataIndex(index));
						if(value=="" || value==null)continue;
						var flag=true;
						for(var j=0;j<rs.length;j++){
							if(rs[j][0]==value){
								flag = false;
								break;
							}
						}
						if(flag){
							rs.push([value]);
						}
					}
					cstore.loadData(rs);
					//editor.field.store = cstore;
					return true;
				},this);
				cm.config[index].editor = editor;
				break;
				
			case 'cdate':
				var editor = this.grid.createEditer(new Ext.form.DateField());
				editor.getValue = function() {
					var v = this.field.getValue();
					return v.format("m/d/Y");
				}
				cm.config[index].editor = editor;
				break;
				
			case 'cpassword':
				var editor = this.grid.createEditer(new Ext.form.TextField({inputType : 'password'}));
				cm.config[index].editor = editor;
				cm.config[index].renderer = function(v) {
					return "XXXX";
				}
				break;
				
			case 'cnumber':
				var editor=this.grid.createEditer(new Ext.form.NumberField());
				cm.config[index].align = "right";
				cm.config[index].editor = editor;
				break; 
				
			case 'ccurrency':
				var editor=this.grid.createEditer(new Ext.form.NumberField());
				cm.config[index].editor = editor;
				cm.config[index].align = "right";
				cm.config[index].renderer = Ext.util.Format['usMoney'];
				break; 
			
			case 'ctime':
				var editor = this.grid.createEditer(new Ext.form.TimeField());
				cm.config[index].editor = editor;
				break;
				
			case 'cemail':
				var editor = this.grid.createEditer(
						new Ext.form.TextField({vtype:'email' })
					);
				cm.config[index].editor = editor;
				break;
				
			case 'cphonenumber':
				var editor = this.grid.createEditer(new Ext.form.NumberField({maxLength:12}));
				cm.config[index].editor = editor;
				break;
				
			case 'crate':
				var editor = this.grid.createEditer(new Ext.form.SliderField({
					minValue:0,maxValue:5
				}));
				cm.config[index].editor = editor;
				break;
		}
		
		return true;
	},
	//eo handleHdMenuClick

	showNextColumn : function(index) {
		var cm = this.cm;
		if (index <= this.grid.maxColumns) {
			cm.setHidden(index + 1, false);
			cm.config[index + 1].uninit = false;
		}
	},
	
	headEditComplete : function(ed, v, sv) {
		var index = ed._index,
			   cm = this.cm;
		
		if (v != sv) {
			cm.setColumnHeader(index, v);
			var fd = cm.config[index].fieldDefinition;
			if (fd) {
				fd.name = v;
				if (!fd.exists) {
					cm.setEditor(index, afStudio.models.TypeBuilder.createEditor('varchar'));
					fd.exists = true;
				}
			}			
		}
	},
	
	editHeadColumn : function(el, index) {
		var ed = new Ext.grid.GridEditor(new Ext.form.TextField({
			allowBlank: false,
			maskRe: /[\w]/,
			validator: function(value) {
				return /^[^\d]\w*$/im.test(value) ? true : afStudio.models.TypeBuilder.invalidFieldName;					
			}
		}));
		ed._index = index;
		ed.on({
			scope: this,
			complete: this.headEditComplete
		});
		ed.startEdit(el,  this.cm.getColumnHeader(index));
		var showFlag = true;
		for (var i = index + 1; i < this.grid.maxColumns; i++) {
			if (!this.cm.isHidden(i)) {
				showFlag = false;
				break;
			}
		}
		if (showFlag) {
			this.showNextColumn(index);
		}
	},
	
	handleHdDown : function(e, t) {		
		var hd = this.findHeaderCell(t);
		if (!hd) {
			return;
		}
		var index = this.getCellIndex(hd);
		if (Ext.fly(t).hasClass('x-grid3-hd-btn')) {
			e.stopEvent();
			Ext.fly(hd).addClass('x-grid3-hd-menu-open');
			this.hdCtxIndex = index;
			var ms = this.hmenu.items, 
				cm = this.cm;
			//ms.get("asc").setDisabled(!cm.isSortable(index));
			//ms.get("desc").setDisabled(!cm.isSortable(index));
			this.hmenu.on("hide", function(){
				Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
			}, this, {single: true});
			this.hmenu.show(t, "tl-bl?");
		} else {
			this.editHeadColumn(hd.firstChild, index);
		}
	}
	
});
//eo afStudio.models.modelGridView

/**
 * Excel grid class define 
 * @class afStudio.models.ExcelGridPanel
 * @extends Ext.grid.EditorGridPanel
 */
afStudio.models.ExcelGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {

	/**
	 * @cfg {Number} maxColumns The maximum number of fields a model can have (defaults to 20).
	 */
	maxColumns: 50,
	/**
	 * @cfg {String} defautHeaderTitle The header title text (defaults to "NewField").
	 */
	defautHeaderTitle: 'NewField',
	
    autoScroll: true,
    
	columnLines: true,
	
    clicksToEdit: 1,	        
	
	/**
	 * Creates editor.
	 * @private
	 * @param {String|Ext.form.Field} fld The field being used to create editor. Accepts as xtype as well as field object. 
	 * @return {Ext.grid.GridEditor} editor
	 */
	createEditer : function(fld) {
		var f = fld ? fld : new Ext.form.TextField();
		
		return new Ext.grid.GridEditor(f);
	},
	
	/**
	 * @protected
	 */
	beforeInit : function() {
		var columns = [new Ext.grid.RowNumberer()],
			fields  = [];
		
		for (var i = 0; i < this.maxColumns; i++) {
			var hidden = true;
			
			if (i == 0) {
				hidden = false;
			}
			
			columns.push({
				header: this.defautHeaderTitle,
				dataIndex: 'c' + i,
				width: 80,
				hidden: hidden,
				uninit: hidden,
				editor: this.createEditer()
			});
			
			fields.push({name: 'c' + i});
		}
		
		var cm = this.columns ? new Ext.grid.ColumnModel(this.columns)
							  : new Ext.grid.ColumnModel(columns);
	 
		var store;
		if (this.store) {
			store = this.store;
			//adds one empty record if we have no data
			if (this.store.getCount() == 0) {
				var rec = this.store.recordType;
				this.store.add([new rec()]);		
			}
		} else {
			store = new Ext.data.SimpleStore({
				fields: fields,
				data: [['']]
			});
		}
		
		var sm = new Ext.grid.CellSelectionModel({
			/**
			 * @override
			 */
		    onEditorKey: function(field, e){
		        if(e.getKey() == e.TAB){
		            this.handleKeyDown(e);
		        }
		        
		        if (e.getKey() == e.ENTER) {
			        var g = this.grid, 
			            last = g.lastEdit,
			            ed = g.activeEditor,
				        shift = e.shiftKey,
				        newCell,
			            ae, last, r, c;
			            
	                if (shift) {
	                    newCell = g.walkCells(last.row - 1, last.col, -1, this.acceptsNav, this);
	                } else {
	                    newCell = g.walkCells(last.row + 1, last.col, 1, this.acceptsNav, this);
	                }
			            
			        if (newCell) {
			            r = newCell[0];
			            c = newCell[1];
			
			            if (g.isEditor && g.editing) {
			                ae = g.activeEditor;
			                if (ae && ae.field.triggerBlur){
			                    ae.field.triggerBlur();
			                }
			            }
			            g.startEditing(r, c);
			        }
		        }
		    }
		});
		
		var config = {		
	        store: store,
	        cm: cm,
	        selModel: sm,
	        view: new afStudio.models.modelGridView()
		};
			
		Ext.apply(this, 
			Ext.apply(this.initialConfig, config)
		);
	},
	
	/**
	 * @protected
	 */
	afterInit: function() {
		
		this.on({
			scope: this,
			
			afteredit: function(e) {
				var row     = e.row + 1,
					column  = e.column,
					ds = this.store,
					count   = ds.getCount();
				
				//adds empty record everytime when was updated the last record in the grid	
				if (count == row) {
					ds.add([new ds.recordType()]);
				}
				
				//adds new column everytime when was updated the last column's record in the grid
				if (this.getColumnModel().getColumnCount(true) == (column + 1) 
					&& column < this.maxColumns) {
					this.getView().showNextColumn(column);
				}
			}
		});
	},
	
	/**
	 * Ext template method.
	 * @override
	 * @private
	 */
	initComponent : function() {
		this.beforeInit();
		
		afStudio.models.ExcelGridPanel.superclass.initComponent.apply(this, arguments);
		
		this.afterInit();
	}
});
//eo afStudio.models.ExcelGridPanel

/**
 * ModelGrid
 * @class afStudio.models.ModelGrid
 * @extends afStudio.models.ExcelGridPanel
 */
afStudio.models.ModelGrid = Ext.extend(afStudio.models.ExcelGridPanel, {
	
	/**
	 * @cfg {String} (required) model The model name
	 */
	
	/**
	 * @cfg {String} (required) schema The schema path
	 */
	
	/**
	 * @cfg {Object} (required) _data The model's fields definition object
	 */
	
	/**
	 * @cfg {Number} (required) recordsPerPage The number of displaying records per page (defaults to 25).
	 */
	recordsPerPage : 25,
	
	/**
	 * Creates an uninitialised column.
	 * @private
	 * @param {Number} index The column index
	 * @return {Object} column
	 */
	createUninitColumn : function(index) {
		var defHeader = this.defautHeaderTitle;
		
		return {
			header: defHeader,
			dataIndex: 'c' + index,
			uninit: true,
			width: 80,
			hidden: index == 0 ? false : true,
			//data type is not specified thus it is not possible to add field's data before it will be created
			editor: afStudio.models.TypeBuilder.createEditor(),
			fieldDefinition: {
				name: defHeader,
				type: 'varchar',
				exists: false
			}
		};
	},
	
	/**
	 * @protected
	 */
	beforeInit : function() {
		var me = this,
			data = me._data.data,
		   	fields = ['id'],
			modelStructureExists = !Ext.isEmpty(data),
			columns = [new Ext.grid.RowNumberer()];
		
		//real fields structure	
		if (data.length > 0) {
			Ext.each(data, function(f, i) {
				var clm = {
					header: f.name,
					dataIndex: 'c' + i,
					width: 80,
					hidden: false,
					renderer: afStudio.models.TypeBuilder.createRenderer(f.type),
					//custom property used with {@link afStudio.models.EditFieldWindow} field editor
					fieldDefinition: Ext.apply(f, {exists: true})
				};
				if (!f.autoIncrement) {
					clm.editor = afStudio.models.TypeBuilder.createEditor(f.type, f.size, f['default']);
				}
				columns.push(clm);
				fields.push({name: 'c' + i});
			});
		}
		
		for (var i = columns.length - 1; i <= this.maxColumns; i++) {
			columns.push(this.createUninitColumn(i));				
			fields.push({name: 'c' + i});
		}
		//eo columns & fields building
		
		me.store = new afStudio.models.ModelStore({
			proxy: me.storeProxy,
			readerCfg: {
				fields: fields,
				idProperty: 'id'
			}
		});
		me.store.load({
			params: {
				start: 0, 
				limit: me.recordsPerPage
			}
		});
		
		me.columns = columns;		
		
		//call ancestor's method
		afStudio.models.ModelGrid.superclass.beforeInit.apply(this, arguments);
		
		var pagingBar = new Ext.PagingToolbar({
	        store: me.store,
	        displayInfo: true,	        
	        displayMsg: 'Displaying records {0} - {1} of {2}',
	        pageSize: me.recordsPerPage
    	});
		
		var config = {
			iconCls: 'icon-database-table',			
		    loadMask: true,
	        viewConfig: {
				forceFit: true
	        },			
	        //TODO Ext.ux.grid.DataDrop plugin affects on scolling inside the grid
	        //the problem should be researched and corrected.
	        //Now it is switched off.
	        //plugins: [Ext.ux.grid.DataDrop],
	        tbar: [
	        {
	            text: 'Save',
	            iconCls: 'icon-model-save',
	            scope: this,
	            handler: function(btn, ev) {	            	
	            	var cm    = this.getColumnModel(),
	            	    clms  = [];
	            	    
	            	Ext.iterate(cm.config, function(c) {
	            		if (c.id != 'numberer' && c.fieldDefinition.exists) {
	            			clms.push(c.fieldDefinition);
	            		}
	            	});
	            	
	            	if (clms.length) {
	            		var tbar = this.getTopToolbar();
	            		tbar.getComponent('insert').enable();
	            		tbar.getComponent('delete').enable();
	            	}
	            	
	            	afStudio.xhr.executeAction({
	            		url: afStudioWSUrls.modelListUrl,
						params: {
							xaction: 'alterModel',
							model: me.model,
							schema: me.schema,
							fields: Ext.encode(clms)
						},
	            		mask: {msg: String.format('Saving "{0}" model...', me.model), region:'center'},
	            		showNoteOnSuccess: false,
	            		logMessage: String.format('Model "{0}" was successfully saved.', me.model),
						scope: this,
						run: function(response) {
							this.fireEvent('alterfield');
			            	this.getStore().save();
						}
	            	});
	            }
	        },'-',{
	        	text: 'Create Widget',
	        	iconCls: 'icon-widgets-add',
	        	handler: function(btn, e) {
	        		var w = me.ownerCt.getCreateWidgetWindow();
	        		w.show();
	        	}
	        },'-',{	        	
            	text: 'Insert',
            	itemId: 'insert',
            	disabled: !modelStructureExists,
            	iconCls: 'icon-model-row-insert',
	            menu: {
	            	items: [
	            	{
	            		text: 'Insert after',
	            		scope: me,
			            handler: me.insertAfterField
	            	},{
	            		text: 'Insert before',
	            		scope: me,
			            handler: me.insertBeforeField
	            	}]
	            }	            
        	},'-',{
	            text: 'Delete',
	            itemId: 'delete',
	            disabled: !modelStructureExists,
	            iconCls: 'icon-model-row-delete',
	            scope: this,
	            handler: function(btn, ev) {
	            	var cell = this.getSelectionModel().getSelectedCell();			
	        	    if (cell) {
	        	    	var r = this.store.getAt(cell[0]);
	        	    	this.store.remove(r);
	        	    }
	            }
	        },'->',{
                text: 'Import',
                itemId: 'import',
                iconCls: 'icon-model-import',
                scope: this,
                handler: function(btn, ev) {
                    
                }
            }],
	        bbar: pagingBar
		};
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
	},
	//eo beforeInit
	
	/**
	 * @protected
	 */
	afterInit : function() {
		afStudio.models.ModelGrid.superclass.afterInit.apply(this, arguments);		
		
		this.addEvents(
			/**
			 * @event alterfield 
			 * Fires after the field was successfully altered.
			 */
			'alterfield',
			
			/**
			 * @event alterfieldexception 
			 * Fires if an error was happend during altering field.
			 * @param {Object} The XMLHttpRequest object containing the response data.
			 */
			'alterfieldexception',
			
			/**
			 * @event alterfieldfailure
			 * Fires if an error HTTP status was returned from the server during altering field.
			 * @param {Object} The XMLHttpRequest object containing the response data.
			 */
			'alterfieldfailure',
			
			'logmessage'
		);		
	},
	
	insertAfterField : function(b, e) {
		var me = this,		
    		cell = me.getSelectionModel().getSelectedCell(),
    		index = cell ? cell[0] + 1 : this.store.getCount(); 
    	
    	var u = new me.store.recordType({
            name: '',
            type: 'varchar',
            size: '11',
            required: false
        });
        me.stopEditing();
        me.store.insert(index, u);
		me.startEditing(index , cell ? cell[1] : 0);		
	},
	
	insertBeforeField : function() {
		var me = this,
    		cell = me.getSelectionModel().getSelectedCell(),
    		index = cell ? cell[0] : 0; 
    	
    	var u = new me.store.recordType({
            name: '',
            type: 'varchar',
            size: '11',
            required: false
        });
        me.stopEditing();
        me.store.insert(index, u);
        me.startEditing(index , cell ? cell[1] : 0);	
	}	
});
//eo afStudio.models.ModelGrid

Ext.reg('afStudio.models.modelGrid', afStudio.models.ModelGrid);