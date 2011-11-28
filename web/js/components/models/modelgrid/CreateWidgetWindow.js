Ext.ns('afStudio.models');

/**
 * Create widgets window.
 * 
 * @class afStudio.models.CreateWidgetWindow
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.models.CreateWidgetWindow = Ext.extend(Ext.Window, {
	
	/**
	 * @cfg {String} (required) model The model name
	 */
	/**
	 * @cfg {Object} (required) fields The model's fields definiton object
	 */
	
	/**
	 * @property {Ext.FormPanel} fieldForm The main form panel
	 */
	/**
	 * @property {Ext.form.CheckboxGroup} widgetTypes The widget types available for creation
	 */
	/**
	 * @property {afStudio.common.WidgetLocation} widgetLocation The location combobox
	 */
	/**
	 * @property {afStudio.common.ModelFieldsGrid} fieldsGrid The model's fields grid
	 */
	/**
	 * @property {Ext.form.Checkbox} refresh The override flag
	 */
	
	/**
	 * Closes this window.
	 */
	closeEditFieldWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	},

	/**
	 * "Cancel" button handler.
	 */
	cancelEditing :  function() {
		this.closeEditFieldWindow();
	},

	/**
	 * Initializes component.
	 * @private
	 * @return {Object} The configuration object
	 */
	_beforeInitComponent : function() {
		var me = this;
		
		var form = new Ext.FormPanel({
			ref: 'fieldForm',
			monitorValid: true,
			labelWidth: 120,
			border: false,
			baseCls: 'x-plain',
			style: 'padding: 5px',
			defaults: {
				anchor: '100%',
				msgTarget: 'qtip'
			},
			items: [
			{
				xtype: 'checkboxgroup',
				ref: 'widgetTypes',
				fieldLabel: 'Widget Types',
				allowBlank: false,
				blankText: 'At least one widget type must be selected',
				style: 'margin: 0 2px 4px;',
				columns: 1,
				defaults: {checked: true},
			    items: [
			        {boxLabel: 'List', name: 'list'},
			        {boxLabel: 'Edit', name: 'edit'},
			        {boxLabel: 'Show', name: 'show'}
			    ]
			},{
				xtype: 'common.widgetlocation',
				ref: 'widgetLocation',
				autoLoad: false,
				allowBlank: true			
			},{
				xtype: 'common.mfieldsgrid',
				ref: 'fieldsGrid',
				title: 'Fields',
				multiSelect: true,
				height: 200,
				border: true
			},{
				xtype: 'checkbox',
				ref: 'refresh',
				fieldLabel: 'Overwrite Existing', 
				name: 'refresh' 
			}],
			buttons: [
			{
				text: 'Create',
				iconCls: 'icon-accept',
				formBind: true,
				scope: me,
				handler: this.createWidgets
			},{
				text: 'Cancel',
				iconCls: 'afs-icon-cancel',
				scope: this,
				handler: this.cancelEditing 
			}]			
		});		
		
		return {
			title: 'Create Widgets',
			iconCls: 'icon-widgets-add',
			modal: true,
			frame: true,
			width: 600,
			autoHeight: true,
			resizable: false,
//			closeAction: 'hide',
//			closable: false,
			items: [form]			
		}
	},
	//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.models.EditFieldWindow.superclass.initComponent.apply(this, arguments);
	},
	
	/**
	 * @override
	 */
	onShow : function() {
		var me = this,
			fg = this.fieldForm.fieldsGrid,
			fgSm = fg.getSelectionModel();

		fg.store.loadData(me.fields);
		fgSm.selectAll.defer(10, fgSm);
		
		
		this.fieldForm.widgetLocation.store.reload();
	},
	
	/**
	 * Returns widget generation data.
	 * @return {Object} data 
	 */
	getGenerateData : function() {
		var data = {
				model: this.model
			},
			f = this.fieldForm;

		//'fields'
		var fs = f.fieldsGrid.getSelectionModel().getSelections();
		if (Ext.isEmpty(fs)) {
			afStudio.Msg.warning('Create Widgets', 'Must be selected at least one field');
		} else {
			var fields = [];
			Ext.each(fs, function(r, idx){
				fields[idx] = r.data.name;
			});
			data.fields = fields.join(',');
		}
		
		//'type'
		if (f.widgetTypes.getValue().length > 0) {
			var wtype = [];
			Ext.each(f.widgetTypes.getValue(), function(i, idx){
				wtype[idx] = i.getName();
			});
			data.type = wtype.join(',');
		}
		
		
		//'module_name'
		//'place_type', default is 'app'
		//'place', default is 'frontend'
		var l = f.widgetLocation.getValue();
		if (l != null) {
			data.module_name = l.module; 
			data.place_type = l.placeType; 
			data.place = l.place; 
		}
		
		//'refresh', 'false'
		data.refresh = f.refresh.getValue();
		
		return data;
	},
	//eo getGenerateData
	
	/**
	 * Creates widget(s) and closes CreateWidgetWindow.
	 */
	createWidgets : function() {
		var data = this.getGenerateData();
		
		afStudio.xhr.executeAction({
			url: afStudioWSUrls.widgetGenerateUrl,
			params: data,
			mask: "Processing creation...",
			scope: this,
			run: function(response, ops) {
				//refresh navigation panel
				if (ops.params.place_type == 'plugins') {
					afStudio.vp.viewRegions.west.get('plugins').onItemActivate();	
				} else {
					afStudio.vp.viewRegions.west.get('widgets').onItemActivate();
				}
			}
		});
		
		this.closeEditFieldWindow();
	}
});