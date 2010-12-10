Ext.namespace('afStudio.layoutDesigner');

/**
 * Layout Designer
 * @class afStudio.layoutDesigner
 * @extends Ext.Panel
 */
afStudio.layoutDesigner.DesignerTabPanel = Ext.extend(Ext.Panel, {	

	/**
	 * ExtJS basic method
	 */
	initComponent : function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.layoutDesigner.DesignerTabPanel.superclass.initComponent.apply(this, arguments);
	},	
	
	/**
	 * Initialises component
	 * @return {Object} the component initial literal
	 * @private
	 */
	_initCmp : function() {
		return {
//			activeTab: 0,
layout: 'fit',
	        bodyBorder: false, border: false,
	        items: this.getTabs(),
	        listeners:{
	        	afterrender:function(){
					var detailP = Ext.getCmp('details-panel');
					detailP.removeAll(true);
	        		
	        		//TODO!
	        		this.addLayout(detailP, 2, 0);
	        	}, scope: this
	        }
			
		};		

	},
	
	/**
	 * Function addLayout
	 * @param {Object} Detail panel
	 * @param {Number} Number of columns
	 * @param {Number} Number of additional columns
	 */
	addLayout:function(detailp, columns, additionalColumns){
		var portItems = [];
		detailp.columns=columns;
		
		if(columns<10){
			var columnwidth = 1/columns;
			for(var i =0;i<columns;i++){
				portItems.push({	
					id:'portColumn'+i,
					columnWidth: columnwidth,
	
					defaults: {
						style: 'padding-right: 5px;',
						bodyCssClass: 'layout-designer-widget'
					},
	
					items: [
//					{
//						title:'widget1'+i,
//						height:50,
//						width:50,
//						tools:[
//							{id: 'close', handler: this.removeWidget, scope: this}
//						],						
//						getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }
//					},{
//						title:'widget2'+i,
//						height:50,
//						width:50,
//						tools:[
//							{id: 'close', handler: this.removeWidget, scope: this}
//						],						
//						getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }
//					},{
//						title:'widget3'+i,
//						height:50,
//						width:50,
//						tools:[
//							{id: 'close', handler: this.removeWidget, scope: this}
//						],						
//						getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }
//					}
//					
					]
				});
			}
			
			//TODO: add existed widgets to the left column
			for(var i = 0; i < additionalColumns; i++ ) {
				portItems[0].items.push(this.getNewWidgetCfg());
			}
			
			detailp.add(
				new Ext.ux.Portal ({
					id: this.id + '-layout-designer-portal',
					autoScroll: true,
					items: portItems,
					bodyStyle: 'padding: 5px;',
					style: "padding-right:5px;padding-left:5px;"
				})
			);
		}else{
			var _layout=[];
			if(columns==22)
				_layout=[2,2];
			else if(columns==33)
				_layout=[3,3];
			else if(columns==44)
				_layout=[4,4];
			else if(columns==12)
				_layout=[2,1];
			
			var layoutitems = [];
			for(var i=0;i<_layout[0];i++){
				portItems=[];
				for(var j=0;j<_layout[1];j++){
					portItems.push({		
						defaults: {
							style: 'padding-right: 5px;'
						},
						columnWidth: 1/_layout[1],
						id:"portColumn"+i+j,
						items: []
//TODO: not need now. Do not forget to remove						
//						,
//						items: [{
//							title:'widget'+i+j,
//							height:50,
//							width:50,
//							getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }
//						}]
					});
				}

			//TODO: add existed widgets to the left column
			for(var i = 0; i < additionalColumns; i++ ) {
				portItems[0].items.push(this.getNewWidgetCfg());
			}
			
				layoutitems.push(
						new Ext.ux.Portal ({
							autoHeight:true,
							//height:100,
							//title:'xxx'+i,
							id: this.id + '-layout-designer-portal'+i,
							//autoScroll: true,
							items: portItems,
							//bodyStyle: 'padding: 5px;',
							style: "padding-right:5px;padding-left:5px;"
						})
					);
			}
			detailp._layout=_layout;
			detailp.add({
				layout:{
					type: 'vbox',
					padding:'5',
					align:'stretch'
				},
				items:layoutitems
			});
			
		}
		detailp.doLayout();
	},	
	
	
	/**
	 * function resizeItems
	 * Resize button handler
	 */
	resizeItems: function(){
    	var detailp=Ext.getCmp('details-panel');
    	var columns = detailp.columns;
    	detailp.resizer=[];
    	if(columns<10){
	    	for(var i=1;i<columns;i++){
	    		var resizer = new Ext.Resizable('portColumn'+(i-1), {
	    			 width: 200,
	                 minWidth:100,
	                 minHeight:50,
	                 listeners:{
	                	 beforeresize :function(resizer,e){
	                		 var el = Ext.fly(resizer.el);
	                		 resizer._width = Ext.fly(el).getWidth();
	                	 },
	                	 resize:function(resizer,width,height,e){
	                		 detailp.resizerHandler(resizer,width,height,e);
	                	 }
	                 }
	    		})
	    		//resizer.on('resize', detailp.resizerHandler,detailp);
	    		detailp.resizer.push(resizer);
	    	}
    	}else{
    		var _layout = detailp._layout;
    		if(_layout){
    			for(var i=0;i<_layout[0];i++){
    				for(var j=0;j<_layout[1];j++){
	    	    		var resizer = new Ext.Resizable('portColumn'+i+j, {
	    	    			 width: 200,
	    	                 minWidth:100,
	    	                 minHeight:50,
	    	                 listeners:{
	    	                	 beforeresize :function(resizer,e){
	    	                		 var el = Ext.fly(resizer.el);
	    	                		 resizer._width = Ext.fly(el).getWidth();
	    	                	 },
	    	                	 resize:function(resizer,width,height,e){
	    	                		 detailp.resizerHandler(resizer,width,height,e);
	    	                	 }
	    	                 }
	    	    		})
	    	    		//resizer.on('resize', detailp.resizerHandler,detailp);
	    	    		detailp.resizer.push(resizer);
    				}
    	    	}
    		}
    	}
	},
	
	/**
	 * function autoAdjust
	 * Auto-Adjust button handler
	 */
	autoAdjust: function(){
		var els = Ext.DomQuery.select('DIV[class*="x-portlet"]', 'details-panel');
//		var els = Ext.DomQuery.select('DIV[id*="portColum"]', 'details-panel');
		for(var i=0, l=els.length; i<l; i++ ){
			var cmp = Ext.getCmp(els[i].id);
			var w = cmp.ownerCt.getWidth();
			
			cmp.setWidth(w);
			Ext.get(els[i]).setWidth(w);
			
			cmp.doLayout();
			cmp.ownerCt.doLayout();
		}
	},
	
	/**
	 * Function getTabs
	 * @return {Array} array of items
	 */
	getTabs: function(){
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
				{text: 'Re-size', handler: this.resizeItems, scope: this},
				{text: 'Auto-Adjust', handler: this.autoAdjust, scope: this}
			]
		};
		
		var tb = new Ext.Toolbar({
	        items: [
	        	{text: 'Save', iconCls: 'icon-save'},
	        	{xtype: 'tbseparator'},
	        	{text: 'New Widget', iconCls: 'icon-add', handler: this.addNewWidget, scope: this},
	        	{xtype: 'tbseparator'},
	        	{text: 'Format', iconCls: 'icon-format', menu: columnsMenu},
	        	{xtype: 'tbseparator'},
	        	{text: 'Preview', iconCls: 'icon-preview'}
	        ]			
		});
		
		return [
			{id: 'details-panel', 
//			title: 'Details', 

				layout: 'fit',
				/*layout:{
					type: 'vbox',
					padding:'5',
					align:'stretch'
				},*/
				tbar: tb, autoScroll: true,
		        bodyStyle: 'padding-bottom:5px;background:#eee;',
		    		
	    		resizerHandler:function(resizer,width,height,e){
	    			var id = resizer.el.id;
	    			var index = id.substr(id.length-1,1);
	    			index = parseInt(index);
	    			index++;
	    			var w = resizer._width;
	    			w = width -w;
	    			Ext.getCmp(id).doLayout();
	    			var nextcolumn = Ext.getCmp(id.substr(0,id.length-1)+index);
	    			if(nextcolumn){
		    			var ww  = nextcolumn.getWidth();
		    			nextcolumn.setWidth(ww-w);
		    			nextcolumn.doLayout();
	    			}
	    		}
			}
		];
	},
	
	/**
	 * Create dummy widget in the panel
	 */
	addNewWidget: function(){
		var component = this.getNewWidgetCfg();
		//TODO: Quick fix
		var qty_columns = Ext.getCmp('details-panel').columns;
		if(qty_columns < 10){
			var cp = Ext.getCmp(this.id + '-layout-designer-portal');
		} else {
			var cp = Ext.getCmp(this.id + '-layout-designer-portal0');
		}
		
		var clnNum = 0;
		var portalColumn = cp.items.itemAt(clnNum);
		portalColumn.add(component);
		portalColumn.doLayout();
	},
	
	/**
	 * Function getNewWidgetCfg 
	 * @return {Object} New widget cfg
	 */
	getNewWidgetCfg : function(){
		return {html: '<br><center>Widget <Name></b><i>Click to edit Widget<i></center><br>', title: '"Widget (Name)"', frame: true,
			bodyCssClass: 'layout-designer-widget',
			tools:[
				{id: 'close', handler: this.removeWidget, scope: this}
			],
			getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }
		}		
	},
	
	/**
	 * Function remove widget
	 * @param {Object} e browser event
	 * @param {Object} tool current tool
	 * @param {Object} panel owner panel
	 */
	removeWidget: function(e, tool, panel){
		panel.destroy();
	}
});
Ext.reg('afStudio.layoutDesigner', afStudio.layoutDesigner.DesignerTabPanel);