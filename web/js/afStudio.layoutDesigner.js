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
				if(0 ==i) {
					for(var j = 0; j < additionalColumns; j++ ) {
						portItems[0].items.push(this.getNewWidgetCfg());
					}
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
	
	saveLayout: function(){
		this.fireEvent("logmessage",this,"layout saved");
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
	        	{text: 'Save', iconCls: 'icon-save',handler:this.saveLayout,scope:this},
	        	{xtype: 'tbseparator'},
	        	{text: 'New Widget', iconCls: 'icon-add', handler: this.addNewWidget, scope: this},
	        	{xtype: 'tbseparator'},
	        	{text: 'Format', iconCls: 'icon-format', menu: columnsMenu},
	        	{xtype: 'tbseparator'},
	        	{text: 'Preview', iconCls: 'icon-preview', handler: this.preview}
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
	 * Function preview
	 * Show preview window with real widget
	 */
	preview: function(){
		
		//TODO: if user clicks on the "Preview" button in the LayoutDesigner widget panel. not sure if this is the better solution
		try {
			var wp = this.ownerCt.ownerCt.widgetParams;
			
			var iconCls = wp.iconCls;
			var title = wp.title;
		} catch (e) {
			var iconCls = 'icon-bug-add';
			var title = "Edit profile";
		}
		
		afApp.widgetPopup("/afGuardUserProfile/edit", title, null, "iconCls:\'" +iconCls+ "\',width:800,height:600,maximizable: false", afStudio);
	},
	
	/**
	 * Function runWidgetDesigner
	 * Create widget Designer 
	 */	
	runWidgetDesigner: function(){
        var actionPath = "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/actions\/actions.class.php";
        var securityPath = "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/config\/security.yml";
        var widgetUri = 'afGuardUserProfile/edit';

//        node.attributes.widgetUri;

		var mask = new Ext.LoadMask(afStudio.vp.layout.center.panel.body, {msg: 'Loading, please Wait...', removeMask:true});
		mask.show();
		
		afStudio.vp.addToPortal({
			title: 'Widget Designer', layout: 'fit',
			collapsible: false, draggable: false,
			items: [
				{xtype: 'afStudio.widgetDesigner', actionPath: actionPath, securityPath: securityPath, widgetUri: widgetUri, mask: mask}
			]
		}, true);		
	},
	
	/**
	 * Create dummy widget in the panel
	 */
	addNewWidget: function(){
//		var rootNode = new Ext.tree.AsyncTreeNode({path:'root',allowDrag:false});

       var rootNode = new Ext.tree.AsyncTreeNode({
    		text: "frontend",
		    type: "app",
    		children: [{
		        "text": "afGuardUserProfile",
		        "type": "module",
		        "app": "frontend",
		        "leaf": false,
		        "children": [
		        	{
		        		"app": "frontend", "module": "afGuardUserProfile", "widgetUri": "afGuardUserProfile\/list", "type": "xml", "text": "list.xml",
			            "securityPath": "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/config\/security.yml",
		    	        "xmlPath": "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/config\/list.xml",
		        	    "actionPath": "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/actions\/actions.class.php",
		            	"leaf": true
			        }, {
						"app": "frontend", "module": "afGuardUserProfile", "widgetUri": "afGuardUserProfile\/edit", "type": "xml", "text": "edit.xml",
		            	"securityPath": "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/config\/security.yml",
		            	"xmlPath": "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/config\/edit.xml",
		            	"actionPath": "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/actions\/actions.class.php",
		            	"leaf": true
		        	}
		        ]
		    	},
		    	{"text": "afGuardAuth", "type": "module", "app": "frontend", "leaf": true, "iconCls": "icon-folder"},
			    {"text": "pages", "type": "module", "app": "frontend", "leaf": true, "iconCls": "icon-folder"},
		    	{"text": "sfGuardUser", "type": "module", "app": "frontend", "leaf": true, "iconCls": "icon-folder"}
			]
        });
		
		var loader = new Ext.tree.TreeLoader({
			url: window.afStudioWSUrls.getModulesUrl(),
			baseParams: {cmd: 'get'},
			listeners: {
				beforeload:function (loader, node,clb){
					node.getOwnerTree().body.mask('Loading, please Wait...', 'x-mask-loading');
				},
				
				load:function (loader,node,resp){
					node.getOwnerTree().body.unmask();
				},
				
				loadexception:function(loader,node,resp){
					node.getOwnerTree().body.unmask();
				}
			}
		}); 
		
		var widgetsTree = new Ext.tree.TreePanel({
			url: window.afStudioWSUrls.getModulesUrl(),
			method: 'post',
			reallyWantText: 'Do you really want to',
			root: rootNode,
			
			loader: loader,
			
			id: this.id + '-widgets-tree',
			
			listeners: {
				'render': function(){
//					loader.load(rootNode);
				},
				'click': function(node, e){
					Ext.getCmp(this.id + '-add-widget-btn').enable();
				}, scope: this
			},
			
			rootVisible:false,
			
			height: 350,
			autoScroll: true
		});
		
		var scope = this;		
		var wnd = new Ext.Window({
			id: this.id + '-widgets-tree-wnd',
			title: 'Add new widget', width: 233,
			autoHeight: true, closable: true,
            draggable: true, plain:true,
            modal: true, resizable: false,
            bodyBorder: false, border: false,
            items: widgetsTree,
			buttons: [
				{text: 'Add widget', handler: this.addWidgetCmp, disabled: true, id: this.id + '-add-widget-btn', scope: scope},
				{text: 'Cancel', handler: function(){wnd.close()}}
			],
			buttonAlign: 'center'
		});
		wnd.show()			
	},
	
	/**
	 * Function addWidgetCmp
	 * Add widget panel to the layout designer container
	 * @return {Void}
	 */
	addWidgetCmp: function(){
		var tree = Ext.getCmp(this.id + '-widgets-tree');
		try {
			var sn = tree.getSelectionModel().selNode;
			var text = sn.text;
			var params = {iconCls: sn.attributes.iconCls, title: sn.attributes.text};
		} catch(e){
			var text = 'Default Widget Name';
			var params = {iconCls: 'icon-folder', title: text};
		}
		this.addWidgetToCnt(text, params);
	},
	
	/**
	 * Function addWidgetToCnt
	 * Add widget to the Layout Container
	 * @param {String} text 
	 * @param {Object} params
	 */
	addWidgetToCnt: function(text, params){
		var component = this.getNewWidgetCfg(text);
		component.widgetParams = params;
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
		
		Ext.getCmp(this.id + '-widgets-tree-wnd').close();
	},
	
	/**
	 * Function getNewWidgetCfg 
	 * @param {String} text
	 * @return {Object} New widget cfg
	 */
	getNewWidgetCfg : function(text){
		return {html: '<br><center>Widget <b>' + text + '</b> <i>Click to edit Widget<i></center><br>', title: text, frame: true,
			bodyCssClass: 'layout-designer-widget',
			tools:[
				{id: 'close', handler: this.removeWidget, scope: this}
			],
			buttons: [
				{text: 'Preview', handler: this.preview/*, scope: this*/},
				{text: 'Edit', handler: this.runWidgetDesigner, scope: this}
			],
			buttonAlign: 'center',
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