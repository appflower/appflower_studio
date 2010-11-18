
Ext.override(Ext.form.Field,{
	initEvents : function(){
        this.mon(this.el, Ext.isIE || Ext.isSafari3 || Ext.isChrome ? "keydown" : "keypress", this.fireKey,  this);
                this.mon(this.el, 'focus', this.onFocus, this);

        // fix weird FF/Win editor issue when changing OS window focus
        var o = this.inEditor && Ext.isWindows && Ext.isGecko ? {buffer:10} : null;
        this.mon(this.el, 'blur', this.onBlur, this, o);
    }
});

afStudio.models.modelGridView = Ext.extend(Ext.grid.GridView,{
	 beforeColMenuShow : function(){
        var cm = this.cm,  colCount = cm.getColumnCount();
        this.colMenu.removeAll();
        for(var i = 0; i < colCount; i++){
            if(cm.config[i].fixed !== true && cm.config[i].hideable !== false && !cm.config[i].uninit){
                this.colMenu.add(new Ext.menu.CheckItem({
                    itemId: "col-"+cm.getColumnId(i),
                    text: cm.getColumnHeader(i),
                    checked: !cm.isHidden(i),
                    hideOnClick:false,
                    disabled: cm.config[i].hideable === false
                }));
            }
        }
    },
	renderUI : function(){
		var header = this.renderHeaders();
		var body = this.templates.body.apply({rows:'&#160;'});


		var html = this.templates.master.apply({
			body: body,
			header: header,
			ostyle: 'width:'+this.getOffsetWidth()+';',
			bstyle: 'width:'+this.getTotalWidth()+';'
		});

		var g = this.grid;

		g.getGridEl().dom.innerHTML = html;

		this.initElements();

		// get mousedowns early
		Ext.fly(this.innerHd).on("click", this.handleHdDown, this);
		this.mainHd.on({
			scope: this,
			mouseover: this.handleHdOver,
			mouseout: this.handleHdOut,
			mousemove: this.handleHdMove
		});

		this.scroller.on('scroll', this.syncScroll,  this);
		if(g.enableColumnResize !== false){
			this.splitZone = new Ext.grid.GridView.SplitDragZone(g, this.mainHd.dom);
		}

		if(g.enableColumnMove){
			this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
			this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
		}

		if(g.enableHdMenu !== false){
			this.hmenu = new Ext.menu.Menu({
				id: g.id + "-hctx",
				show : function(el, pos, parentMenu){
			        this.parentMenu = parentMenu;
			        if(!this.el){
			            this.render();
			        }
			        this.fireEvent("beforeshow", this);
			        this._el=el;
			        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);
			    }
			});
			
			this.changetoMenu = new Ext.menu.Menu({
				id:g.id + "-hchangeto-menu",
				items:[{
					itemId:"ccheckbox",text:'Checkbox'
				},{
					itemId:"cchoice",text:'Select'
				},{
					itemId:"ccurrency",text:'Currency'
				},{
					itemId:"cdate",text:'Date'
				},{
					itemId:"cemail",text:'Email Address'
				},{
					itemId:"cnumber",text:'Number'
				},{
					itemId:"cphonenumber",text:'Phone Number'
				},{
					itemId:"crate",text:'Rate'
				},{
					itemId:"ctime",text:'Time'
				},{
					itemId:"crelation",text:'Relation'
				}]
			});
			this.changetoMenu.on({
				scope: this,
				itemclick: this.handleHdMenuClick
			});
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
				{
					itemId:'deletef',text: 'Delete Field'
				},'-',{
					itemId:"changeto", text: 'Change to',
					menu:this.changetoMenu
				},{
                    itemId:"columns",
                    hideOnClick: false,
                    text: this.columnsText,
                    menu: this.colMenu,
                    iconCls: 'x-cols-icon'
				}
			);
			this.hmenu.on("itemclick", this.handleHdMenuClick, this);
		}

		if(g.trackMouseOver){
			this.mainBody.on({
				scope: this,
				mouseover: this.onRowOver,
				mouseout: this.onRowOut
			});
		}

		if(g.enableDragDrop || g.enableDrag){
			this.dragZone = new Ext.grid.GridDragZone(g, {
				ddGroup : g.ddGroup || 'GridDD'
			});
		}

		this.updateHeaderSortState();
	},
	
	columnMenuClick : function(item){
		var index = this.hdCtxIndex;
		var cm = this.cm, ds = this.ds;
	    index = cm.getIndexById(item.itemId.substr(4));
	    if(index != -1){
	        if(item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1){
	            this.onDenyColumnHide();
	            return false;
	        }
	        cm.setHidden(index, item.checked);
	    }
		return true;
	},
	
	getUninitColumn : function(){
		for(var i=0;i<this.cm.config.length;i++){
			var column = this.cm.config[i];
			if(column.uninit){
				return i;
			}
		}
		return 0;
	},
	
	createDupheader : function(header){
		for(var i=1;i<=this.cm.config.length;i++){
			var h = header + i;
			var flag = true;
			for(var j=0;j<this.cm.config.length;j++){
				if(h==this.cm.getColumnHeader(j)){
					flag=false;
					break;
				}
			}
			if(flag) return h;
		}
		return header+(this.cm.config+1);
	},
	
	handleHdMenuClick : function(item){
		var index = this.hdCtxIndex;
		var cm = this.cm, ds = this.ds;
		switch(item.itemId){
			case "asc":
				ds.sort(cm.getDataIndex(index), "ASC");
				break;
			case "desc":
				ds.sort(cm.getDataIndex(index), "DESC");
				break;
			case 'addfa':
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit=false;
				this.cm.config[_index].uninit=false;
				this.cm.moveColumn(_index,index+1);
				this.cm.setHidden(index+1,false);
				break;
			case 'addfb':
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit=false;
				this.cm.config[_index].uninit=false;
				this.cm.moveColumn(_index,index);
				this.cm.setHidden(index,false);
				break;
			case 'dupb':
				var _index = this.getUninitColumn();
				this.cm.config[_index].uninit=false;
				this.cm.config[_index].uninit=false;
				this.cm.moveColumn(_index,index+1);
				var header = this.cm.getColumnHeader(index);
				this.cm.setColumnHeader(index+1,this.createDupheader(header));
				this.cm.setHidden(index+1,false);
				break;
			case 'editb':
				var hd = this.findHeaderCell(item.parentMenu._el);
				this.editHeadColumn(hd.firstChild,index);
				break;
			case 'deletef':
				var visibleCount = cm.getColumnCount(true);
				if(visibleCount>2) {
					cm.setHidden(index, true);
					cm.config[index].uninit=true;
					cm.config[index].header=this.grid.defautHeaderTitle;
				}
				break;
			case 'cchoice':
				var cstore = [];
				var store = this.grid.store;
				for(var i=0;i<store.getCount();i++){
					var record = store.getAt(i);
					var value = record.get(cm.getDataIndex(index));
					if(value=="")continue;
					var flag=true;
					for(var j=0;j<cstore.length;j++){
						if(cstore[j]==value){
							flag = false;
							break;
						}
					}
					if(flag)cstore.push(value);
				}
				var editor=this.grid.createEditer(
					new Ext.form.ComboBox({
						typeAhead: true,
						triggerAction: 'all',
						lazyRender:true,
						mode: 'local',
						store: cstore
					}));
				
				cm.config[index].editor = editor;
				break;
			case 'cdate':
				var editor=this.grid.createEditer(new Ext.form.DateField());
				cm.config[index].editor = editor;
				break;
			case 'cnumber':
				var editor=this.grid.createEditer(new Ext.form.NumberField());
				cm.config[index].editor = editor;
				break; 
			case 'ccurrency':
				var editor=this.grid.createEditer(new Ext.form.NumberField());
				cm.config[index].editor = editor;
				cm.config[index].renderer = Ext.util.Format['usMoney'];
				break; 
			case 'cdate':
				var editor = this.grid.createEditer(
					new Ext.form.DateField({
						getValue:function(){
							return "12/12/2010";
						}
					})
				);
				cm.config[index].editor = editor;
				cm.config[index].renderer = Ext.util.Format.dateRenderer('m/d/Y');
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
			default:
				alert(item.itemId);
		}
		return true;
	},

	showNextColumn:function(index){
		var cm = this.cm;
		if(index<=this.grid.maxColumns){
			cm.setHidden(index+1,false);
			cm.config[index+1].uninit=false;
		}
	},
	headEditComplete : function(ed,v,sv){
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
		for(var i=index+1;i<this.grid.maxColumns;i++){
			if(!this.cm.isHidden(i)){
				showFlag=false;
				break;
			}
		}
		if(showFlag) this.showNextColumn(index);
	},
	handleHdDown : function(e, t){
		var hd = this.findHeaderCell(t);
		if(!hd)return;
		var index = this.getCellIndex(hd);
		if(Ext.fly(t).hasClass('x-grid3-hd-btn')){
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
		}else{
			this.editHeadColumn(hd.firstChild,index);
		}
	}
});

//Excel grid class define 
var _modelEditerEnterFlag=0;
afStudio.models.ExcelGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
	maxColumns:20,
	defautHeaderTitle:'new field',
	createEditer:function(fd){
		var fmfield=null;
		if(fd)fmfield=fd; else fmfield = new Ext.form.TextField();
		return	new Ext.grid.GridEditor(
					fmfield,{
						completeOnEnter:false,
						listeners:{
							specialkey :function(field,e){
								if(e.getKey() == e.ENTER){
									_modelEditerEnterFlag=1;
									 this.completeEdit();
								}
							}
						}
					}
				);
	},
	beforeInit: function(){
		var columns=[new Ext.grid.RowNumberer()];
		var fields=[];
		for(var i=0;i<this.maxColumns;i++){
			var hidden=true;
			if(i==0)hidden=false;
			columns.push({
				header : this.defautHeaderTitle,
				dataIndex : 'c'+i,
				width : 80,hidden:hidden,
				editor : new Ext.grid.GridEditor(
					new Ext.form.TextField(),{
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
		
		if(this.columns)
			var cm = new Ext.grid.ColumnModel(this.columns);
		else
			var cm = new Ext.grid.ColumnModel(columns);
	 
		if(this.store){
			var store = this.store;
		}else{
			var store =  new Ext.data.SimpleStore({
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
						e.record.commit();
						var row = e.row+1;
						var count = this.store.getCount();
						if(count == row){
							store.add([new  Ext.data.Record()]);
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
			
			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
	},
	initComponent: function(){
		this.beforeInit();		
		afStudio.models.ExcelGridPanel.superclass.initComponent.apply(this, arguments);
	}
	
});


//model grid is extended from excel grid
afStudio.models.modelGridPanel = Ext.extend(afStudio.models.ExcelGridPanel, {
	
	beforeInit:function(){
		var gridFields=this;
		var fields = [];
		var data = gridFields._data.rows;
		if(data.length>0){
			var columns = [new Ext.grid.RowNumberer()];
			for(var i=0;i<data.length;i++){
				columns.push({
					header : data[i].name,
					dataIndex : 'c'+i,
					width : 80,hidden:false,
					editor : this.createEditer()
				});
				fields.push({name:'c'+i})
			}
	 
			for(var i=columns.length-1;i<=this.maxColumns;i++){
				columns.push({
					header : this.defautHeaderTitle,
					dataIndex : 'c'+i,
					uninit:true,
					width : 80,hidden:true,
					editor : this.createEditer()
				});
				fields.push({name:'c'+i});
			}
			
			this.store = new Ext.data.Store({
				reader: new Ext.data.JsonReader({
				    idProperty: 'id'
				}, fields)
			});
			this.store.add([new Ext.data.Record()]);
			this.columns = columns;
		}
		
		afStudio.models.modelGridPanel.superclass.beforeInit.apply(this, arguments);
		
		var config = {			
				iconCls: 'icon-grid',
		        height: 300,
		        plugins: [Ext.ux.grid.DataDrop],
		        tbar: [{
		            text: 'Save',
		            iconCls: 'icon-save',
		            handler:function(btn, ev){
		            }
		        }, '-',{
		            text: 'Export to Fixtures',
		            iconCls: 'icon-view-tile',
		            handler:function(btn, ev){
		            }
		        }]
			};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
	}
});

Ext.reg('modelGridPanel', afStudio.models.modelGridPanel);