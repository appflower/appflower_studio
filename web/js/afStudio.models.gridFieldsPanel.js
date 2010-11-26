Ext.ns('afStudio.models');

afStudio.models.gridFieldsPanel = Ext.extend(Ext.grid.EditorGridPanel, {	
	
	saveModel : function(b, e) {		
	}
	
	,insertAfterField : function(b, e) {
		var _this = this,		
    		cell = _this.getSelectionModel().getSelectedCell(),
    		index = cell ? cell[0] + 1 : 0; 
    	
    	var u = new _this.store.recordType({
            name : '',
            type: 'INT',
            size : '11',
            required: false
        });
        _this.stopEditing();
        _this.store.insert(index, u);
		_this.startEditing(index , cell ? cell[1] : 0);		
	}
	
	,insertBeforeField : function() {
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
		_this.startEditing(index, cell ? cell[1] : 0);		
	}
	
	/**
	 * Deletes field (row) from the grid
	 */
	,deleteField : function() {
		var _this = this,
			cell = _this.getSelectionModel().getSelectedCell();			
	    if (cell) {
	    	var r = _this.store.getAt(cell[0]);
	    	_this.store.remove(r);	        
	    }	    		
	}
	
	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	,_initCmp : function() {
		var _this = this;
		
		var store = new Ext.data.JsonStore({
			autoLoad: false,
			url: '/appFlowerStudio/models',
		    baseParams: {
		    	model: _this.model,
		    	schema: _this.schema
		    },			
		    root: 'rows',
		    idProperty: 'id',
		    fields: [		    
				{name: 'id'},
			    {name: 'name'},
			    {name: 'type'},
			    {name: 'size'},
			    {name: 'primary_key'},
			    {name: 'required'},
			    {name: 'autoincrement'},
			    {name: 'default_value'},
			    {name: 'foreign_table'},
			    {name: 'foreign_key'}		    
		    ]
		});
		store.loadData(_this._data);
				
		var columnModel = new Ext.grid.ColumnModel({
			defaults: {
				sortable: true
			},
			columns: [
//				{header: '<input type="checkbox" />', width: 20, menuDisabled: true,
//			    	renderer : function(v, p, record) {return '<input type="checkbox"  />';}
//				},
				{header: '<div class="model-pk-hd">&#160;</div>', width: 25, dataIndex: 'primary_key', 
					editor: new Ext.form.ComboBox({
						typeAhead: true,
						triggerAction: 'all',
						lazyRender: true,
						editable: false,
						mode: 'local',
						valueField: 'field',
						displayField: 'field',
						store: [['unique', 'unique'], ['pk', 'primary key']]
					}), 
					renderer : function(value, metaData, record, rowIndex, colIndex, store) {
						var html = '';
						switch(value) {
							case 'pk':
								html = '<div class="pk-cell">&#160;</div>';
							break;
							case 'unique':
								html = '<div class="unique-cell">&#160;</div>';
							break;							
						};
						return  html;
					}
				},
			    {header: "Name", width: 100, dataIndex: 'name', editor: new Ext.form.TextField({})},
			    {header: "Type", width: 100, dataIndex: 'type', editor: new Ext.form.TextField({})},
			    {header: "Size", width: 50, dataIndex: 'size', editor: new Ext.form.TextField({})},			    		    
			    {header: "Autoincrement", width: 50, dataIndex: 'autoincrement', editor: new Ext.form.TextField({})},
			    {header: "Default value", width: 100, dataIndex: 'default_value', editor: new Ext.form.TextField({})},
			    
			    {header: "Relation", width: 150, sortable: true, dataIndex: 'foreign_table', 
				      editor: new afStudio.models.RelationCombo({
				      	relationUrl: '/appFlowerStudio/models'
				      }) 
//				      new Ext.form.TextField({
//				      	listeners: {
//				      		focus: function(field) {
//				      			if (!field.picker) {
//					      			field.picker = new afStudio.models.relationPicker({
//					      				closable: true,
//	                					closeAction: 'hide',
//					      				listeners: {
//					      					relationpicked : function(relation) {
//					      						field.setValue(relation);
//					      					}
//					      				}
//					      			});
//				      			}
//				      			field.picker.show();
//				      		}
//				      	}
//			      	})
			    },
			    {header: "Required", width: 50, sortable: true, dataIndex: 'required', align:'center', 
			    	editor: new Ext.form.Checkbox({}),
					renderer : function(v, p, record){
					    p.css += ' x-grid3-check-col-td'; 
					    return '<div class="x-grid3-check-col' + (v ? '-on' : '') + '"> </div>';
					}					
				}

			]
		});	
		
		var topToolbar = new Ext.Toolbar({
			items: [
	        {
	            text: 'Save',
	            iconCls: 'icon-save',
	            handler: Ext.util.Functions.createDelegate(_this.saveModel, _this)
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
	            iconCls: 'icon-delete',
	            handler: Ext.util.Functions.createDelegate(_this.deleteField, _this)
	        }]
		});		
		
		return {
			itemId: 'model-fields',
			clicksToEdit: 1,			
	        store: store,
	        colModel: columnModel,
	        columnLines: true,
			iconCls: 'icon-grid',
	        autoScroll: true,
	        height: 300,
	        tbar: topToolbar,
	        viewConfig: {
	            forceFit: true
	        }			
		}
	}//eo _initCmp
	 
	//@private
	,initComponent: function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));				
		afStudio.models.gridFieldsPanel.superclass.initComponent.apply(this, arguments);
		this._initEvents();
	}
	
	,_initEvents : function() {
		var _this = this,
			store = _this.getStore();
		
//		_this.on({
//			afteredit: function(e) {
//				//e.record.commit();
//				var row = e.row + 1;
//				var count = this.store.getCount();
//				if (count == row) {
//					var newId = store.getAt(e.row).get('id') + 1;
//					var record = new store.recordType({
//						'id': newId,
//			    		'name': '',			    
//			    		'required': false,
//			    		'autoincrement': false								
//					});
//					store.add([record]);
//				}
//				var column = e.column;
//				var task = new Ext.util.DelayedTask(function(row,column) {
//				    this.startEditing(row,column);
//				},this,[row,column]);
//				task.delay(100);
//			}			
//		});		
	}//eo _initEvents
	
}); 

//register xtype
Ext.reg('afStudio.models.gridFieldsPanel', afStudio.models.gridFieldsPanel);
