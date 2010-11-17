Ext.ns('afStudio.models');

afStudio.models.gridFieldsPanel = Ext.extend(Ext.grid.GridPanel, {
	
	initComponent: function(){
		
		var gridFields=this;
		
		// Create a standard HttpProxy instance.
		var proxy = new Ext.data.HttpProxy({
		    url: '/appFlowerStudio/models'
		});
		
		// Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
		var reader = new Ext.data.JsonReader({
		    totalProperty: 'totalCount',
		    successProperty: 'success',
		    idProperty: 'id',
		    root: 'rows',
		    messageProperty: 'message'  // <-- New "messageProperty" meta-data
		}, [
			{name: 'id', allowBlank: false}
		    ,{name: 'name', allowBlank: false}
		    ,{name: 'type', allowBlank: false}
		    ,{name: 'size', allowBlank: true}
		    ,{name: 'primary_key', allowBlank: true}
		    ,{name: 'required', allowBlank: true}
		    ,{name: 'autoincrement', allowBlank: true}
		    ,{name: 'default_value', allowBlank: true}
		    ,{name: 'foreign_table', allowBlank: true}
		    ,{name: 'foreign_key', allowBlank: true}
		]);
		
		// The new DataWriter component.
		var writer = new Ext.data.JsonWriter({
		    encode: true   // <-- don't return encoded JSON -- causes Ext.Ajax#request to send data using jsonData config rather than HTTP params
		    ,writeAllFields: true
		});
		
		var store = new Ext.data.Store({
		    id: 'user'
		    ,restful: false
		    ,proxy: proxy
		    ,reader: reader
		    ,writer: writer
		    ,baseParams: {
		    	model: gridFields.model
		    	,schema: gridFields.schema
		    }
		});
		
		// load the store immeditately
		store.load();
		
		store.on({
			beforewrite: function(proxy,action,rs,options,arg){
				options.oldName=rs.fields.items[1].name;
				
				console.log(options);
			}
		});
		
		Ext.util.Observable.capture(store, function(e){console.info(e)});
				
		var columns =  [
		    {header: "Name", width: 100, sortable: true, dataIndex: 'name', editor: new Ext.form.TextField({})}
		    ,{header: "Type", width: 100, sortable: true, dataIndex: 'type', editor: new Ext.form.TextField({})}
		    ,{header: "Size", width: 50, sortable: true, dataIndex: 'size', editor: new Ext.form.TextField({})}
		    ,{header: "Primary Key", width: 50, sortable: true, dataIndex: 'primary_key', editor: new Ext.form.TextField({})}		    
		    ,{header: "Autoincrement", width: 50, sortable: true, dataIndex: 'autoincrement', editor: new Ext.form.TextField({})}
		    ,{header: "Default value", width: 100, sortable: true, dataIndex: 'default_value', editor: new Ext.form.TextField({})}
		    
		    //TODO make a separate component to prevent code cluttering 
		    ,{header: "Relation", width: 150, sortable: true, dataIndex: 'foreign_table', 
			      editor: new Ext.form.TextField({		      	
			      	listeners: {
			      		focus: function(field) {
			      			if (!field.picker) {
				      			field.picker = new afStudio.models.relationPicker({
				      				closable: true,
                					closeAction: 'hide',
				      				listeners: {
				      					relationpicked : function(relation) {
				      						field.setValue(relation);
				      					}
				      				}
				      			});
			      			}
			      			field.picker.show();
			      		}
			      	}
		      	})
		     }
		    ,{header: "Required", width: 50, sortable: true, dataIndex: 'required', editor: new Ext.form.Checkbox({})}
		];
		
		var editor = new Ext.ux.grid.RowEditor({
	        saveText: 'Update'
	    });
		
		var config = {			
			iconCls: 'icon-grid',
	        //frame: true,
	        //closable:true,
	        autoScroll: true,
	        height: 300,
	        store: store,
	        plugins: [editor],
	        columns : columns,
	        style: 'padding-bottom:10px;',
	        tbar: [
	        {
	            text: 'Save',
	            iconCls: 'icon-save',
	            handler:function(btn, ev){
	            }
	        }, '-', {	        	
	            text: 'Insert',
	            iconCls: 'icon-add',
	            menu: {
	            	items: [
	            	{
	            		text: 'Insert after',
			            handler:function(btn, ev){
			            	var rec = gridFields.getSelectionModel().getSelected();
			            	var index=rec?gridFields.store.indexOf(rec)+1 : 0;
			            	
			            	var u = new gridFields.store.recordType({
					            name : '',
					            type: 'INT',
					            size : '11'
					        });
					        editor.stopEditing();
					        gridFields.store.insert(index, u);
					        editor.startEditing(index);
			            }	            		
	            	},{
	            		text: 'Insert before',
			            handler:function(btn, ev){
			            	var rec = gridFields.getSelectionModel().getSelected();
			            	var index=rec?gridFields.store.indexOf(rec) : 0;
			            	
			            	var u = new gridFields.store.recordType({
					            name : '',
					            type: 'INT',
					            size : '11'
					        });
					        editor.stopEditing();
					        gridFields.store.insert(index, u);
					        editor.startEditing(index);
			            }	            		
	            	}]
	            }
	            
	        }, '-', {
	            text: 'Delete',
	            iconCls: 'icon-delete',
	            handler: function(btn, ev){	            	
	            	var records = gridFields.getSelectionModel().getSelections();	            	
			        if (records.length < 0) {
			            return false;
			        }
			        gridFields.store.remove(records);
	            }
	        }, '-'],
	        viewConfig: {
	            forceFit: true
	        }/*,
	        tools:[{
        		id:'close'
        		,handler:function(e,te,p,tc){
        			p.destroy();
        		}
        	}]*/
		};
		
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
				
		afStudio.models.gridFieldsPanel.superclass.initComponent.apply(this, arguments);	
	}
	,onRender:function() {
		// call parent
		afStudio.models.gridFieldsPanel.superclass.onRender.apply(this, arguments);

	} // eo function onRender
}); 

// register xtype
Ext.reg('afStudio.models.gridFieldsPanel', afStudio.models.gridFieldsPanel);

// eof

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
			this.hmenu = new Ext.menu.Menu({id: g.id + "-hctx"});
			this.colMenu = new Ext.menu.Menu({
				id:g.id + "-hcols-menu",
				items:[{
					itemId:"ccheckbox",text:'Checkbox'
				},{
					itemId:"cchoice",text:'Choice'
				},{
					itemId:"ccurrency",text:'Currency'
				},{
					itemId:"cdate",text:'Date'
				},{
					itemId:"cduration",text:'Duration'
				},{
					itemId:"cemail",text:'Email Address'
				},{
					itemId:"cimaccount",text:'IM Account'
				},{
					itemId:"cnumber",text:'Number'
				},{
					itemId:"cphonenumber",text:'Phone Number'
				},{
					itemId:"crate",text:'Rate'
				},{
					itemId:"ctime",text:'Time'
				},{
					itemId:"curl",text:'URL'
				}]
			});
			this.colMenu.on({
				scope: this,
				itemclick: this.handleHdMenuClick
			});

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
					itemId:"changeto", text: 'Change to',
					menu:this.colMenu
				},{
					itemId:'deletef',text: 'Delete Field'
				},'-',{
					itemId:'hidef',text: 'Hidden Field'
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
			case 'hidef':
				var visibleCount = cm.getColumnCount(true);
				/*for(var i=0;i<cm.getColumnCount();i++){
					if(!cm.isHidden(i) && cm.isCellEditable(i,0) ){
						visibleCount++;
					}
				}*/
				if(visibleCount>2) cm.setHidden(index, true);
				break;
			case 'deletef':
				var visibleCount = cm.getColumnCount(true);
				if(visibleCount>2) cm.setHidden(index, true);
				break;
			default:
				alert(item.itemId);
		}
		return true;
	},

	showNextColumn:function(index){
		var cm = this.cm;
		if(index<=this.grid.maxColumns)
			cm.setHidden(index+1,false);
	},
	headEditComplete : function(ed,v,sv){
		var index = ed._index;
		var cm = this.cm;
		cm.setColumnHeader(index,v);
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
			var ed = new Ext.grid.GridEditor(new Ext.form.TextField());
			ed._index = index;
			ed.on({
				scope: this,
				complete: this.headEditComplete
			});
			ed.startEdit(hd.firstChild,  this.cm.getColumnHeader(index));
			this.showNextColumn(index);
		}
	}
});

//Excel grid class define 
var _modelEditerEnterFlag=0;
afStudio.models.ExcelGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
	maxColumns:20,
	defautHeaderTitle:'new field',
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
	createEditer:function(){
		return	new Ext.grid.GridEditor(
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
					}
				);
	},
	beforeInit:function(){
		var gridFields=this;
		var columns = [
				new Ext.grid.RowNumberer()
				,{header: "Name", width: 100, sortable: true, dataIndex: 'name', editor: this.createEditer()}
				,{header: "Type", width: 100, sortable: true, dataIndex: 'type', editor: this.createEditer()}
				,{header: "Size", width: 50, sortable: true, dataIndex: 'size', editor: this.createEditer()}
				,{header: "Primary Key", width: 100, sortable: true, dataIndex: 'primary_key', editor: this.createEditer()}
				,{header: "Required", width: 80, sortable: true, dataIndex: 'required', editor: this.createEditer()}
				,{header: "Autoincrement", width: 80, sortable: true, dataIndex: 'autoincrement', editor: this.createEditer()}
				,{header: "Default value", width: 100, sortable: true, dataIndex: 'default_value', editor: this.createEditer()}
				,{header: "Foreign table", width: 100, sortable: true, dataIndex: 'foreign_table', editor: this.createEditer()}
				,{header: "Foreign key", width: 80, sortable: true, dataIndex: 'foreign_key', editor: this.createEditer()}
			];
		
		var fields = [
				{name: 'id', allowBlank: false}
				,{name: 'name', allowBlank: false}
				,{name: 'type', allowBlank: false}
				,{name: 'size', allowBlank: true}
				,{name: 'primary_key', allowBlank: true}
				,{name: 'required', allowBlank: true}
				,{name: 'autoincrement', allowBlank: true}
				,{name: 'default_value', allowBlank: true}
				,{name: 'foreign_table', allowBlank: true}
				,{name: 'foreign_key', allowBlank: true}
			];
			
		for(var i=columns.length-1;i<=this.maxColumns;i++){
			columns.push({
				header : this.defautHeaderTitle,
				dataIndex : 'c'+i,
				width : 80,hidden:true,
				editor : this.createEditer()
			});
			fields.push({name:'c'+i});
		}
		
		var proxy = new Ext.data.HttpProxy({
		    url: '/appFlowerStudio/models'
		});
		
		var reader = new Ext.data.JsonReader({
		    totalProperty: 'totalCount',
		    successProperty: 'success',
		    idProperty: 'id',
		    root: 'rows',
		    messageProperty: 'message' 
		}, fields);

		
		this.store = new Ext.data.Store({
		    proxy: proxy
		    ,reader: reader
		    ,baseParams: {
		    	xaction:'read',
		    	model: gridFields.model
		    	,schema: gridFields.schema
		    }
		});
		this.store.load();
		this.columns = columns;
		
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
