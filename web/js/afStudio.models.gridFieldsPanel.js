Ext.ns('afStudio.models');

afStudio.models.gridFieldsPanel = Ext.extend(Ext.grid.EditorGridPanel, {	
	
	saveModel : function(b, e) {		
	}
	
	,insertAfterField : function(b, e) {
		var _this = this,		
    		rec = _this.getSelectionModel().getSelected(),
    		index = rec ? _this.store.indexOf(rec) + 1 : 0; 
    	
    	var u = new _this.store.recordType({
            name : '',
            type: 'INT',
            size : '11'
        });
        //editor.stopEditing();
        _this.store.insert(index, u);
        //editor.startEditing(index);		
	}
	
	,insertBeforeField : function() {
		var _this = this,
    		rec = _this.getSelectionModel().getSelected(),
    		index = rec ? _this.store.indexOf(rec) : 0; 
    	
    	var u = new _this.store.recordType({
            name : '',
            type: 'INT',
            size : '11'
        });
        //editor.stopEditing();
        _this.store.insert(index, u);
    	//editor.startEditing(index);		
	}
	
	/**
	 * Deletes field (row) from the grid
	 */
	,deleteField : function() {
		var _this = this,
			records = _this.getSelectionModel().getSelections();	            	
	    if (records.length < 0) {
	        return false;
	    }
	    _this.store.remove(records);		
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
					}), renderer : function(value, metaData, record, rowIndex, colIndex, store) {
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
			    //TODO make a separate component to prevent code cluttering 
			    {header: "Relation", width: 150, sortable: true, dataIndex: 'foreign_table', 
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
			    },
			    {header: "Required", width: 50, sortable: true, dataIndex: 'required', editor: new Ext.form.Checkbox({})}
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
	}
	
}); 

//register xtype
Ext.reg('afStudio.models.gridFieldsPanel', afStudio.models.gridFieldsPanel);
