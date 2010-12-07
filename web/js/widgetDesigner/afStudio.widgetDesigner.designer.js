Ext.namespace('afStudio.widgetDesigner');

N = afStudio.widgetDesigner;

/**
 * Designer Tab Container
 * @class afStudio.widgetDesigner.DesignerTab
 * @extends Ext.Container
 */
N.DesignerTab = Ext.extend(Ext.Container, {
	
	layout: 'hbox',
	layoutConfig: {
	    align: 'stretch',
	    pack: 'start'
	},
	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));		
		afStudio.widgetDesigner.DesignerTab.superclass.initComponent.apply(this, arguments);		
		this._initEvents();
	}	
	
	,runwidgetTask : function(){
		var task = new Ext.util.DelayedTask(function(){
		    var count = this.grid.store.getCount();
		    for(var k=0;k<this.grid.getColumnModel().config.length;k++){
		    	var config = this.grid.getColumnModel().config[k];
		    	if(!config.showWidget) continue;
			    for(var i=0;i<count;i++){
			    	var p = new Ext.Panel({
			    		renderTo:'field_'+i+"_"+k,
			    		border:false,
			    		items:[
			    			new Ext.form.TextField({
			    				length:20
			    			})
			    		]
			    	});
			    }
		    }
		},this);
		task.delay(100); 
	}
	
	,addField : function(){
		this.grid.getColumnModel().setHidden(2,false);
		var store = this.grid.store;
		 var rec = store.recordType;
		store.add([new rec()]);	
		this.grid.getView().refresh();
		this.runwidgetTask();
	}
	
	,renderField: function(v,meta,record,rowIndex,i,store){
		return "<div id='field_"+rowIndex+"_"+i+"'></div>";
	}
	
	/**
	 * Initialises component
	 * @return {Object} the component initial literal
	 * @private
	 */
	,_initCmp : function() {
		var columnsMenu = {
			items: [
				{text: 'Columns', 
					menu: {
						items: [
    						{
								xtype: 'combo', triggerAction: 'all', mode: 'local', emptyText: 'Select an item...',
								store: [
								        //[1, '1 column'], [2, '2 columns'], [3, '3 columns'], [4, '4 columns'],
								        [12,'1 columns'],[22,'2 columns'],[33,'3 columns'],[44,'4 columns']
								 ],
								listeners: {
									'select': function(cmp){
										var els = Ext.DomQuery.select('DIV[class*="layout-designer-widget"]', 'details-panel');
										
										var detailP = Ext.getCmp('details-panel');
										detailP.removeAll(true);
										
						        		this.addLayout(detailP, cmp.getValue(), els.length);
									}, scope: this
								}
							}
						]
					}
				},
				{text: 'Re-size', handler: this.resizeItems, scope: this}
			]
		};
		
		//Simple grid
		var grid = new Ext.grid.GridPanel({			
			flex: 3,			
			frame: true,
			border: true,
			autoScroll: true,
			store: new Ext.data.JsonStore({
				root: 'data',
				fields: ['field', 'group']
			}),			
			columns: [
				{header: 'Field', dataIndex: 'field'},
				{header: 'Group', dataIndex: 'group'},
				{header: 'Field1', dataIndex: 'group',showWidget:true,renderer:this.renderField,hidden:true}
			],
			viewConfig: {
				forceFit: true
			},
			tbar: {
				items: [
					{text: 'Save', iconCls: 'icon-save'},
					{xtype: 'tbseparator'},
					{text: 'Add Field', iconCls: 'icon-add',handler:this.addField,scope:this},
					{xtype: 'tbseparator'},
					{text: 'Preview', iconCls: 'icon-preview', handler: function(){alert('Preview button clicked')}},
					{xtype: 'tbseparator'},
					{text: 'Format', iconCls: 'icon-format', menu: columnsMenu}
				]
			}
		});
		this.grid=grid;
		this.grid.on('columnmove',function(oldIndex,newIndex){
					this.runwidgetTask();
				},this)
		return {
			itemId: 'designer',	
			defaults: {
				style: 'padding:4px;'
			},
			items: [
				grid, 
				{
					xtype: 'panel', flex: 1, layout: 'fit',
					items: [
						{xtype: 'afStudio.widgetDesigner.inspector'}
					]
				}
			]
		}
	},
	
	_initEvents : function() {
		var _this = this;				
	}// eo _initEvents
	
});

Ext.reg('afStudio.widgetDesigner.designer', N.DesignerTab);

delete N;