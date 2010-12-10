Ext.ns('afStudio');

/**
 * WidgetsBuilder
 * @class afStudio.widgetsBuilder
 * @extends Ext.Window
 * @author Pavel
 */
afStudio.widgetsBuilder = Ext.extend(Ext.Window, {	
	
	/**
	 * Closes Picker
	 */
	closePicker : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();	
		}				
	}
	
	/**
	 * "ok" button handler
	 */
	,pickRelation : function() {
		var _this = this,
			   mn =	this.modelsTree.getSelectionModel().getSelectedNode(),
			   fr = this.fieldsGrid.getSelectionModel().getSelected(),
			    m = this.modelsTree.getModel(mn), 
			    f = fr.get('name');
		this.closePicker();
		this.fireEvent('relationpicked', m + '.' + f);
	}
	
	/**
	 * The initial relation pickup 
	 * @param {String} relation The model.field from relation field 
	 */
	,initialRelationPick : function(relation) {		
		var _this = this,
		      rel = relation.split('.');
		(function() {
			var node = _this.modelsTree.findModelByName(rel[0]);
			if (node) {
				_this.modelsTree.selectModel(node);
				_this.fieldsGrid.show();
				_this.loadModelFields(node, function(rs){
					if (rel[1]) {
						for (var i = 0, l = rs.length; i < l; i++) {
							if (rs[i].get('name') == rel[1]) {
								_this.fieldsGrid.getSelectionModel().selectRecords([rs[i]], false); 
								break;
							}
						}
					}
				});
			} else {
				_this.fieldsGrid.getStore().removeAll();
				_this.modelsTree.getSelectionModel().clearSelections();
			}
		}).defer(300);
	}
	
	/**
	 * Loads Model's Fields
	 * @param {Ext.tree.TreeNode} modelNode
	 * @param {Function} callback
	 */
	,loadModelFields : function(modelNode, callback) {
		var s = this.modelsTree.getSchema(modelNode),
			m = this.modelsTree.getModel(modelNode);
		this.fieldsGrid.getStore().load({
			params: {
				schema: s,
				model: m
			},
			callback: callback || Ext.emptyFn
		});
	}
	
	/**
	 * ModelTree <u>click</u> event listener
	 * @param {Ext.tree.TreeNode} node
	 * @param {Ext.EventObject} e
	 */
	,onModelClick : function(node, e) {
		this.fieldsGrid.show();
		this.loadModelFields(node);
	}	
	
	/**
	 * ModelTree <u>modelsload</u> event listener
	 * @param {Ext.tree.Loader} loader
	 * @param {XMLHttpRequest} response
	 */
	,onModelsLoad : function(loader, response) {
		this.fieldsGrid.getStore().removeAll();
		this.fieldsGrid.hide();
	}
	
	,onFieldsSelectionChange : function(sm) {
		var okBtn = this.getFooterToolbar().getComponent('pick-relation');
		sm.hasSelection() ? okBtn.enable() : okBtn.disable();
	}
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent: function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.widgetsBuilder.superclass.initComponent.apply(this, arguments);
		this._initEvents();
	}

	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	,_initCmp : function() {
		var _this = this;
		
		var relationsGrid = new Ext.grid.GridPanel({
			flex: 1,
			ddGroup: 'widgetsBuilder',
			enableDragDrop   : true,
			store: new Ext.data.ArrayStore({
			    // reader configs
			    idIndex: 0,  
			    fields: [
			       'pairId',
			       {name: 'name'}
			    ]
			}),
			viewConfig: {
				scrollOffset: 19
			},
			columns : [
				{header: 'Relation', sortable: true, width: 170, dataIndex: 'name'}
			],
			loadMask: true,
			border: false,
			autoScroll: true
		});
		this.relationsGrid = relationsGrid;
		
		var fieldsGrid = new Ext.grid.GridPanel({
			ddGroup: 'widgetsBuilder',
			enableDragDrop   : true,
			
			store: new Ext.data.JsonStore({
				autoLoad: false,
				url: _this.fieldsUrl,
				baseParams: {
					xaction: 'read'
				},
				root: 'rows',
				idProperty: 'id',    							
				fields: [
					'id', 'name', 'type', 'size', 'required'
				]
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
		
		return {
			title: 'Create new widget',
//			iconCls: 'icon-table-relationship',
			modal: true,
			width: 800,
			height: 400,
			maximizable: true,			
//			plain: true,
			layout: 'border',
			items: [
			{
				region: 'west',
				layout: 'fit',
				margins: '5 5 5 5',
				width: 220,
				items: [{
					id: 'widgets-picker',					
					xtype: 'afStudio.models.modelTree',
					url: _this.modelsUrl,
					border: false,
					ref: '../modelsTree'
				}]
			},{	
				region: 'center',
				margins: '5 5 5 0',
				layout: 'fit',
				items: [
					fieldsGrid
				]				
			},{	
				region: 'east',
				margins: '5 5 5 0',
				width: 195,
				layout: 'fit',
				items: [
					{
						xtype: 'panel',
						layout: 'vbox', 
						border: false,
						bodyBorder: false,
						items: [
							relationsGrid,
							{xtype: 'panel', id: 'widgets-basket', style: 'margin: 2px 2px 0 2px;', html: '<center><br>Drop Item and remove it from Relation grid</br></center>', height: 70, width: 188}
						]
					}
				]				
			}
			],
			buttons: [{
				itemId: 'pick-relation',
				text: 'ok',
				disabled: true,
				iconCls: 'icon-accept',
				handler: Ext.util.Functions.createDelegate(_this.pickRelation, _this)
			}]
		}		
	}
	
	/**
	 * Initializes events
	 * @private
	 */
	,_initEvents : function() {
		var _this      = this,
			modelTree  = this.modelsTree, 
			fieldsGrid = this.fieldsGrid,
			fgSm = fieldsGrid.getSelectionModel();

		this.on('show', function(){
	        /****
	        * Setup Drop Targets
	        ***/
	        // This will make sure we only drop to the  view scroller element
	        var firstGridDropTargetEl =  this.relationsGrid.getView().scroller.dom;
	        var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
	                ddGroup    : 'widgetsBuilder',
	                notifyDrop : function(ddSource, e, data){
	                        var records =  ddSource.dragData.selections;
	                        
	                        var fr = _this.fieldsGrid.getSelectionModel().getSelected();
							var mn = _this.modelsTree.getSelectionModel().getSelectedNode();
							var m = _this.modelsTree.getModel(mn);
if(fr)							{
	                        Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);

							var  RelationRec = Ext.data.Record.create([
							    {name: 'pairId', mapping: 'pairId'},
							    {name: 'name', mapping: 'name'}
							])	                        

							var r = new RelationRec(
							    {
							        pairId: fr.get('id'),
							        name: m + '.' + fr.get('name')
							    }
							);
	                        _this.relationsGrid.store.add(r);
	                        _this.relationsGrid.store.sort('name', 'ASC');
}
	                        return true;
	                }
	        });
	        
	        //Get basket zone
			// This will make sure we only drop to the view container
			var basket = Ext.getCmp('widgets-basket');
			var basketDropTargetEl =  basket.body.dom;

			var basketDropTarget = new Ext.dd.DropTarget(basketDropTargetEl, {
				ddGroup     : 'widgetsBuilder',
				notifyEnter : function(ddSource, e, data) {
		
					//Add some flare to invite drop.
					basket.body.stopFx();
					basket.body.highlight();
				},
				notifyDrop  : function(ddSource, e, data){
		
					// Reference the record (single selection) for readability
					var selectedRecord = ddSource.dragData.selections[0];
		
		
					// Load the record into the form
//					formPanel.getForm().loadRecord(selectedRecord);
		
		
					// Delete record from the grid.  not really required.
					ddSource.grid.store.remove(selectedRecord);
		
					return(true);
				}
			});
	        
	        
		}, this);

//		_this.addEvents(
//			/**
//			 * @event relationpicked Fires after relation is picked
//			 * @param {String} relation The picked up relation in the format model_name:model_column 
//			 */
//			'relationpicked'
//		);
//		
		modelTree.on({
			click : Ext.util.Functions.createDelegate(_this.onModelClick, _this),
			modelsload : Ext.util.Functions.createDelegate(_this.onModelsLoad, _this)			
		});
//		
		fgSm.on({
			selectionchange : Ext.util.Functions.createDelegate(_this.onFieldsSelectionChange, _this)
		});
	}
	
});