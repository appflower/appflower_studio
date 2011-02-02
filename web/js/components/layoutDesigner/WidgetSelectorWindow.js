Ext.namespace('afStudio.layoutDesigner');

afStudio.layoutDesigner.WidgetSelectorWindow = Ext.extend(Ext.Window, {
	
	/**
	 * @cfg {String} modulesUrl 
	 */
	moduleUrl : window.afStudioWSUrls.getModulesUrl()
	
	/**
	 * @property {Ext.FormPanel} selectorForm
	 */
	
	,closeWidgetSelectorWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	}//eo closeWidgetSelectorWindow
	
	
	/**
	 * This <u>show</u> event listener
	 * Sets first active tab and loads data
	 */
	,onShowEvent : function() {
		var _this = this,
			    f = this.selectorForm;
			    
		f.getForm().reset();				
//		_this.loadFieldData();
	}
	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var modulesCombo = new Ext.ux.form.GroupingComboBox({			
            fieldLabel: 'Module Location',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			mode: 'local',
            store: new Ext.data.JsonStore({
            	autoLoad: true,
	            url: _this.moduleUrl,
	            baseParams: {cmd: 'getGrouped'},
	            //idProperty: 'value',
	            fields: ['value', 'text', 'group']
            }),
            valueField: 'value',
            displayField: 'text',
			groupField: 'group',
			allowBlank: false,
            anchor: '100%',
            hiddenName: 'module',
            name: 'module'
		});
		
		
		var selectorForm = new Ext.FormPanel({
			ref: 'selectorForm',				
			baseCls: 'x-plain',
			style: 'padding: 5px',
			border: false,			
			labelWidth: 100,
			defaults: {
				width: 230,
				msgTarget: 'qtip'
			},
			items: [			
				modulesCombo
//			{
//				xtype:'textfield', 
//				fieldLabel: 'Widget', 
//				anchor: '96%', 
//				name: 'widget_name', 
//				allowBlank: false
//			}
			]
		});
		
		return {
			title: 'Add New Widget',
			closeAction: 'hide',
			modal: true,
			frame: true,
			width: 463,
			closable: true,
            resizable: false,
            items: [selectorForm],
			buttons: [
			{
				text: 'Add Widget'
			},{
				text: 'Cancel', 
				handler: _this.closeWidgetSelectorWindow, 
				scope: _this
			}]
			//buttonAlign: 'center'
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
		afStudio.layoutDesigner.WidgetSelectorWindow.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on({
			'show': Ext.util.Functions.createDelegate(_this.onShowEvent, _this)
		});		
	}//eo _afterInitComponent	
	
});
