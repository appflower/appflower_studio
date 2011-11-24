Ext.ns('afStudio.models');

afStudio.models.CreateWidgetWindow = Ext.extend(Ext.Window, {
	
	
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
			baseCls: 'x-plain',
			style: 'padding: 5px',
			border: false,
			labelWidth: 100,
			defaults: {
				anchor: '100%',
				msgTarget: 'qtip'
			},
			items: [
			{
				xtype: 'checkboxgroup',
				fieldLabel: 'Widget Types',
				allowBlank: false,
			    items: [
			        {fieldLabel: 'List', name: 'list', checked: true},
			        {fieldLabel: 'Edit', name: 'edit', checked: true},
			        {fieldLabel: 'Show', name: 'show', checked: true}
			    ]					
			},{
				xtype: 'common.widgetlocation',
				allowBlank: true
			},{
				xtype: 'common.mfieldsgrid',
				title: 'Fields',
				multiSelect: true,
				height: 200,
				border: true
			},{
				xtype: 'checkbox',
				fieldLabel: 'Refresh', 
				name: 'refresh' 
			}],
			buttons: [
			{
				text: 'Create',
				iconCls: 'icon-accept',
				scope: this,
				handler: function() {
//					var ch = me.fieldForm.items.itemAt(0); 
//					console.log('types', ch.getValue());
//					console.log('errors', ch.getErrors());
					afStudio.Msg.info('Under construction )');
				}
			},{
				text: 'Cancel',
				iconCls: 'afs-icon-cancel',
				scope: this,
				handler: this.cancelEditing 
			}]			
		});		
		
		
		return {
			title: 'Create Widgets',
			modal: true,
			frame: true,
			width: 600,
			autoHeight: true,
			resizable: false,
			closeAction: 'hide',
			closable: false,
			items: [form]			
		}
	},
	//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.applyIf(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.models.EditFieldWindow.superclass.initComponent.apply(this, arguments);
		
		this._afterInitComponent();
	},
	
	/**
	 * @private
	 */
	_afterInitComponent : function() {
		
//		var g = this.fieldForm.items.itemAt(2); 
//		
//		for(var i = 0; i < 200; i++) {
//			g.store.add(new g.store.recordType());
//		}
		
//		var me = this;
//		
//		me.on({
//			scope: this,
//			
//			show: this.onShowEvent
//		});
	}	
});