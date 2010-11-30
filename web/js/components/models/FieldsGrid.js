Ext.ns('afStudio.models');

/**
 * Models FieldsGrid responsible for manipulations 
 * with Model's structure  
 * @class afStudio.models.FieldsGrid
 * @extends Ext.grid.EditorGridPanel
 */
afStudio.models.FieldsGrid = Ext.extend(Ext.grid.EditorGridPanel, {	
	
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
	
	//private
	,booleanEditor : {
    	editor: new Ext.form.ComboBox({
			typeAhead: true,
			triggerAction: 'all',
			lazyRender: true,
			editable: false,
			mode: 'local',
			valueField: 'field',
			displayField: 'field',
			store : [[true, 'true'], [false, 'false']]
    	}),
		renderer: function(v, p, record) {
		    p.css += ' x-grid3-check-col-td'; 
		    return '<div class="x-grid3-check-col' + (v ? '-on' : '') + '"> </div>';
		}
	}
	
	//private
	,typeEditor : {
		editor: new Ext.ux.form.GroupingComboBox({
			typeAhead: true,
			forceSelection: true,
			lazyRender: true,
			displayField: 'text',
			groupField: 'group',
			store: new Ext.data.SimpleStore({
				fields: ['group', 'text'],
				data: [
					['TEXT', 'char'],        ['TEXT', 'varchar'],     ['TEXT', 'longvarchar'],	['TEXT', 'clob'],
					['NUMBERS', 'numeric'],  ['NUMBERS', 'decimal'],  ['NUMBERS', 'tinyint'],					
					['NUMBERS', 'smallint'], ['NUMBERS', 'integer'],  ['NUMBERS', 'bigint'],
					['NUMBERS', 'real'],	 ['NUMBERS', 'float'],    ['NUMBERS', 'double'],
					['BINRAY', 'binary'],	 ['BINRAY', 'varbinary'], ['BINRAY', 'longvarbinary'], ['BINRAY', 'blob'],
					['TEMPORA DATE/TIME', 'date'],	 
					['TEMPORA DATE/TIME', 'time'], 
					['TEMPORA DATE/TIME', 'timestamp'], 
					['TEMPORA DATE/TIME', 'integer']
				]
			}),
			mode: 'local'
		}) 
	}
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var fieldsStore = new Ext.data.JsonStore({
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
		fieldsStore.loadData(_this._data);
				
		var columnModel = new Ext.grid.ColumnModel({
			defaults: {
				sortable: true
			},
			columns: [
			{	//PrimaryKey				
				header: '<div class="model-pk-hd">&#160;</div>', 
				width: 25, 
				dataIndex: 'primary_key',					
				editor: new Ext.form.ComboBox({
					typeAhead: true,
					triggerAction: 'all',
					lazyRender: true,
					editable: false,
					mode: 'local',
					valueField: 'field',
					displayField: 'field',
					store: [['primary', 'Primary'], ['index', 'Index'], ['unique', 'Unique']]
				}),
				renderer : function(value, metaData, record, rowIndex, colIndex, store) {
					var html = '';
					switch(value) {
						case 'primary': html = '<div class="pk-cell">&#160;</div>';	    break;
						case 'index':	html = '<div class="index-cell">&#160;</div>';	break;
						case 'unique':	html = '<div class="unique-cell">&#160;</div>';	break;
					};
					return  html;
				}
			},{
				header: "Name",
				width: 100,
				dataIndex: 'name',
				editor: new Ext.form.TextField()
			},{
				header: "Type",
				width: 100,
				dataIndex: 'type',
				editor: _this.typeEditor.editor
			},{
				header: "Size",
				width: 50,
				dataIndex: 'size',
				editor: new Ext.form.TextField()
			},{
				header: "Autoincrement",
				width: 50,
				dataIndex: 'autoincrement',
				editor: _this.booleanEditor.editor,
				renderer: _this.booleanEditor.renderer
			},{
				header: "Default value",
				width: 100,
				dataIndex: 'default_value',
				editor: new Ext.form.TextField()
			},{
				header: "Relation",
				width: 150,
				sortable: true,
				dataIndex: 'foreign_table',
				editor: new afStudio.models.RelationCombo({
					relationUrl: '/appFlowerStudio/models',
					fieldsGrid: _this
				})
			},{
				header: "Required",
				width: 50,
				sortable: true,
				dataIndex: 'required',
				align: 'center', 
				editor: _this.booleanEditor.editor,
				renderer: _this.booleanEditor.renderer
			}]
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
	        store: fieldsStore,
	        colModel: columnModel,
	        columnLines: true,
			iconCls: 'icon-grid',
	        autoScroll: true,
	        //height: 300,
	        tbar: topToolbar,
	        viewConfig: {
	            forceFit: true
	        }			
		}
	}//eo _beforeInitComponent
	 
	//private
	,initComponent: function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.models.FieldsGrid.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	,_afterInitComponent : function() {
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

	}//eo _afterInitComponent
	
}); 

/**
 * @type 'afStudio.models.fieldsGrid'
 */
Ext.reg('afStudio.models.fieldsGrid', afStudio.models.FieldsGrid);
