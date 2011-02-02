Ext.namespace('afStudio.layoutDesigner');

afStudio.layoutDesigner.WidgetSelectorWindow = Ext.extend(Ext.Window, {
	
	/**
	 * @cfg {String} modulesUrl 
	 */
	moduleUrl : afStudioWSUrls.getModulesUrl()

	/**
	 * @cfg {String} widgetUrl 
	 */
	,widgetUrl : afStudioWSUrls.getModuleWidgetsUrl()
	
	/**
	 * @property {Ext.FormPanel} selectorForm
	 * This window inner from panel
	 */
	
	/**
	 * @property {Ext.form.ComboBox} modulesCombo
	 * Combobox contains list of modules grouped by application
	 */

	/**
	 * @property {Ext.form.ComboBox} widgetsCombo
	 * Combobox contains list of widgets inside specified {@link #modulesCombo} module
	 */	
	
	/**
	 * Closes/Hides this window
	 */
	,closeWidgetSelectorWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	}//eo closeWidgetSelectorWindow
	
	/**
	 * Fires this window <u>widgetselect</u> event
	 */
	,selectWidget : function() {
		var f = this.selectorForm.getForm();
				
		if (f.isValid()) {
			this.closeWidgetSelectorWindow();
			this.fireEvent('widgetselect', f.getFieldValues());
		}
	}//eo selectWidget
	
	/**
	 * Loads modules combo
	 */
	,loadModules : function() {
		this.modulesCombo.getStore().load();
	}
	
	/**
	 * Loads module's widgets
	 * modulesCombo <u>select</u> event listener
	 * see {@link Ext.form.ComboBox#select}
	 */
	,onModuleSelect : function(c, r, idx) {
		var _this = this,
			   wc = this.widgetsCombo,
		  wcStore = wc.getStore();
		
		wcStore.load({
			params: {
				app_name: r.get('group'),
				module_name: r.get('value')
			},
			callback: function() {
				wc.reset();
				wc.enable();
			}
		});
	}
	
	/**
	 * This <u>show</u> event listener
	 * Sets first active tab and loads data
	 */
	,onWidgetSelectorShow : function() {
		var _this = this,
			    f = this.selectorForm;
			    
		f.getForm().reset();
		_this.widgetsCombo.disable();
		_this.loadModules();
	}//modulesCombo	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var modulesCombo = new Ext.ux.form.GroupingComboBox({
			ref: '../modulesCombo',
            fieldLabel: 'Module Location',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			mode: 'local',
            store: new Ext.data.JsonStore({
	            url: _this.moduleUrl,
	            baseParams: {cmd: 'getGrouped'},
	            idProperty: 'value',
	            fields: ['value', 'text', 'group']
            }),
            valueField: 'value',
            displayField: 'text',
			groupField: 'group',
			allowBlank: false,
            hiddenName: 'module',
            name: 'module'
		});
		
		var widgetsCombo = new Ext.form.ComboBox({
			ref: '../widgetsCombo',
            fieldLabel: 'Widget',
			typeAhead: true,
			triggerAction: 'all',
			forceSelection: true,
			mode: 'local',
            store: new Ext.data.JsonStore({
	            url: _this.widgetUrl,
	            idProperty: 'id',
	            fields: ['id', 'name']
            }),
            valueField: 'name',
            displayField: 'name',
			allowBlank: false,
			disabled: true,
            hiddenName: 'widget',
            name: 'widget'
		});
		
		//Window's form panel 
		var selectorForm = new Ext.FormPanel({
			ref: 'selectorForm',				
			baseCls: 'x-plain',
			style: 'padding: 5px',
			border: false,			
			labelWidth: 100,
			defaults: {
	            anchor: '100%',
				msgTarget: 'qtip'
			},
			items: [			
				modulesCombo,
				widgetsCombo
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
            items: selectorForm,
			buttons: [
			{
				text: 'Add Widget',
				handler: _this.selectWidget, 
				scope: _this				
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

		_this.addEvents(
			/**
			 * @event 'widgetselect' Fires when widget was selected
			 * @param {Object} widgetParam the {'module': MODULE_NAME, 'widget': WIDGET_NAME}
			 */
			'widgetselect'
		);
		
		_this.on({
			'show': Ext.util.Functions.createDelegate(_this.onWidgetSelectorShow, _this)
		});
		
		_this.modulesCombo.on('select', _this.onModuleSelect, _this);
	}//eo _afterInitComponent	
	
});
