Ext.namespace('afStudio.wd');

/**
 * Designer Tab Container
 * @class afStudio.wd.DesignerTab
 * @extends Ext.Container
 */
afStudio.wd.DesignerTab = Ext.extend(Ext.Container, {
	
	layout : 'hbox'
	
	,layoutConfig : {
	    align: 'stretch',
	    pack: 'start'
	}
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));		
		afStudio.wd.DesignerTab.superclass.initComponent.apply(this, arguments);
	}//eo initComponent	
	
	,runwidgetTask : function() {
		var task = new Ext.util.DelayedTask(function(){
		    this.changeLayout(2);
		}, this);
		
		task.delay(100); 
	}
	
	//add a field in the widget designer 
	,addField : function() {
		var length = this.panel.items.length;
		if (length == 0) {
			this.panel.add({
				xtype: 'panel',
				layout: 'vbox',
				width: (this.panel.getWidth() - 20)
			});
			this.panel.doLayout();
		}
		
		this.addFieldToActive();
	}
	
	//when a subitem in the designer container selected, the actived items should contain the new added field
	,addFieldToActive : function(){	
		var body = Ext.fly(this._activePanelbody);
		var cmp = body.findParent('DIV[class*="x-box-item"]',5);
		var _panel = Ext.getCmp(cmp.id);
		if(_panel.items.length==0){
			_panel.add({
				width:(_panel.getWidth()-20),
				height:5
			});
			_panel.doLayout();
		}
		length=_panel.items.length;
		var columns = _panel.columns;
		_panel.add({
			xtype:'panel',
			layout:'form',
			plugins: new Ext.ux.WidgetFieldDragZone(),
			//frame:true,border:true,
			width:(_panel.getWidth()-50),
			id:'wcontainer'+(columns+"")+length,
			items:[{
				fieldLabel:'testField'+(columns+"")+(length+1),
				xtype:'textfield',anchor:"100%"
			}]
		});
		_panel.doLayout();
		var resizer = new Ext.Resizable('wcontainer'+(columns+"")+length, {
			width: 200,
            minWidth:100,
            minHeight:50,
            listeners:{
				 resize:function(resizer,width,height,e){
					 var id = resizer.el.id;
					 var box = Ext.getCmp(id);
					 box.setWidth(width-5)
					 box.items.get(0).setWidth(width-10);
					 box.doLayout();
				 }
            }
		})
	}
	
	,containerPanelRender : function() {
		this.runwidgetTask();
	}
	
	,columnSelect : function(cmp) {
		var columns = cmp.getValue();
		this.changeLayout(columns);
	}
	
	,changeLayout : function(columns) {
		this.panel.removeAll(true);
		
		var items = [];
		for (var i = 0; i < columns; i++) {
			items.push(
			{
				border: true,
				frame: false,
				columns: i,
				width: (this.panel.getWidth() / columns - 10),
				bodyCfg: {cls: 'greenborder'},
			    plugins: new  Ext.ux.WidgetFieldDropZone(),
				listeners: {
					afterrender: function(cmp) {
						var self = this;
						cmp.body.on('click', function(e, t, o) {
							var els = Ext.DomQuery.select('DIV[class*="redborder"]', 'widget-designer-panel');
							for (var i = 0, l = els.length; i < l; i++) {
								var ell = Ext.fly(els[i]);
								ell.removeClass("redborder");
								ell.addClass('greenborder'); 
							}
							var el = Ext.fly(t);
							el.removeClass("greenborder");
							el.addClass('redborder'); 
							self._activePanelbody = t;
						});
						
						if (cmp.columns == 0) {
							cmp.body.removeClass("greenborder");
							cmp.body.addClass('redborder');
							this._activePanelbody = cmp.body.dom;
						}
					},
					scope: this
				}
			});
		}
		
		var _panel = new Ext.Panel({
			layout: 'hbox',
			layoutConfig: {
			    align: 'stretch',
			    pack: 'start'
			},
			items: items
		});
		
		this.panel.add(_panel);
		
		this.panel.doLayout();
		
		_panel.doLayout();		
	}//eo changeLayout
	
	//remove all the border on preview
	,preview : function() {
		//TODO: added dummy values
		afApp.widgetPopup(this.widgetUri, this.rootNode.text, null, "iconCls:\'" + "\',width:800,height:600,maximizable: false", afStudio);
		
		var els = Ext.DomQuery.select('DIV[class*="redborder"]', 'widget-designer-panel');
		for (var i = 0, l = els.length; i < l; i++) {
			var ell = Ext.fly(els[i]);
			ell.removeClass("redborder");
		}
		
		var els = Ext.DomQuery.select('DIV[class*="greenborder"]', 'widget-designer-panel');
		for (var i = 0, l = els.length; i < l; i++) {
			var ell = Ext.fly(els[i]);
			ell.removeClass("greenborder");
		}
	}//eo preview
	
	,saveDesigner: function() {
		this.fireEvent("logmessage", this, "widget designer " + this.ownerCt.ownerCt.widgetUri + " saved");
	}
	
	/**
	 * Initialises component
	 * @return {Object} the component initial literal
	 * @private
	 */
	,_initCmp : function() {
		var columnsMenu = {
			items: [
			{
				text: 'Columns', 
				menu: {
					items: [
    				{
						xtype: 'combo', 
						triggerAction: 'all', 
						mode: 'local', 
						emptyText: 'Select an item...',
						store: [        
							[1, '1 columns'],
							[2, '2 columns'],
							[3, '3 columns'],
							[4, '4 columns']
						],
						listeners: {
							select: this.columnSelect, scope: this
						}
					}]
				}
			},{
				text: 'Re-size', 
				handler: this.resizeItems, 
				scope: this
			}]
		};
		
		//the container panel for the widget designer
		var panel = new Ext.Panel({		
			id: 'widget-designer-panel',
			flex: 3,
			border: true,
			autoScroll: true,
			layout: 'fit',
			tbar: {
				items: [
				{
					text: 'Save', 
					iconCls: 'icon-save',
					handler: this.saveDesigner,
					scope: this
				},'-',{
					text: 'Add Field', 
					iconCls: 'icon-add',
					handler: this.addField,
					scope: this
				},'-',{
					text: 'Format', 
					iconCls: 'icon-format', 
					menu: columnsMenu
				},'-',{
					text: 'Preview', 
					iconCls: 'icon-preview', 
					handler: this.preview,
					scope: this
				}]
			},
			listeners:{
				afterrender: this.containerPanelRender,
				scope: this
			}
		});
		
		this.panel = panel;
		
		return {
			itemId: 'designer',	
			defaults: {
				style: 'padding: 2px;'
			},
			items: [
				panel, 
				{
					xtype: 'panel', 
					flex: 1,
					layout: 'fit',
					items: [
					{
						xtype: 'afStudio.wd.inspector',
						widgetUri: this.widgetUri,
						rootNodeEl: this.rootNodeEl
                    }]
				}
			]
		}
	}//eo _initCmp	
});

/**
 * @type 'afStudio.wd.designer'
 */
Ext.reg('afStudio.wd.designer', afStudio.wd.DesignerTab);