Ext.namespace('afStudio.layoutDesigner');

//TODO should be cleaned & rewritten

/**
 * @class afStudio.layoutDesigner.DesignerPanel
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.layoutDesigner.DesignerPanel = Ext.extend(Ext.Panel, {

	/**
	 * @cfg {Object} layoutMeta required 
	 */	
	 

	/**
	 * @property {afStudio.layoutDesigner.WidgetSelectorWindow} widgetSelectorWindow  
	 */
	
	/**
	 * Checks if <b>content</b> layout is tabbed
	 * @return {Boolean} true is layout is tabbed otherwise false
	 */
	isLayoutTabbed : function() {
		var _this = this,
			isTabbed = false,
			area = this.layoutMeta['i:area'];
			
		if (Ext.isArray(area)) {
			Ext.each(area, function(a, i) {
				if (a.attributes.type == 'content' && a['i:tab']) {
					isTabbed = true;
					return false;
				}
			});
		} else {
			if (area.attributes.type == 'content' && area['i:tab']) {
				isTabbed = true;
			}			
		}
		
		return isTabbed;
	}//eo isLayoutTabbed
	
	/**
	 * Returns specified <u>Format</u> menu item 
	 * @param {Ext.menu.Item} item The specified menu item
	 * @return {Ext.menu.Item} menu item
	 */
	,getFormatMenuItem : function(item) {
 		var formatM = this.getTopToolbar().getComponent('formatMenu').menu; 			  
 		return formatM.getComponent(item);
	}//eo getFormatMenuItem
	
	/**
	 * Returns specified <u>Format</u>-><u>Type</u> menu item
	 * @param {Ext.menu.Item} item The specified menu item
	 * @return {Ext.menu.Item} menu item
	 */
	,getFormatTypeMenuItem : function(item) {
		var typeM = this.getFormatMenuItem('typeItem').menu;
 		return typeM.getComponent(item);
	}//eo getFormatTypeMenuItem
	
	/**
	 * Updates state of designer control panel's items
	 * depending on layout type.
	 */
	,updateDesignerPanelControls : function() {
		var addNewTabMi = this.getFormatMenuItem('addNewTab');
		
		//Sets Format->Type menu in the proper state depending on layout type (normal/tabbed)
		if (this.isLayoutTabbed()) {
			this.getFormatTypeMenuItem('tabbedView').setChecked(true, true);
			addNewTabMi.enable();
		} else {
			this.getFormatTypeMenuItem('normalView').setChecked(true, true);
			addNewTabMi.disable();
		}	
	}//eo updateDesignerPanelControls	
	
	
	//TODO remove not the right place for this method
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
	        	itemId : 'saveLayoutBtn',
	        	iconCls: 'icon-save'	        	
	        },'-',{
	        	text: 'Add Widget',
	        	itemId : 'addWidgetBtn',
	        	iconCls: 'icon-add'	        	
	        },'-',{
	        	text: 'Format', 
	        	itemId : 'formatMenu',
	        	iconCls: 'icon-format', 
	        	menu: {
					items: [
					{
						text: 'Type',
						itemId: 'typeItem',
						menu: {
							defaults: {
								xtype: 'menucheckitem',								
								group: 'layoutType'
							},
							items: [
							{	
								itemId: 'normalView',
								text: 'Normal' 
							},{
								itemId: 'tabbedView',
								text: 'Tabbed'
							}]
						}
					},{
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
						itemId: 'addNewTab',
						text: 'Add new Tab' 
					}]
	        	}	        	
	        },'-',{
	        	text: 'Preview', 
	        	iconCls: 'icon-preview', 
	        	handler: this.preview
	        }]			
		});		
		
		return {
			title: 'Layout Designer',
			layout: 'fit',
			tbar: tb,
			items: {
				xtype: 'afStudio.layoutDesigner.view.page',
				pageMeta: _this.layoutMeta
			}
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
			 saveBtn = tbar.getComponent('saveLayoutBtn'),
		newWidgetBtn = tbar.getComponent('addWidgetBtn'),
		formatColumnCb = Ext.getCmp('designer-format-column-combo');
		
		saveBtn.on('click', _this.onClickSaveDesignerLayout, _this);
		
		newWidgetBtn.on('click', _this.onClickNewWidget, _this);
		
		formatColumnCb.on('select', _this.onSelectDesignerColumnsNumber, _this);
		
		_this.on('afterrender', _this.initDesignerPanel, _this);
	}//eo _afterInitComponent
	
	/**
	 * This designer panel <u>afterrender</u> event listener
	 * Executes init actions
	 */
	,initDesignerPanel : function() {		
		this.updateDesignerPanelControls();		
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