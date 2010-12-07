Ext.ns('afStudio.models');

Ext.override(Ext.form.Field,{
    initEvents : function(){
        this.mon(this.el, Ext.EventManager.getKeyEvent(), this.fireKey,  this);
        this.mon(this.el, 'focus', this.onFocus, this);

        // standardise buffer across all browsers + OS-es for consistent event order.
        // (the 10ms buffer for Editors fixes a weird FF/Win editor issue when changing OS window focus)
        this.mon(this.el, 'blur', this.onBlur, this, this.inEditor ? {buffer:10} : null);
    }
});

afStudio.models.modelGridView = Ext.extend(Ext.grid.GridView,{
	
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
				{itemId:"asc", text: this.sortAscText, cls: "xg-hmenu-sort-asc"},
				{itemId:"desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc"},
				'-',
				{itemId:"addfb", text: 'Add Field Before'},
				{itemId:"addfa", text: 'Add Field After'},
				'-',
				{itemId:"dupb", text: 'Duplicate Field'},
				{itemId:"editb", text: 'Edit Field ...'},
				{itemId:"renameb", text: 'Rename Field'},				
				{itemId:'deletef',text: 'Delete Field'},
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
	
	columnMenuClick : function(item){		
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
				this.cm.config[_index].uninit = false;
				this.cm.moveColumn(_index, index + 1);
				this.cm.setHidden(index + 1, false);
				break;
				
			case 'addfb' :
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit = false;
				this.cm.config[_index].uninit = false;
				this.cm.moveColumn(_index, index);
				this.cm.setHidden(index, false);
				break;
				
			case 'dupb':
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit = false;
				this.cm.config[_index].uninit = false;
				this.cm.moveColumn(_index, index + 1);
				var header = this.cm.getColumnHeader(index);
				this.cm.setColumnHeader(index + 1, this.createDupheader(header));
				this.cm.setHidden(index + 1, false);
				break;
				
			case 'renameb':
				var hd = this.findHeaderCell(item.parentMenu._el);
				this.editHeadColumn(hd.firstChild,index);
				break;
				
			case 'editb':
				var fd = cm.config[index].fieldDefinition || {};
				if (!item.renameWindow) {
					item.renameWindow = new afStudio.models.EditFieldWindow({
						fieldDefinition: fd
					});
				}
				item.renameWindow.show();
				break;
				
			case 'deletef':
				var visibleCount = cm.getColumnCount(true);
				if (visibleCount > 2) {
					cm.setHidden(index, true);
					cm.config[index].uninit = true;
					cm.config[index].header = this.grid.defautHeaderTitle;
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
				
			default:
				alert(item.itemId);
		}
		return true;
	},

	showNextColumn : function(index) {
		var cm = this.cm;
		if (index <= this.grid.maxColumns) {
			cm.setHidden(index + 1,false);
			cm.config[index + 1].uninit = false;
		}
	},
	
	headEditComplete : function(ed, v, sv) {
		var index = ed._index;
		var cm = this.cm;
		cm.setColumnHeader(index,v);
	},
	
	editHeadColumn : function(el,index){
		var ed = new Ext.grid.GridEditor(new Ext.form.TextField());
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
			var ms = this.hmenu.items, cm = this.cm;
			//ms.get("asc").setDisabled(!cm.isSortable(index));
			//ms.get("desc").setDisabled(!cm.isSortable(index));
			this.hmenu.on("hide", function(){
				Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
			}, this, {single:true});
			this.hmenu.show(t, "tl-bl?");
		} else {
			this.editHeadColumn(hd.firstChild,index);
		}
	}
	
});

//Excel grid class define 
var _modelEditerEnterFlag=0;
afStudio.models.ExcelGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
	
	maxColumns: 20,
	
	defautHeaderTitle: 'new field',
	
	createEditer : function(fd) {
		var fmfield = fd ? fd : new Ext.form.TextField();
		
		return new Ext.grid.GridEditor(fmfield, {
					completeOnEnter : false,
					listeners: {
						specialkey : function(field, e) {
							if (e.getKey() == e.ENTER) {
								_modelEditerEnterFlag = 1;
								this.completeEdit();
							}
						}
					}
				});
	},
	
	beforeInit : function() {
		var columns = [new Ext.grid.RowNumberer()];
		var fields = [];
		
		for (var i = 0; i < this.maxColumns; i++) {
			var hidden = true;
			if (i==0) {
				hidden=false;
			}
			columns.push({
				header: this.defautHeaderTitle,
				dataIndex: 'c'+i,
				width: 80,hidden:hidden,
				uninit: hidden,
				editor: new Ext.grid.GridEditor(new Ext.form.TextField(), {
					completeOnEnter:false,
					listeners:{
						specialkey :function(field,e){
							if(e.getKey() == e.ENTER){
								_modelEditerEnterFlag=1;
								 this.completeEdit();
							}
						}
					}
				})
			});
			fields.push({name:'c'+i});
		}
		
		if (this.columns) {
			var cm = new Ext.grid.ColumnModel(this.columns);
		} else {
			var cm = new Ext.grid.ColumnModel(columns);
		}
	 
		if (this.store) {
			var store = this.store;
			if (this.store.getCount() == 0) {
				var rec = this.store.recordType;
				this.store.add([new rec()]);		
			}
		} else {
			var store = new Ext.data.SimpleStore({
				fields: fields,data : [['']]
			});
		}
		
		var config = {			
	        autoScroll: true,
	        store: store,
	        cm : cm,
			columnLines:true,
	        clicksToEdit : 1,
	        style: 'padding-bottom:10px;',
	        view:new afStudio.models.modelGridView(),
	        listeners:{
				afteredit:function(e){
					//e.record.commit();
					var row = e.row+1;
					var count = this.store.getCount();
					if(count == row){
						var rec = store.recordType;
						store.add([new rec()]);
					}
					var column = e.column;
					if(this.getColumnModel().getColumnCount(true)==(column+1) &&  column<this.maxColumns){
						this.getView().showNextColumn(column);
					}
					//if(colum = this.)
					if(_modelEditerEnterFlag){
						var task = new Ext.util.DelayedTask(function(row,column){
						    this.startEditing(row,column);
						    _modelEditerEnterFlag=0;
						},this,[row,column]);
						task.delay(100);
					}
				}
			}
		};
			
		//apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
	},
	
	initComponent: function(){
		this.beforeInit();		
		afStudio.models.ExcelGridPanel.superclass.initComponent.apply(this, arguments);
	}
	
});


//model grid is extended from excel grid
afStudio.models.ModelGrid = Ext.extend(afStudio.models.ExcelGridPanel, {
	
	beforeInit: function() {
		var _this = this,
			 data = _this._data.rows;
		   fields = ['id'];			  
		
		if (data.length > 0) {
			var columns = [new Ext.grid.RowNumberer()];
			
			for (var i = 0; i < data.length; i++) {
				columns.push({
					header: data[i].name,
					dataIndex: 'c'+i,
					width: 80,
					hidden: false,					 
					editor: this.createEditer(),
					fieldDefinition: data[i] //custom property
				});
				fields.push({name:'c'+i});
			}
	 
			for (var i = columns.length - 1; i <= this.maxColumns; i++) {
				columns.push({
					header: this.defautHeaderTitle,
					dataIndex: 'c'+i,
					uninit: true,
					width: 80,
					hidden: true,
					editor: this.createEditer()
				});
				fields.push({name:'c'+i});
			}
		}

		this.store = new Ext.data.Store({
			reader: new afStudio.models.modelGridPanelReader({
				root: 'rows',
			    idProperty: 'id'
			}, fields),
            proxy: _this.storeProxy,
            writer: new Ext.data.JsonWriter({encode: false,listful: true}),
            autoLoad: true,
            autoSave: false,
			listeners : {				
				load : function(store, records) {
					//adds one line if the result set is empty
					//if (Ext.isEmpty(records))
					{
						 var rec = store.recordType;
						store.add([new rec()]);						
					}
				}
			}
		});		
		this.columns = columns;
		
		afStudio.models.ModelGrid.superclass.beforeInit.apply(this, arguments);
		
		var config = {			
			iconCls: 'icon-grid',
//			height: 300,
		    loadMask: true,
		    clicksToEdit: 1,
	        columnLines: true,
	        autoScroll: true,
	        viewConfig: {
	            forceFit: true
	        },
		        
	        plugins: [Ext.ux.grid.DataDrop],
	        tbar: [{ 
	            text: 'Save',
	            iconCls: 'icon-save',
	            handler: function(btn, ev) {
	            	this.getStore().save();
	            },
	            scope:this
	        },'-',{	        	
            	text: 'Insert',
            	iconCls: 'icon-add',
	            menu: {
	            	items: [
	            	{
	            		text: 'Insert after',
			            handler: Ext.util.Functions.createDelegate(_this.insertAfterField, _this) 
	            	},{
	            		text: 'Insert before',
			            handler: Ext.util.Functions.createDelegate(_this.insertBeforeField, _this)
	            	}]
	            }	            
        	},'-',{ 
	            text: 'Delete',
	            iconCls: 'afs-icon-delete',
	            handler:function(btn, ev){
	            	var cell = this.getSelectionModel().getSelectedCell();			
	        	    if (cell) {
	        	    	var r = this.store.getAt(cell[0]);
	        	    	this.store.remove(r);	        
	        	    }	 
	            },
	            scope:this
	        },'-',{
	            text: 'Export to Fixtures',
	            iconCls: 'icon-view-tile',
	            handler:function(btn, ev){
	            }
	        }]
		};
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
	},
	
	insertAfterField : function(b, e) {
		var _this = this,		
    		cell = _this.getSelectionModel().getSelectedCell(),
    		index = cell ? cell[0] + 1 : this.store.getCount(); 
    	
    	var u = new _this.store.recordType({
            name : '',
            type: 'INT',
            size : '11',
            required: false
        });
        _this.stopEditing();
        _this.store.insert(index, u);
		_this.startEditing(index , cell ? cell[1] : 0);		
	},
	
	insertBeforeField : function() {
		var _this = this,
    		cell = _this.getSelectionModel().getSelectedCell(),
    		index = cell ? cell[0] : 0; 
    	
    	var u = new _this.store.recordType({
            name : '',
            type: 'INT',
            size : '11',
            required: false
        });
        _this.stopEditing();
        _this.store.insert(index, u);
        _this.startEditing(index , cell ? cell[1] : 0);	
	},	
	
	onEditComplete : function (ed, value, startValue) {
        this.editing = false;
        this.lastActiveEditor = this.activeEditor;
        this.activeEditor = null;

        var r = ed.record,
            field = this.colModel.getDataIndex(ed.col);
        value = this.postEditValue(value, startValue, r, field);
        if(this.forceValidation === true || String(value) !== String(startValue)){
            var e = {
                grid: this,
                record: r,
                field: field,
                originalValue: startValue,
                value: value,
                row: ed.row,
                column: ed.col,
                cancel:false
            };
            if(this.fireEvent("validateedit", e) !== false && !e.cancel && String(value) !== String(startValue)){
                r.set(field, e.value);
                delete e.cancel;
                this.fireEvent("afteredit", e);
            }
        }
        this.view.focusCell(ed.row, ed.col);
    }
});

afStudio.models.modelGridPanelReader = Ext.extend(Ext.data.JsonReader, {
    realize: function(record, data) {
        if (Ext.isArray(record)) {
            var newRecord = [];
            var newData = [];

            for (i = 0; i < record.length; i++) {
                if (data[i]['id'] != null) {
                    newRecord.push(record[i]);
                    newData.push(data[i]);
                }
            }

            return afStudio.models.modelGridPanelReader.superclass.realize.call(this, newRecord, newData);
        } else {
            return afStudio.models.modelGridPanelReader.superclass.realize.call(this, record, data);
        }
    }
});

Ext.reg('afStudio.models.modelGrid', afStudio.models.ModelGrid);