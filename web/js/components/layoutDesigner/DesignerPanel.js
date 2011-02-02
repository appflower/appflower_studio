Ext.namespace('afStudio.layoutDesigner');

afStudio.layoutDesigner.DesignerPanel = Ext.extend(Ext.Panel, {

	/**
	 * @cfg {Number} columnsNumber (defaults to 2)
	 * Columns number of DesignerPanel 
	 */
	 columnsNumber : 2
	 
	/**
	 * @property {Ext.ux.Portal} designerPortal
	 */

	/**
	 * @property {afStudio.layoutDesigner.WidgetSelectorWindow} widgetSelectorWindow  
	 */ 
	  
	//TODO rewrite
	,resizerHandler : function(resizer,width,height,e) {
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
	
	//TODO
	,refreshExistingWidgets : function() {
		/*
		var els = Ext.DomQuery.select('DIV[class*="layout-designer-widget"]', 'details-panel');
		
		var detailP = Ext.getCmp('details-panel');
		detailP.removeAll(true);
		
		this.addLayout(detailP, cmp.getValue(), els.length);		
		
		if(0 ==i) {
			for(var j = 0; j < additionalColumns; j++ ) {
				portItems[0].items.push(this.getNewWidgetCfg());
			}
		}
		*/		
	}//eo refreshExistingWidgets
	
	
	/**
	 * Creates {@link #designerPortal} column
	 * @param {Number} id The column's ID
	 * @param {Number} width The column's width
	 * @return {Object} column configuration
	 */
	,createDesignerColumn : function(id, width) {
		return {
			id: 'port-column-' + id,				
			columnWidth: width,
			style: 'padding:5px 0 5px 5px',
			defaults: {
				bodyCssClass: 'layout-designer-widget'
			}			
		}
	}//eo createDesignerColumn

	/**
	 * Updates designer panel.
	 * Creates {@link #columnsNumber} number of columns inside {@link #designerPortal} portal panel
	 * and recreates already exist widgets
	 */
	,refreshDesignerPanel : function() {
		var _this = this,
			  cls = this.columnsNumber,
			   dp = this.designerPortal,
		dpColumns = [];
		
		dp.removeAll(true);
			   
		var columnwidth = Ext.util.Format.round(1 / cls, 2);
		
		for (var i = 0; i < cls; i++) {			
			dpColumns.push(_this.createDesignerColumn(i, columnwidth));
		}

		dp.add(dpColumns);
		
		_this.refreshExistingWidgets();

		_this.doLayout();
	}//eo refreshDesignerPanel	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var tb = new Ext.Toolbar({
	        items: [
	        {
	        	text: 'Save',
	        	itemId : 'designerSaveBtn',
	        	iconCls: 'icon-save'	        	
	        },'-',{
	        	text: 'New Widget',
	        	itemId : 'designerNewWidgetBtn',
	        	iconCls: 'icon-add'	        	
	        },'-',{
	        	text: 'Format', 
	        	itemId : 'designerFromatMenu',
	        	iconCls: 'icon-format', 
	        	menu: {
					items: [
					{
						text: 'Columns', 
						menu: {
							items: [
	    					{
								xtype: 'combo',
								id: 'designer-format-column-combo',
								triggerAction: 'all', 
								mode: 'local', 
								emptyText: 'Select an item...',
								store: [
									[1, '1 column'], 
									[2, '2 columns'], 
									[3, '3 columns'], 
									[4, '4 columns']
								]
							}]
						}
					},{
						text: 'Re-size', 
						handler: this.resizeItems, 
						scope: this
					},{
						text: 'Auto-Adjust', 
						handler: this.autoAdjust, 
						scope: this
					}]	        		
	        	}	        	
	        },'-',{
	        	text: 'Preview', 
	        	iconCls: 'icon-preview', 
	        	handler: this.preview
	        }]			
		});
		
		_this.designerPortal = new Ext.ux.Portal ({
			bodyStyle: 'padding: 5px;'
		});
		
		return {
			id: 'details-panel',
			layout: 'fit',
			tbar: tb,
	        bodyBorder: false, 
	        border: false,			
			autoScroll: true,
			items: 	_this.designerPortal
		}		
	}//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.layoutDesigner.DesignerPanel.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this,
			 tbar = _this.getTopToolbar(),
			 saveBtn = tbar.getComponent('designerSaveBtn'),
		newWidgetBtn = tbar.getComponent('designerNewWidgetBtn'),
		formatColumnCb = Ext.getCmp('designer-format-column-combo');

		_this.on({
	    	afterrender: _this.initDesignerPanel,
	    	scope: _this
		});
		
		saveBtn.on('click', _this.saveLayout, _this);
		
		newWidgetBtn.on('click', _this.onClickNewWidget, _this);
		
		formatColumnCb.on({
			select: _this.onSelectDesignerColumnNumber,
			scope: this
		});		
	}//eo _afterInitComponent
	
	/**
	 * This designer panel <u>afterrender</u> event listener
	 * Executes init actions
	 */
	,initDesignerPanel : function() {
		this.refreshDesignerPanel();		
	}	
	
	/**
	 * Format->Columns <u>select</u> event listener
	 * For more detailed information look at {@link Ext.form.ComboBox#select}
	 */
	,onSelectDesignerColumnNumber : function(combo, record, index) {
		var colNum = combo.getValue();
		this.columnsNumber = colNum;
		this.refreshDesignerPanel();
	}
	
	,onClickNewWidget : function() {
		if (!this.widgetSelectorWindow) {
			this.widgetSelectorWindow = new afStudio.layoutDesigner.WidgetSelectorWindow();
		}
		this.widgetSelectorWindow.show();
	}
	
	/**
	 * function resizeItems
	 * Resize button handler
	 */
	,resizeItems: function(){
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
	//TODO rewrite 
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
		
	//TODO rewrite 
	saveLayout: function(){
		this.fireEvent("logmessage",this,"layout saved");
	},	
	
	/**
	 * Function preview
	 * Show preview window with real widget
	 */
	//TODO rewrite 
	preview: function() {		
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

/**
 * @type 'afStudio.layoutDesigner.designerPanel'
 */
Ext.reg('afStudio.layoutDesigner.designerPanel', afStudio.layoutDesigner.DesignerPanel);