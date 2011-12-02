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
	 * @cfg {String} (required) model The model name
	 */
	
	/**
	 * @cfg {String} (required) schema The schema path
	 */
	
	/**
	 * @cfg {Object} (required) _data The model's fields definition object
	 */
	
	/**
	 * Saves Model structure
	 */
	saveModel : function() {
		var me   = this,
			    s   = me.getStore(),
			  url   = s.proxy.url,
			   rs   = s.getRange(),
		 aRecords   = [],
		 is_renamed = false;
		
		Ext.each(rs, function(i, idx) {
			aRecords.push(i.data);
		});
        
        if (!Ext.isEmpty(s.getModifiedRecords())) {
            Ext.each(s.getModifiedRecords(), function(i, idx) {
                if (!is_renamed && i.json && i.data.name != i.json.name) is_renamed = true;
            });
        }
        
        var send_request = function(me, records) {
            afStudio.vp.mask({region:'center', msg: 'Altering ' + me.model + ' model...'});
            
    		Ext.Ajax.request({
    			url: url,
    			params: {
    				xaction: 'alterModel',
    				model: me.model, 
    				schema: me.schema,
    				fields: Ext.encode(aRecords)
    			},
    			success: function(xhr, opt) {
    				afStudio.vp.unmask('center');

    				var response = Ext.decode(xhr.responseText);

    				var message = String.format('"{0}" model structure was saved', me.model);
    				me.fireEvent("logmessage", me, message);

    				if (response.success) {					
    					afStudio.Msg.info(response.message);
    					s.commitChanges();
    					me.fireEvent('altermodel');
    				} else {
    					me.fireEvent('altermodelexception', xhr);
    					afStudio.Msg.warning(response.message);
    				}
    			},
    			failure: function(xhr, opt) {				
    				afStudio.vp.unmask('center');
    				me.fireEvent('altermodelfailure', xhr);				
    				afStudio.Msg.error('Status: ' + xhr.status);
    			}
    		});
        };
		
		if (is_renamed) {
		    Ext.MessageBox.confirm('Confirm', 'Field name has been changed - all data for old field will be lost. Are you sure you want to do that?', function(btn) {
                if (btn == 'yes') send_request(me, aRecords);
            })
		} else {
		    send_request(me, aRecords);
		}
	},
	//eo saveModel
	
	/**
	 * Inserts row after the selection
	 */
	insertAfterField : function() {
		var me = this,
    		cell = me.getSelectionModel().getSelectedCell(),
    		index = cell ? cell[0] + 1 : (me.store.getCount() > 0 ? 1 : 0);
    		
    	var u = new me.store.recordType({
            name: '',
            type: 'integer',
            required: false,
            primaryString: false
        });
        me.stopEditing();
        me.store.insert(index, u);
		me.startEditing(index , cell ? cell[1] : 0);		
	},
	
	/**
	 * Inserts row before the selection
	 */
	insertBeforeField : function() {
		var me = this,
    		cell = me.getSelectionModel().getSelectedCell(),
    		index = cell ? cell[0] : 0; 
    	
    	var u = new me.store.recordType({
            name : '',
            type: 'integer',
            required: false,
            primaryString: false
        });
        me.stopEditing();
        me.store.insert(index, u);
		me.startEditing(index, cell ? cell[1] : 0);		
	},
	
	/**
	 * Deletes field (row) from the grid
	 */
	deleteField : function() {
		var me = this,
			cell = me.getSelectionModel().getSelectedCell();			
	    if (cell) {
	    	var r = me.store.getAt(cell[0]);
	    	me.store.remove(r);	        
	    }	    		
	},
	
	/**
	 * Creates Boolean Editor
	 * @private
	 * @return {Ext.form.ComboBox} editor 
	 */
	booleanEditorBuilder : function() {
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
			    return '<div class="x-grid3-check-col' + (v ? '-on' : '') + '" />';
			}
		}
	},
	
	/**
	 * Creates TypeComboBox Editor
	 * @private
	 * @return {afStudio.models.TypeComboBox} editor
	 */
	typeEditorBuilder : function() {
		return {
			editor: new afStudio.models.TypeComboBox({
				lazyRender: true
			})
		}
	},
	
	/**
	 * @private
	 * @return {}
	 */
	nameEditorBuilder : function() {
		var me = this,
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
	},
	
	/**
	 * Loads data inside grid
	 * @param {Object} data
	 */
	loadModelData : function(data) {
		this.getStore().loadData(data);
	},
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} configuration object
	 */
	_beforeInitComponent : function() {
		var me = this;
		
		function keyConverter(v, rec) {
			return rec.primaryKey ? 'primary' : (rec.index == 'unique' ? 'unique' : (rec.index ? 'index' : null));
		}
		
		function relationConverter(v, rec) {
			return (rec.foreignModel && rec.foreignReference) ? rec.foreignModel + '.' + rec.foreignReference : null;
		}
		
		var fieldsStore = new Ext.data.JsonStore({			
			url: afStudioWSUrls.modelListUrl,
			autoLoad: false,
		    baseParams: {
		    	xaction: 'read',
		    	model: me.model,
		    	schema: me.schema
		    },
		    storeId: 'model-fields-st', 
		    root: 'data',
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
			    {name: 'primaryString', type: 'boolean', defaultValue: false},
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
				renderer : function(value) {
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
				editor: me.nameEditorBuilder().editor
			},{
				header: "Type",
				width: 100,
				dataIndex: 'type',
				editor: me.typeEditorBuilder().editor
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
				editor: me.booleanEditorBuilder().editor,
				renderer: me.booleanEditorBuilder().renderer
			},{
				header: "Default value",
				width: 100,
				dataIndex: 'default',
				editor: new Ext.form.TextField()
			},{
				header: "Relation",
				width: 150,
				dataIndex: 'relation',
				editor: new afStudio.models.RelationCombo({
					relationUrl: afStudioWSUrls.modelListUrl,
					fieldsGrid: me
				})
			},{
				header: "Required",
				width: 50,
				dataIndex: 'required',
				align: 'center', 
				editor: me.booleanEditorBuilder().editor,
				renderer: me.booleanEditorBuilder().renderer
			},{
				header: "On Delete",
				width: 50,
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
			},{
				header: "ObjectToString",
				width: 60,
				dataIndex: 'primaryString',
				align: 'center',
				xtype: 'templatecolumn',
				tpl: '<input type="radio" name="primaryString" <tpl if="primaryString">checked="checked"</tpl> />',
				listeners: {
					click: function(clm, grid, rowIndex, e) {
						if (Ext.get(e.target).is('input[type=radio]')) {
							var st = grid.getStore(),
								r = st.getAt(rowIndex);
								
							st.each(function(r){
								r.set('primaryString', false);
							});
							r.set('primaryString', true);
							st.commitChanges();
						}
					}
				}
			}]
		});	
		
		var topToolbar = new Ext.Toolbar({
			items: [
	        {
	            text: 'Save',
	            iconCls: 'icon-save',
	            scope: me,
	            handler: me.saveModel
	        },'-',{
	        	text: 'Create Widget',
	        	iconCls: 'icon-widgets-add',
	        	handler: function(btn, e) {
	        		var w = me.ownerCt.getCreateWidgetWindow();
	        		w.show();
	        	}
	        },'-',{	        	
	            text: 'Insert',
	            iconCls: 'icon-add',
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
	            iconCls: 'afs-icon-delete',
	            scope: me,
	            handler: me.deleteField
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
	},
	//eo _beforeInitComponent
	 
	/**
	 * Template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.models.FieldsGrid.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	},
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	_afterInitComponent : function() {
		var me = this,
			store = me.getStore(),
			   cm = me.getColumnModel();

		me.addEvents(
			/**
			 * @event altermodel Fires after the model was successfully altered.
			 */
			'altermodel',
			
			/**
			 * @event altermodelexception Fires if an error was happend during altering model.
			 * @param {Object} The XMLHttpRequest object containing the response data.
			 */
			'altermodelexception',
			
			/**
			 * @event altermodelfailure Fires if an error HTTP status was returned from the server during altering model.
			 * @param {Object} The XMLHttpRequest object containing the response data.
			 */
			'altermodelfailure'
		);
		
		//Load Model structure
		me.loadModelData(me._data);
	}
	//eo _afterInitComponent
	
}); 

/**
 * @type 'afStudio.models.fieldsGrid'
 */
Ext.reg('afStudio.models.fieldsGrid', afStudio.models.FieldsGrid);