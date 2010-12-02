Ext.namespace('afStudio.layoutDesigner');

/**
 * Layout Designer
 * @class afStudio.layoutDesigner
 * @extends Ext.TabPanel
 */
afStudio.layoutDesigner.DesignerTabPanel = Ext.extend(Ext.TabPanel, {	
	activeTab: 0,
	form: null,
	
	initComponent : function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.layoutDesigner.DesignerTabPanel.superclass.initComponent.apply(this, arguments);
//		this._initEvents();
	},	
	
	/**
	 * Initialises component
	 * @return {Object} the component initial literal
	 * @private
	 */
	_initCmp : function() {
		this.createForm();
		return {
			title: 'Layout Designer', 
//			width:820,height:600,
//			closable: true,
//	        draggable: true, plain:true,
//	        modal: true,// resizable: false,
	        bodyBorder: false, border: false,
	        items:this.form,
//	        layout:'fit',
	        listeners:{
	        	afterrender:function(){
//	        		var treep = Ext.getCmp('layouttree');
//	        		treep.on('click',this.onTreeClick,this);
	        		
//	        		var addWigetsBtn = Ext.getCmp('add-widget-btn');
//	        		addWigetsBtn.on('click', this.addNewWidget, this);
	        	}
	        }
			
		};		
		
		return {
			itemId: 'layout-designer',
//			height: 400,
			activeTab: 0,
			defaults: {
				layout: 'fit'
			},
			items: [
			{
				itemId: 'designer',
				title: 'Widget Designer'
			},{
				itemId: 'security',
				title: 'Security',
				tbar: [
					{text: 'Preview', iconCls: 'icon-preview', handler: function(){alert('Preview button clicked')}}
				]
			},{
				itemId: 'code-editor',
				title: 'Code Editor'
			}]
		}
	},
	
	_initEvents : function() {
		var _this = this,
			designerTab = _this.getComponent('designer'),
			securityTab = _this.getComponent('security'),
			codeEditorTab = _this.getComponent('code-editor');
		
		designerTab.on({
			beforerender : function(cmp) {
				cmp.add({
					xtype: 'afStudio.layoutDesigner.designer'
				});
			}
		});

		securityTab.on({
			beforerender : function(cmp) {
				cmp.add({
					html: 'Widget Preview'
				});
			}
		});
		
		codeEditorTab.on({
			beforerender : function(cmp) {
				cmp.add(new Ext.ux.CodePress({title:'test',
															closable:true,
															path:_this.path,
															tabTip:_this.path,
															file:_this.path/*,
															tabPanel:tabPanel*/}));
			}
		});	
		
		if(this.mask)
		{
			this.mask.hide.defer(1000,this.mask);
		}
				
	},
	
	createForm: function(){
		var columnsMenu = {
			items: [
				{text: 'Columns', 
					menu: {
						items: [
    						{
								xtype: 'combo', triggerAction: 'all', mode: 'local', emptyText: 'Select an item...',
								store: [[1, '1 column'], [2, '2 columns'], [3, '3 columns'], [4, '4 columns']]
							}
						]
					}
				},
				{text: 'Re-size'}
			]
		};
		
		this.form = new Ext.TabPanel({
	        title: 'Layout Designer',
	        tbar: [
	        	{text: 'Save', iconCls: 'icon-save'},
	        	{xtype: 'tbseparator'},
	        	{text: 'New Widget', iconCls: 'icon-add'},
	        	{xtype: 'tbseparator'},
	        	{text: 'Format', iconCls: 'icon-format', menu: columnsMenu},
	        ],
			activeTab: 0,
		    items: [
	
{

//		        layout:'border',
//		        items:[{








		        	id: 'details-panel',
		            title: 'Details',
		            layout: 'fit',
		            region: 'center',
		            bodyStyle: 'padding-bottom:15px;background:#eee;',
		    		autoScroll: true,
		    		resizerHandler:function(resizer,width,height,e){
		    			var id = resizer.el.id;
		    			var index = id.substr(10,1);
		    			index = parseInt(index);
		    			index++;
		    			var w = resizer._width;
		    			w = width -w;
		    			Ext.getCmp(id).doLayout();
		    			var nextcolumn = Ext.getCmp('portColumn'+index);
		    			var ww  = nextcolumn.getWidth();
		    			nextcolumn.setWidth(ww-w);
		    			nextcolumn.doLayout();
		    		},





		    		
		    		/**
		    		tools:[{
		    			id:'gear',
		    	        handler: function(){
		    	        	var detailp=Ext.getCmp('details-panel');
		    	        	var columns = detailp.columns;
		    	        	detailp.resizer=[];
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
		    	        }
		    		},{
		    			id:'refresh',
		    	        handler: function(){
		    	        	var detailp=Ext.getCmp('details-panel');
		    	        	var resizers = detailp.resizer;
		    	        	for(var i=0;i<resizers.length;i++){
		    	        		resizers[i].destroy();
		    	        	}
		    	        }
		    		}],
		    		*/
		    		
//		    		layout:'fit',
//		    		items:[{



		    			html: '<p class="details-info">When you select a layout from the tree, additional details will display here.</p>',



//		    			border:false
//		    		}]

//		        }],
//		        buttons: [
//	  				{text: 'Add New Widgets', disabled: true, id: 'add-widget-btn'}
//	  			],
//	  			buttonAlign: 'center'
		    },
		    
		    {title: 'Preview', html: 'Another one'}	
	
		    
			]

		//	}
			})
	},
	
});

Ext.reg('afStudio.layoutDesigner', afStudio.layoutDesigner.DesignerTabPanel);




























afStudio.LayoutDesigner=Ext.extend(Ext.Window, { 
	form: [],

	initComponent: function(){
		var config = {
			title: 'Layout Designer', width:820,height:600,
			closable: true,
	        draggable: true, plain:true,
	        modal: true,// resizable: false,
	        bodyBorder: false, border: false,
	        items:this.form,layout:'fit',
	        listeners:{
	        	afterrender:function(){
	        		var treep = Ext.getCmp('layouttree');
	        		treep.on('click',this.onTreeClick,this);
	        		
	        		var addWigetsBtn = Ext.getCmp('add-widget-btn');
	        		addWigetsBtn.on('click', this.addNewWidget, this);
	        	}
	        }
			
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Help.superclass.initComponent.apply(this, arguments);	
	},
	
	/**
	 * Create dummy widget in the panel
	 */
	addNewWidget: function(){
//		var detailP = Ext.getCmp('details-panel');
//		var tt = 1;
//		
//		var portal = detailP.items.itemAt(0);
//		var leftcolumn = portal.items.itemAt(0);
		

			var component = {html: 'this is a test portlet', title: 'Test panel', frame: true, getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }}
			var cp = Ext.getCmp(this.id + '-layout-designer-portal');
			var clnNum = 0;
			var portalColumn = cp.items.itemAt(clnNum);
			portalColumn.add(component);
			portalColumn.doLayout();
		
//		leftcolumn.add(component);
//		detailP.doLayout();
	},
	
	addLayout:function(detailp,columns){
		var portItems = [];
		var columnwidth = 1/columns;
		for(var i =0;i<columns;i++){
			portItems.push({	
				id:'portColumn'+i,
				
//				border: true,
//				bodyBorder: true,
				
//				frame: true,
//				layout: 'fit',
				columnWidth: columnwidth,
				style: "padding:10px 0 10px 10px;",
				items: [
				
				{
					title:'widget1'+i,
					height:50,
					width:50,
					getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }
				},{
					title:'widget2'+i,
					height:50,
					width:50,
					getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }
				},{
					title:'widget3'+i,
					height:50,
					width:50,
					getWidgetConfig: function () { var o={}; o.idxml=this.idxml || false; return o; }
				}
				
				]
			});
		}
		detailp.columns=columns;
		detailp.add(
			new Ext.ux.Portal ({
//				layout: 'fit',

				id: this.id + '-layout-designer-portal',

				autoScroll: true,
				items: portItems,
				style: "padding-right:5px;"
			})
		);
		detailp.doLayout();
	},
	onTreeClick:function(n){
		if(n.leaf){
			Ext.getCmp('add-widget-btn').enable();
			var columns = n.attributes.columns;
			var detailP = Ext.getCmp('details-panel');
			detailP.removeAll(true);
			this.addLayout(detailP,columns)
		}
	},
	
	cancel:function(){
		this.close();
	}
});