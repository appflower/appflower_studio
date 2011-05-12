Ext.ns('afStudio.models');

/**
 * Models FieldsGrid responsible for manipulations 
 * with Model's structure  
 * 
 * @class afStudio.models.FieldsGrid
 * @extends Ext.grid.EditorGridPanel
 * @author Nikolai Babinski
 */
afStudio.models.FieldsGrid = Ext.extend(Ext.grid.EditorGridPanel, {
	
	/**
	 * @cfg {String} model required
	 * This model name
	 */
	
	/**
	 * @cfg {String} schema required
	 * This model's schema name
	 */
	
	/**
	 * Saves Model structure
	 */
	saveModel : function() {
		var _this = this,
			    s = _this.getStore(),
			  url = s.proxy.url,
			   rs = s.getRange(),
		 aRecords = [];
				 
		Ext.each(rs, function(i, idx){
			aRecords.push(i.data);
		});
		
		afStudio.vp.mask({region:'center', msg:'Altering ' + _this.model + ' model...'});
		
		Ext.Ajax.request({
			url: url,
			params: {
				xaction: 'alterModel',
				model: _this.model, 
				schema: _this.schema,
				fields: Ext.encode(aRecords)
			},
			success: function(xhr, opt) {
				if(_this.ownerCt && _this.ownerCt._node)
            		var message = "model "+_this.ownerCt._node.text+" Config Saved";
            	else 
            		var message = "model Config Saved";
				_this.fireEvent("logmessage",_this,message);
				
				var response = Ext.decode(xhr.responseText);
				afStudio.vp.unmask('center');
				if (response.success) {					
					s.commitChanges();					
					_this.fireEvent('altermodel');
					
	            	
				} else {
					_this.fireEvent('altermodelexception', xhr);
					Ext.Msg.alert('Warning', response.message);
				}
			},
			failure: function(xhr, opt) {
				
				afStudio.vp.unmask('center');
				_this.fireEvent('altermodelfailure', xhr);				
				Ext.Msg.alert('Failure', 'Status: ' + xhr.status);
			}
		});
	}//eo saveModel
	
	/**
	 * Inserts row after the selection
	 */
	,insertAfterField : function() {
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
	
	/**
	 * Inserts row before the selection
	 */
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
	 * Creates Boolean Editor
	 * @private
	 * @return {Ext.form.ComboBox} editor 
	 */
	,booleanEditorBuilder : function() {
		return {
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
	}
	
	/**
	 * Creates TypeComboBox Editor
	 * @private
	 * @return {afStudio.models.TypeComboBox} editor
	 */
	,typeEditorBuilder : function() {
		return {
			editor: new afStudio.models.TypeComboBox({
				lazyRender: true
			})
		}
	}
	
	/**
	 * @private
	 * @return {}
	 */
	,nameEditorBuilder : function() {
		var _this = this,
			names = [];
		return {						
			editor: new Ext.form.TextField({
				allowBlank: false,
				maskRe: /[\w]/,
				validator: function(value) {
					return /^[^\d]\w*$/im.test(value) ? true : afStudio.models.TypeBuilder.invalidFieldName;					
				}
			})
		}
	}
	
	/**
	 * Loads data inside grid
	 * @param {Object} data
	 */
	,loadModelData : function(data) {
		this.getStore().loadData(data);
	}
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		function keyConverter(v, rec) {
			return rec.primaryKey ? 'primary' : (rec.index == 'unique' ? 'unique' : (rec.index ? 'index' : null));
		}		
		function relationConverter(v, rec) {
			return (rec.foreignModel && rec.foreignReference) ? rec.foreignModel + '.' + rec.foreignReference : null;
		}
		
		var fieldsStore = new Ext.data.JsonStore({			
			url: window.afStudioWSUrls.getModelsUrl(),
			autoLoad: false,
		    baseParams: {
		    	xaction: 'read',
		    	model: _this.model,
		    	schema: _this.schema
		    },
		    storeId: 'model-fields-st', 
		    root: 'rows',
		    idProperty: 'id',
		    fields: [		    
				{name: 'id'},
				{name: 'key', mapping: 'id', convert: keyConverter}, //fake field
				{name: 'relation', mapping: 'id', convert: relationConverter}, //fake field 
				{name: 'autoIncrement'},
				{name: 'primaryKey'},
				{name: 'index'},
			    {name: 'name'},
			    {name: 'type'},
			    {name: 'size'},
			    {name: 'required'},			    
			    {name: 'default'},
			    {name: 'foreignTable'},
			    {name: 'foreignModel'},
			    {name: 'foreignReference'},
			    {name: 'onDelete'}
		    ]
		});		
				
		var columnModel = new Ext.grid.ColumnModel({
			defaults: {
				sortable: true
			},
			columns: [
			{	//Key				
				header: '<div class="model-pk-hd">&#160;</div>', 
				width: 25, 
				dataIndex: 'key',					
				editor: new Ext.form.ComboBox({
					typeAhead: true,
					triggerAction: 'all',
					lazyRender: true,
					editable: false,
					mode: 'local',
					valueField: 'field',
					displayField: 'field',
					store: [['', 'None'], ['primary', 'Primary'], ['index', 'Index'], ['unique', 'Unique']]
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
				editor: _this.nameEditorBuilder().editor
			},{
				header: "Type",
				width: 100,
				dataIndex: 'type',
				editor: _this.typeEditorBuilder().editor
			},{
				header: "Size",
				width: 50,
				dataIndex: 'size',
				editor: new Ext.form.NumberField({
					allowDecimals: false,
					allowNegative: false
				})
			},{
				header: "Autoincrement",
				width: 55,
				dataIndex: 'autoIncrement',
				editor: _this.booleanEditorBuilder().editor,
				renderer: _this.booleanEditorBuilder().renderer
			},{
				header: "Default value",
				width: 100,
				dataIndex: 'default',
				editor: new Ext.form.TextField()
			},{
				header: "Relation",
				width: 150,
				sortable: true,
				dataIndex: 'relation',
				editor: new afStudio.models.RelationCombo({
					relationUrl: window.afStudioWSUrls.getModelsUrl(),
					fieldsGrid: _this
				})
			},{
				header: "Required",
				width: 50,
				sortable: true,
				dataIndex: 'required',
				align: 'center', 
				editor: _this.booleanEditorBuilder().editor,
				renderer: _this.booleanEditorBuilder().renderer
			},{
				header: "On Delete",
				width: 50,
				sortable: true,
				dataIndex: 'onDelete',
				align: 'center', 
				editor: new Ext.form.ComboBox({
					typeAhead: true,
					triggerAction: 'all',
					lazyRender: true,
					editable: false,
					mode: 'local',
					valueField: 'field',
					displayField: 'field',
					value: 'none',
					store : [['cascade', 'cascade'], ['setnull', 'setnull'], ['restrict', 'restrict'], ['none', 'none']]    
	    		})
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
	            iconCls: 'afs-icon-delete',
	            handler: Ext.util.Functions.createDelegate(_this.deleteField, _this)
	        }]
		});		
		
		return {			
			title: 'Model Config',
			iconCls: 'icon-table-gear',			
			clicksToEdit: 1,			
	        store: fieldsStore,
	        colModel: columnModel,
	        columnLines: true,			
			loadMask: true,
	        autoScroll: true,
	        tbar: topToolbar,
	        viewConfig: {
	            forceFit: true
	        },
	        plugins: ['cellEditorBuilder']
		}
	}//eo _beforeInitComponent
	 
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.models.FieldsGrid.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this,
			store = _this.getStore(),
			   cm = _this.getColumnModel();

		_this.addEvents(
			/**
			 * @event altermodel 
			 * Fires after the model was successfully altered.
			 */
			'altermodel',
			
			/**
			 * @event altermodelexception 
			 * Fires if an error was happend during altering model.
			 * @param {Object} The XMLHttpRequest object containing the response data.
			 */
			'altermodelexception',
			
			/**
			 * @event altermodelfailure
			 * Fires if an error HTTP status was returned from the server during altering model.
			 * @param {Object} The XMLHttpRequest object containing the response data.
			 */
			'altermodelfailure'
		);
		
		//Load Model structure
		_this.loadModelData(_this._data);
		
	}//eo _afterInitComponent
	
}); 

/**
 * @type 'afStudio.models.fieldsGrid'
 */
Ext.reg('afStudio.models.fieldsGrid', afStudio.models.FieldsGrid);