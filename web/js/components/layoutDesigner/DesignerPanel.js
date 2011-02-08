Ext.namespace('afStudio.layoutDesigner');

/**
 * @class afStudio.layoutDesigner.DesignerPanel
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.layoutDesigner.DesignerPanel = Ext.extend(Ext.Panel, {

	/**
	 * @cfg {Number} columnsNumber (defaults to 2)
	 * Columns number of designer panel 
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
	
	/**
	 * Creates widget
	 * @param {Object} widgetParam
	 * @return {Object} widget configuration object
	 */
	,createWidget : function(widgetParam) {
		var _this = this,
		 	widgetTitle = widgetParam.module + '/' + widgetParam.widget;
		
		return {
			title: widgetTitle,
			frame: true,
			html: '<br /><center>Widget <b>Dummy Widget</b> <i>Click to edit Widget<i> </center><br />',
			bodyCssClass: 'layout-designer-widget',
			tools: [{
				id: 'close', 
				handler: _this.removeWidget, 
				scope: _this
			}],
			buttons: [
			{
				text: 'Preview', 
				handler: this.preview
			},{
				text: 'Edit', 
				handler: _this.runWidgetDesigner, 
				scope: _this
			}],
			buttonAlign: 'center'
		}
	}//eo createWidget
	
	/**
	 * 
	 * @param {Ext.EventObject} e The click event.
	 * @param {Ext.Element} tool The tool Element.
	 * @param {Ext.ux.Portlet} panel The widget panel
	 */
	,removeWidget: function(e, tool, panel) {
		panel.destroy();
	}	
	
	/**
	 * Creates {@link #designerPortal} column
	 * @param {Number} id The column's ID
	 * @param {Number} width The column's width
	 * @return {Object} column configuration
	 */
	,createDesignerColumn : function(id, width) {
		return {
			id: 'portal-column-' + id,				
			columnWidth: width,
			style: 'padding:5px 0 5px 5px',
			defaults: {
				bodyCssClass: 'layout-designer-widget'
			}			
		}
	}//eo createDesignerColumn	
	
	/**
	 * Adds widget to layout designer
	 * @param {} widget
	 */
	,addWidget : function(widget) {
		var cl = this.designerPortal.items.itemAt(0);
		cl.add(widget);
		cl.doLayout();  		
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
	        	text: 'Add Widget',
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
						handler: _this.resizeItems, 
						scope: _this
					},{
						text: 'Auto-Adjust', 
						handler: _this.autoAdjust, 
						scope: _this
					},{
						text: 'Add new Tab' 
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
			title: 'Layout Designer',
			layout: 'fit',
			tbar: tb,
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
		
		saveBtn.on('click', _this.onClickSaveDesignerLayout, _this);
		
		newWidgetBtn.on('click', _this.onClickNewWidget, _this);
		
		formatColumnCb.on('select', _this.onSelectDesignerColumnsNumber, _this);
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
	,onSelectDesignerColumnsNumber : function(combo, record, index) {
		var colNum = combo.getValue();
		this.columnsNumber = colNum;
		this.refreshDesignerPanel();
	}//onSelectDesignerColumnsNumber
	
	/**
	 * New Widget button <u>click</u> event listener
	 * Creates widget selector window if it is not exist or show it otherwise.
	 * Widget selector window helps to select new widget to be added listing all modules and their widgets
	 */
	,onClickNewWidget : function() {		
		if (!this.widgetSelectorWindow) {
			this.widgetSelectorWindow = new afStudio.layoutDesigner.WidgetSelectorWindow();			
			this.widgetSelectorWindow.on('widgetselect', this.onAddWidget, this);
		}
		this.widgetSelectorWindow.show();		
	}//eo f.getFieldValues()
	
	/**
	 * Creates and adds widget 
	 * widgetSelectorWindow <u>widgetselect</u> event listener
	 * @param {Object} widgetParam
	 */
	,onAddWidget : function(widgetParam) {
		var _this = this,
			    w = _this.createWidget(widgetParam);
		_this.addWidget(w);	    
	}	
 
	/**
	 * Save button <u>click</u> event listener
	 * Saves layout
	 */
	,onClickSaveDesignerLayout : function() {
		this.fireEvent("logmessage", this, "layout saved");
	}
	
	/**
	 * function resizeItems
	 * Resize button handler
	 */
	//TODO rewrite 
	,resizeItems : function() {
    	var detailp = this;
    	var columns = detailp.columnsNumber;    	
    	detailp.resizer = [];
    		
    	for (var i = 0; i < columns; i++) {    		
    		var resizer = new Ext.Resizable('portal-column-' + i, {
    			 width: 200,
                 minWidth: 100,
                 minHeight: 50,
                 listeners: {
                	 beforeresize: function(resizer, e) {
                		 var el = Ext.fly(resizer.el);
                		 resizer._width = Ext.fly(el).getWidth();
                	 },
                	 resize: function(resizer, width, height, e) {
                		 detailp.resizerHandler(resizer, width, height, e);
                	 }
                 }
    		});
    		detailp.resizer.push(resizer);
    	}
	}//eo resizeItems

	/**
	 * Auto-Adjust button handler 
	 */
	,autoAdjust : function() {
		var els = Ext.DomQuery.select('div[class*="x-portlet"]', this.designerPortal.el);
		
		for (var i = 0, l = els.length; i < l; i++) {
			var cmp = Ext.getCmp(els[i].id);
			var colW = cmp.ownerCt.getWidth();
			
			cmp.setWidth(colW);
			Ext.get(els[i]).setWidth(colW);
			
			cmp.doLayout();
			cmp.ownerCt.doLayout();
		}
	}//eo autoAdjust	
	
	/**
	 * Function preview
	 * Show preview window with real widget
	 */
	//TODO rewrite 
	,preview: function() {		
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
	}
	
	/**
	 * Function runWidgetDesigner
	 * Create widget Designer 
	 */
	//TODO rewrite make it working with real data
	,runWidgetDesigner : function() {
        var actionPath = "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/actions\/actions.class.php";
        var securityPath = "\/var\/www\/web4\/apps\/frontend\/modules\/afGuardUserProfile\/config\/security.yml";
        var widgetUri = 'afGuardUserProfile/edit';

		var mask = new Ext.LoadMask(afStudio.vp.layout.center.panel.body, {msg: 'Loading, please Wait...', removeMask:true});
		mask.show();
		
		afStudio.vp.addToPortal({
			title: 'Widget Designer', 
			layout: 'fit',
			collapsible: false, 
			draggable: false,
			items: [{
				xtype: 'afStudio.widgetDesigner', 
				actionPath: actionPath, 
				securityPath: securityPath, 
				widgetUri: widgetUri, 
				mask: mask
			}]
		}, true);		
	}
	
});

/**
 * @type 'afStudio.layoutDesigner.designerPanel'
 */
Ext.reg('afStudio.layoutDesigner.designerPanel', afStudio.layoutDesigner.DesignerPanel);