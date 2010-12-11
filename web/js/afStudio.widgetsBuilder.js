/**
 * Move into overrides or create custom component?
 */

Ext.override(Ext.grid.GridDragZone, {
	afterRepair:function(){
//		Ext.fly(this.DDM.currentTarget).parent('TABLE').frame('#8db2e3', 1);
		Ext.fly(this.DDM.currentTarget).parent('TABLE').frame('#FFA7A7', 1);
	    this.dragging = false;    
	}
});
		    
	        
Ext.ns('afStudio');

/**
 * WidgetsBuilder
 * @class afStudio.widgetsBuilder
 * @extends Ext.Window
 * @author Pavel
 */
afStudio.widgetsBuilder = Ext.extend(Ext.Window, {
	/**
	 * Function onWndShow
	 * Creates Drag/DropZones for FieldsGrid and relataions grid
	 */
	onWndShow: function(){
		var _this = this;
	    
	    /**
	     * DZ for relations grid
	     */
	    var relGridDropTargetEl =  this.relationsGrid.getView().scroller.dom;
	    new Ext.dd.DropTarget(relGridDropTargetEl, {
            ddGroup    : 'widgetsBuilder',
            notifyDrop : function(ddSource, e, data){

                var records =  ddSource.dragData.selections;
                var fr = _this.fieldsGrid.getSelectionModel().getSelected();
				var mn = _this.modelsTree.getSelectionModel().getSelectedNode();
				var m  = _this.modelsTree.getModel(mn);
				
				if(fr){
                    Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
					var r = new _this.RelationRec({
				        id: fr.get('id'),
				        model: m ,
				        name: m + '.' + fr.get('name'),
				        field: fr.get('name'),
				        type: fr.get('type'),
				        size: fr.get('size')
					});
					
                    _this.relationsGrid.store.add(r);
                    _this.relationsGrid.store.sort('name', 'ASC');
                    return true;
				} else {
//					Ext.fly(this.DDM.currentTarget).frame('#8db2e3', 1);
					this.dragging = false;    
				}
            }
        });
		
		/**
		 * Create Basket drop zone
		 */
		var basket = Ext.getCmp('widgets-basket');
		var basketDropTargetEl =  basket.body.dom;

		new Ext.dd.DropTarget(basketDropTargetEl, {
			ddGroup     : 'widgetsBuilderRel',
			notifyEnter : function(ddSource, e, data) {
		        basket.body.stopFx();
		        var grid_id = data.grid.getId();
		        if('fields-grid' == grid_id){
			        return this.dropNotAllowed;
		        } else {
					//Add some flare to invite drop.
					basket.body.highlight('#E56060');
					return this.dropAllowed;
		        }
			},
				
			notifyDrop  : function(ddSource, e, data){
				var grid_id = data.grid.getId();
				if('fields-grid' == grid_id){
					Ext.fly(this.DDM.currentTarget).parent('TABLE').frame('#8db2e3', 1);
					this.dragging = false;
					return false;
				} else {
					var selectedRecord = ddSource.dragData.selections[0];
					ddSource.grid.store.remove(selectedRecord);
					return true;						
				}
			}
		});
	},
	/**
	 * Loads Model's Fields
	 * @param {Ext.tree.TreeNode} modelNode
	 * @param {Function} callback
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
	 * ModelTree <u>click</u> event listener
	 * @param {Ext.tree.TreeNode} node
	 * @param {Ext.EventObject} e
	 */
	onModelClick : function(node, e) {
		this.fieldsGrid.show();
		this.loadModelFields(node);
	},
	
	/**
	 * ModelTree <u>modelsload</u> event listener
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
	 *  
	 * @param {Object} GridView
	 */
	onRelGridRefresh: function(view){
		var grid = view.grid;
   		var ds = grid.getStore();
    	for (var i=0, rcnt=ds.getCount(); i<rcnt; i++) {
    		
    		var rec = ds.getAt(i);
    		
    		var html = '<b>Field Specification</b><br>';
    		html += '<br><b>Model: </b>' + rec.get('model');
    		html += '<br><b>Field: </b>' + rec.get('field');
			
			if(type = rec.get('type')) {
	    		html += '<br><b>Type: </b>' + type;
			}

			if(size = rec.get('size')) {
	    		html += '<br><b>Size: </b>' + size;
			}
			
        	var row = view.getRow(i);
        	var els = Ext.get(row).select('.x-grid3-cell-inner');
    		for (var j=0, ccnt=els.getCount(); j<ccnt; j++) {
          		Ext.QuickTips.register({
            		target: els.item(j),
            		text: html
        		});
    		}
		}
	},
	
	/**
	 * ExtJS template method
	 * @private
	 */
	initComponent: function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.widgetsBuilder.superclass.initComponent.apply(this, arguments);
		this._initEvents();
	},

	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	_initCmp : function() {
		var _this = this;
		
		this.RelationRec = Ext.data.Record.create([
		    {name: 'id', mapping: 'id'},
		    {name: 'model', mapping: 'model'},
		    {name: 'name', mapping: 'name'},
		    {name: 'field', mapping: 'field'},
		    {name: 'type', mapping: 'type'},
		    {name: 'size', mapping: 'size'}
		])
		
		this.relationsGrid = new Ext.grid.GridPanel({
			flex: 1, id: 'rel-grid',
			ddGroup: 'widgetsBuilderRel', enableDragDrop: true,
			store: new Ext.data.ArrayStore({
			    idIndex: 0,  
			    fields: [
			       'id', {name: 'model'}, {name: 'name'},
			       {name: 'field'}, {name: 'type'}, {name: 'size'}
			    ]
			}),
			
			viewConfig: {scrollOffset: 19, forceFit: true},
			
			columns : [
				{header: 'Relation', sortable: true, width: 170, dataIndex: 'name'}
			],
			loadMask: true,
			border: true,
			style: 'padding-bottom: 5px;',
			autoScroll: true
		});
		
		this.fieldsGrid = new Ext.grid.GridPanel({
			ddGroup: 'widgetsBuilder',
			enableDragDrop   : true,
			id: 'fields-grid',
			store: new Ext.data.JsonStore({
				autoLoad: false,
				url: _this.fieldsUrl,
				baseParams: {xaction: 'read'},
				root: 'rows',
				idProperty: 'id',    							
				fields: ['id', 'name', 'type', 'size', 'required']
			}),
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			}),
			columns : [
				{header: 'Name', sortable: true, width: 150, dataIndex: 'name'},
				{header: 'Type', sortable: true, width: 110, dataIndex: 'type'},
				{header: 'Size', sortable: true, width: 60, dataIndex: 'size'}
			],
			loadMask: true,
			border: false,
			autoScroll: true,
			hidden: true,
			ref: '../fieldsGrid'
		});
		
		this.basket = new Ext.Panel({
			xtype: 'panel', id: 'widgets-basket', 
			html: '<center><br>Drop Item and remove it <br>from Relation grid</br></center>', 
			bodyStyle: 'padding: 5px;', height: 70, width: 234
		});
		
		return {
			title: 'Create new widget',
			width: 840, height: 450,
			modal: true, maximizable: true,			

			layout: 'border',
			items: [
				{region: 'north', margins: '5 5 0 5', height: 33,
					layout: 'fit', border: false, bodyBorder: false,
					defaults: {border: false, bodyBorder: false},
//					hideBorders: true,
					items: [
						{xtype: 'form', defaults: {border: false, bodyBorder: false},
							items: [
								{xtype: 'panel', layout: 'column', defaults: {border: false, bodyBorder: false},
									bodyStyle: 'padding: 5px;',
									items: [
										{columnWidth: .5, style: 'padding-right: 5px;', layout: 'form', labelWidth: 40,
											items: [
												{xtype: 'textfield', fieldLabel: 'Name', anchor: '100%'}
											]
										},
										{columnWidth: .5, layout: 'form', labelWidth: 40,
											items: [
												{xtype: 'combo', fieldLabel: 'Type', triggerAction: 'all', anchor: '100%', 
													store: [['list', 'List'], ['grid', 'Grid'], ['edit', 'Edit'], ['show', 'Show']],
													value: 'list'
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					region: 'west', layout: 'fit',
					margins: '5 5 5 5', width: 220,
					items: [
						{xtype: 'afStudio.models.modelTree', url: _this.modelsUrl, border: false, ref: '../modelsTree'}
					]
				}, {	
					region: 'center', margins: '5 5 5 0', layout: 'fit',
					items: this.fieldsGrid
				},{	
					region: 'east', margins: '5 5 5 0', 
					width: 235, layout: 'vbox', 
					border: false, bodyBorder: false,
					bodyStyle: 'background-color: #DFE8F6',
					items: [this.relationsGrid, this.basket]
				}
			],
			buttons: [
				{text: 'Create widget', handler: this.create, scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		}		
	},
	
	create: function(){
		var items = [];
		this.relationsGrid.getStore().each(function(rec){
			items.push(rec.get('name'))
		});
		alert('Selected fields: ' + items.toString())
	},
	
	cancel: function(){
		this.close();
	},
	
	/**
	 * Initializes events
	 * @private
	 */
	_initEvents : function() {
		this.on('show', this.onWndShow, this);
		this.relationsGrid.getView().on('refresh', this.onRelGridRefresh);
		this.modelsTree.on({
			'click' : Ext.util.Functions.createDelegate(this.onModelClick, this),
			'modelsload' : Ext.util.Functions.createDelegate(this.onModelsLoad, this)			
		});
	}
});