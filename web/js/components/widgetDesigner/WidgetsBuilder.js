/**
 * Move into overrides or create custom component?
 * TODO should be done via inheritance (Ext.extend) @Nick
 */
Ext.override(Ext.grid.GridDragZone, {
	afterRepair : function() {
		Ext.fly(this.DDM.currentTarget).parent('TABLE').frame('#FFA7A7', 1);
	    this.dragging = false;    
	}
});
		    
Ext.ns('afStudio.wd');

/**
 * WidgetsBuilder
 * @class afStudio.wd.WidgetsBuilder
 * @extends Ext.Window
 * @author PavelK
 */
afStudio.wd.WidgetsBuilder = Ext.extend(Ext.Window, {
	
	/**
	 * @cfg {String} (required) placeType
	 * Where will be placed created widget. ('app'/'plugin')
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var me = this;
		
		this.RelationRec = Ext.data.Record.create([
		    'id',
		    'model',
		    'name',
		    'field',
		    'type',
		    'size'
		]);
		
		this.relationsGrid = new Ext.grid.GridPanel({
			id: 'rel-grid',
			flex: 1, 
			ddGroup: 'widgetsBuilderRel',
			enableDragDrop: true,
			loadMask: true,
			border: true,
			style: 'padding-bottom: 5px;',
			autoScroll: true,
			store: new Ext.data.ArrayStore({
			    idIndex: 0,
			    fields: ['id', 'model', 'name', 'field', 'type', 'size']
			}),
			viewConfig: {
				scrollOffset: 19, 
				forceFit: true
			},
			columns: [
			{
				header: 'Selected fields', 
				sortable: false, 
				menuDisabled: true,
				width: 170, 
				dataIndex: 'name'
			}],
			bbar: {
				items: ['->',
				{
					text: 'Remove All',
					ref: '../removeAllBtn',
					iconCls: 'afs-icon-delete',
					disabled: true,
					handler: function() {
						var fields = me.relationsGrid.store.getRange();
						me.removeSelectedFields(fields);
					}
				}]
			}
		});
		
		this.basket = new Ext.Panel({
			id: 'widgets-basket',
			height: 70,
			bodyStyle: 'padding: 5px;',
			html: '<center><br>Drop Item here,<br> to remove it</br></center>' 
		});
		
		var fieldsSm = new Ext.grid.CheckboxSelectionModel();
		
		this.fieldsGrid = new Ext.grid.GridPanel({
			id: 'fields-grid',
			ddGroup: 'widgetsBuilder',
			enableDragDrop: true,
			store: new Ext.data.JsonStore({
				url: afStudioWSUrls.modelListUrl,
				autoLoad: false,				
				baseParams: {
					xaction: 'read'
				},
				root: 'data',
				idProperty: 'id',    							
				fields: ['id', 'name', 'type', 'size', 'required']
			}),
			sm: fieldsSm, 
			columns: [
				fieldsSm,
				{header: 'Name', dataIndex: 'name'},
				{header: 'Type', width: 110, align: 'center', dataIndex: 'type'},
				{header: 'Size', width: 44, align: 'right', dataIndex: 'size'}
			],
			autoExpandColumn: 1,
			loadMask: true,
			border: false,
			autoScroll: true,
			hidden: true
		});
		
		this.modulesCombo = new Ext.ux.form.GroupingComboBox({
			mode: 'local',
			groupField: 'group',
			valueField: 'value',
			displayField: 'text',
			forceSelection: true,
            fieldLabel: 'Module Location',
			loadingText: 'Please wait...',
			emptyText: 'Please select the module location...',
			allowBlank: false,
			blankText: 'Module is required',
			msgTarget: 'qtip',
            store: new Ext.data.JsonStore({
	            url: afStudioWSUrls.moduleGroupedUrl,
            	autoLoad: true,
	            baseParams: {
	            	type: me.placeType
	            },
	            totalProperty: 'total',
	            root: 'data',
	            idProperty: 'value',
	            fields: ['value', 'text', 'group']       	
            }),
			anchor: '100%',
            hiddenName: 'model'
		});		
		
		this.actionInput = new Ext.form.TextField({
			fieldLabel: 'Widget Name',
			allowBlank: false,
			blankText: 'Widget name is required',
			msgTarget: 'qtip',
			anchor: '100%'
		});
				
		this.typeCombo = new Ext.form.ComboBox({
            fieldLabel: 'Widget Type', 
            triggerAction: 'all', 
            anchor: '100%',
            forceSelection: true,
			store: [
				['list', 'List'], 
				['edit', 'Edit'], 
				['show', 'Show']
			],
			value: 'list'
		});
		
		this.widgetForm = new Ext.FormPanel({
			labelWidth: 100,
			bodyStyle: 'padding: 5px;', 
			items: [
				this.modulesCombo,
				this.actionInput,
				this.typeCombo
			]
		});
		
		return {
			title: 'Create new widget',
			y: 150,
			width: 450, height: 150,
			modal: true, 
			tbar: {
				id: this.id + 'help-toolbar', 
				hidden: true,
				items: [
					'Please select the fields for each model you want to have displayed in your Widget. And drag each field to the Selected fields area.'
				]
			},
			layout: 'card',
			activeItem: 0,
			defaults: {
				border: false, 
				bodyBorder: false
			},
			items: [
			{
				hideBorders: true,
				items: me.widgetForm 
			},{
				layout: 'border',
				items: [
				{
					region: 'west', 
					margins: '5 5 5 5',
					layout: 'fit',
					width: 220,
					items: [
					{
						xtype: 'afStudio.models.modelTree', 
						ref: '../../modelsTree',
						border: false
					}]
				},{	
					region: 'center', 
					margins: '5 5 5 0', 
					layout: 'fit',
					items: this.fieldsGrid
				},{	
					region: 'east',
					margins: '5 5 5 0', 
					layout: 'vbox',
					layoutConfig: {
						align: 'stretch'
					},
					width: 235, 
					border: false, bodyBorder: false,
					bodyStyle: 'background-color: #DFE8F6',
					items: [
						this.relationsGrid, 
						this.basket
					]
				}]
			}],
			buttonAlign: 'left',
			buttons: [
			{
				text: 'Cancel', 
				scope: this,
				handler: this.cancel 
			},'->',{	
				text: '&laquo; Back',
				id: this.id + '-back-btn',
				disabled: true,
				handler: this.chStep.createDelegate(me, [0]) 
			},{
				text: 'Next &raquo;',
				id: this.id + '-next-btn',
				handler: this.chStep.createDelegate(me, [1])
			},{
				text: 'Save &raquo;',
				id: this.id + '-save-btn',
				hidden: true,
				scope: this,
				handler: this.create 
			}]
		};	
	},
	//eo _beforeInitComponent	
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initComponent: function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.wd.WidgetsBuilder.superclass.initComponent.apply(this, arguments);
		
		this._afterInitComponent();
	},

	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	_afterInitComponent : function() {
		
		this.addEvents(
			/**
			 * @event widgetcreated Fires when widget was created.
			 * @param {Object} response The response object:
			 * <ul>
			 * 	<li><b>place</b>{String} : The widget place name</li>
			 * 	<li><b>placeType</b>{String} : The place type (app/plugin)</li>
			 * 	<li><b>module</b>{String} : The module name</li>
			 * 	<li><b>widgetUri</b>{String} : The widget URI</li>
			 * 	<li><b>securityPath</b>{String} : The security file path for widget</li>
			 * 	<li><b>xmlPath</b>{String} : The widget xml definition file path</li>
			 * 	<li><b>actionPath</b>{String} : The actions for a widget path</li>
			 * 	<li><b>actionName</b>{String} : The actions file name</li>
			 * 	<li><b>name</b>{String} : The widget name</li>
			 * </ul>
			 */
			'widgetcreated'
		);
		
		this.on('show', this.onWndShow, this);
		
		this.relationsGrid.getView().on('refresh', this.onRelGridRefresh);
		
		this.modelsTree.on({
			scope: this,
			click: this.onModelClick,
			modelsload: this.onModelsLoad			
		});
	},
	//eo _afterInitComponent
	
	/**
	 * Function onWndShow
	 * Creates Drag/DropZones for FieldsGrid and relataions grid
	 */
	onWndShow : function() {
		var me = this;
	    
	    /**
	     * DZ for relations grid
	     */
	    var relGridDropTargetEl =  this.relationsGrid.getView().scroller.dom;
	    
	    new Ext.dd.DropTarget(relGridDropTargetEl, {
            ddGroup: 'widgetsBuilder',
            
            notifyDrop: function(ddSource, e, data) {
                var records = ddSource.dragData.selections,
					mn = me.modelsTree.getSelectionModel().getSelectedNode(),
					m  = me.modelsTree.getModel(mn);
				
				if (!Ext.isEmpty(records)) {
					
					ddSource.grid.store.remove(records);
					
					Ext.each(records, function(r) {
						var r = new me.RelationRec({
					        id: r.get('id'),
					        model: m,
					        name: m + '.' + r.get('name'),
					        field: r.get('name'),
					        type: r.get('type'),
					        size: r.get('size'),
							required: r.get('required')
						});
		                me.relationsGrid.store.add(r);
					});
					
					me.relationsGrid.removeAllBtn.enable();
					
                    return true;
                    
				} else {
					this.dragging = false;
				}
            }
        });

		/**
		 * Create Basket drop zone
		 */
		var basket = me.basket;
		var basketDropTargetEl =  basket.body.dom;

		new Ext.dd.DropTarget(basketDropTargetEl, {
			ddGroup: 'widgetsBuilderRel',
			
			notifyEnter: function(ddSource, e, data) {
		        basket.body.stopFx();
		        var grid_id = data.grid.getId();
		        if ('fields-grid' == grid_id) {
			        return this.dropNotAllowed;
		        } else {
					//Add some flare to invite drop.
					basket.body.highlight('#E56060');
					return this.dropAllowed;
		        }
			},
				
			notifyDrop: function(ddSource, e, data) {
				var grid_id = data.grid.getId();
				
				if ('fields-grid' == grid_id) {
					Ext.fly(this.DDM.currentTarget).parent('TABLE').frame('#8db2e3', 1);
					this.dragging = false;
					return false;
				} else {
					me.removeSelectedFields(ddSource.dragData.selections);
					return true;						
				}
			}
		});
	},
	//eo onWndShow

	/**
	 * Removes selected records from relationsGrid.
	 * @private
	 * @param {Array} fields The array of field records
	 */
	removeSelectedFields : function(fields) {
		if (Ext.isEmpty(fields)) {
			return;
		}

		this.relationsGrid.store.remove(fields);
		
		if (this.relationsGrid.store.getCount() == 0) {
			this.relationsGrid.removeAllBtn.disable();
		}
					
		var mn = this.modelsTree.getSelectionModel().getSelectedNode(),
			m  = mn ? this.modelsTree.getModel(mn) : null,
			fs = this.fieldsGrid.store;
		
		if (m == null) {
			return; 	
		}
			
		Ext.each(fields, function(r) {
			if (r.get('model') == m && !fs.getById(r.get('id'))) {
				var rec = new fs.recordType({
					id: r.get('id'),
					name: r.get('field'),
					type: r.get('type'),
					size: r.get('size'),
					required: r.get('required')
				});
				fs.add(rec);
			}
		});
	},
	
	/**
	 * Loads model's fields.
	 * @private
	 * @param {Ext.tree.TreeNode} modelNode The model to be loaded
	 * @param {Function} (optional) callback The callback function 
	 */
	loadModelFields : function(modelNode, callback) {
		var s = this.modelsTree.getSchema(modelNode),
			m = this.modelsTree.getModel(modelNode);
			
		this.fieldsGrid.getStore().load({
			params: {schema: s, model: m},
			callback: callback || Ext.emptyFn
		});
	},
	
	/**
	 * ModelTree <u>click</u> event listener.
	 * @param {Ext.tree.TreeNode} node
	 * @param {Ext.EventObject} e
	 */
	onModelClick : function(node, e) {
		this.fieldsGrid.show();
		this.loadModelFields(node);
	},
	
	/**
	 * ModelTree <u>modelsload</u> event listener.
	 * @param {Ext.tree.Loader} loader
	 * @param {XMLHttpRequest} response
	 */
	onModelsLoad : function(loader, response) {
		this.fieldsGrid.getStore().removeAll();
		this.fieldsGrid.hide();
	},
	
	/**
	 * Function onRelGridRefresh
	 * Function creates Tooltips with specification of selected field.
	 * @param {Ext.grid.GridView} view The {@link #relationsGrid} view   
	 */
	onRelGridRefresh : function(view) {
		var grid = view.grid,
   		      ds = grid.getStore();
   		
    	for(var i = 0, rcnt = ds.getCount(); i < rcnt; i++) {
    		
    		var rec = ds.getAt(i);
    		
    		var html = '<b>Field Specification</b><br>';
    		html += '<br><b>Model: </b>' + rec.get('model');
    		html += '<br><b>Field: </b>' + rec.get('field');

    		var type = rec.get('type');
			if (type) {
	    		html += '<br><b>Type: </b>' + type;
			}
			var size = rec.get('size');
			if (size) {
	    		html += '<br><b>Size: </b>' + size;
			}
			
        	var row = view.getRow(i);
        	var els = Ext.get(row).select('.x-grid3-cell-inner');
    		for (var j = 0, ccnt = els.getCount(); j < ccnt; j++) {
          		Ext.QuickTips.register({
            		target: els.item(j),
            		text: html
        		});
    		}
		}
	},
	//eo onRelGridRefresh
	
	/**
	 * Function chStep
	 * Changes wizard step and prepares page UI
	 * @param {Number} stepNo The new step number
	 */
	chStep : function(stepNo) {
		var size;
			
		if (stepNo == 1) {
			//small validation fix
			var form = this.widgetForm;
			if (!form.getForm().isValid()) {
				return;
			}
			size = {width: 840, height: 450};
			Ext.getCmp(this.id + '-save-btn').show();
			Ext.getCmp(this.id + '-next-btn').hide();
			Ext.getCmp(this.id + '-back-btn').enable();
			Ext.getCmp(this.id + 'help-toolbar').show();
			
		} else {
			size = {width: 450, height: 150};
			Ext.getCmp(this.id + '-save-btn').hide();
			Ext.getCmp(this.id + '-next-btn').show();
			Ext.getCmp(this.id + '-back-btn').disable();
			Ext.getCmp(this.id + 'help-toolbar').hide();
		}
		
		this.setSize(size);
		this.setPagePosition((Ext.getBody().getWidth() - size.width) / 2, 150);		
		this.getLayout().setActiveItem(stepNo);
	},
	
	/**
	 * Function create
	 * Handler for "Create Widget" operation
	 */
	create : function() {
		var items = [];
		
		//each item contains data.field, data.id, data.model, data.name, data.size, data.type
		this.relationsGrid.getStore().each(function(rec) {
            if (rec.data) {
                items.push(rec.data);
            }
		});
		
		if (Ext.isEmpty(items)) {
			afStudio.Msg.warning('Widget Builder', 'Widget can be created - <u>no one field is selected</u>');
			return;
		}
		
		var module    = this.modulesCombo.getValue(),
			moduleRec = this.modulesCombo.getStore().getById(module),
			action    = this.actionInput.getValue(),
			widgetUri = module + '/' + action,			
			type      = this.typeCombo.getValue(),
			place     = moduleRec.get('group');		
		
		var wDefinition = this.buildWidgetDefinition(action, type, items);
		
		afStudio.xhr.executeAction({
			url: afStudioWSUrls.widgetSaveDefinitionUrl,
			params: {
				uri: widgetUri,
		    	data: Ext.util.JSON.encode(wDefinition),
				createNewWidget: true,
				widgetType: type,
				place: place,
				placeType: this.placeType
			},
			mask: true,
			scope: this,
			run: function(response, ops) {
				this.fireEvent('widgetcreated', response);
				this.close();
			}
		});
	},
	//eo create
	
	/**
	 * Function cancel
	 * Close window
	 */
	cancel : function() {
		this.close();
	},
	
	/**
	 * Returns widget definition object. 
	 * TODO should be extended for the rest types of widgets 
	 * @private
	 * @param {String} title The widget title
	 * @param {String} type The type of widget
	 * @param {Object} fields The widget's fields
	 * @return {Object} widget definition
	 */
	buildWidgetDefinition : function(title, type, fields) {
		var meta = afStudio.WD.getViewCarcass(type),
			nd = afStudio.ModelNode;
			
		meta[nd.TITLE] = title;
		meta[nd.FIELDS] = {};
		
		//fields
		var clm;
		if (fields.length > 1) {
			clm = [];
			Ext.each(fields, function(f){
				clm.push({
					attributes: {
						name: f.field,
						label: f.field
					}
				});				
			});
		} else {
			clm = {
				attributes: {
					name: fields[0].field,
					label: fields[0].field
				}
			};
		}
		if (type != 'list') {
			meta[nd.FIELDS][nd.FIELD] = clm;
		} else {
			meta[nd.FIELDS][nd.COLUMN] = clm;
		}

		//datasource
		//getting the model from the first field
		var model = fields[0].model,
		ds = meta[nd.DATA_SOURCE] = {
			attributes: {
				type: 'orm'
			}
		};
		var mth = ds[nd.METHOD] = {
			attributes: {
				name: null
			}
		};
		if (type == 'list') {
			ds.attributes.modelName = model;
			ds[nd.CLASS] = 'ModelCriteriaFetcher';
			mth.attributes.name = 'getDataForList';
			mth[nd.PARAM] = {
				attributes: {
					name: 'modelName'
				},
				_content: model
			};
		} else {
			ds[nd.CLASS] = model + 'Peer';
			mth.attributes.name = 'retrieveByPk';
			mth[nd.PARAM] = {
				attributes: {
					name: 'id'
				},
				_content: '{id}'
			};
		}
		
		return meta;
	}
	//eo buildWidgetDefinition
});