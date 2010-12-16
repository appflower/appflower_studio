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
		var length = this.panel.items.length;
		if(length==0){
			this.panel.add({
				xtype:'panel',
				layout:'form',
				frame: true,width:this.panel.getWidth()-20,
				border: true,id:'wcontainer'+length
				
			})
			length++;
		}
		this.panel.add({
			xtype:'panel',
			layout:'form',
			id:'wcontainer'+length,
			items:[{
				fieldLabel:'testField'+(length+1),
				xtype:'textfield',anchor:"100%"
			}]
		});
		this.panel.doLayout();
		var resizer = new Ext.Resizable('wcontainer'+length, {
			width: 200,
            minWidth:100,
            minHeight:50,
            listeners:{
				 beforeresize :function(resizer,e){
				 },
				 resize:function(resizer,width,height,e){
					 var id = resizer.el.id;
					 Ext.getCmp(id).doLayout();
				 }
            }
		})
		
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
		var panel = new Ext.Panel({			
			flex: 3,			
			frame: true,
			border: true,
			autoScroll: true,
			layout: 'vbox',
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
		this.panel=panel;
		/*this.grid.on('columnmove',function(oldIndex,newIndex){
					this.runwidgetTask();
				},this)*/
		return {
			itemId: 'designer',	
			defaults: {
				style: 'padding:4px;'
			},
			items: [
				panel, 
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