Ext.ns('afStudio.models');

/**
 * Relation Picker 
 * @class afStudio.models.RelationPicker
 * @extends Ext.Window
 * @author Nikolai
 */
afStudio.models.RelationPicker = Ext.extend(Ext.Window, {	
	
	/**
	 * Closes Picker
	 */
	closePicker : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();	
		}				
	}
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent: function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.models.RelationPicker.superclass.initComponent.apply(this, arguments);
		this._initEvents();		
	}

	/**
	 * Initializes component
	 * @return {Object} The config object
	 * @private
	 */
	,_initCmp : function() {
		var _this = this;
		
		return {
			title: 'Relation Picker',
			iconCls: 'icon-table-relationship',
			modal: true,
			width: 600,
			height: 400,
			maximizable: true,			
			plain: true,
			layout: 'border',
			items: [
			{
				region: 'west',
				layout: 'fit',
				width: 220,
				items: [{
					id: 'models-picker',
					xtype: 'afStudio.models.modelTree',
					border: false
				}]
			},{	
				region: 'center',
				items: [{ border:false, html: "<h1>Here will be model's columns</h1>" }]				
			}],
			buttons: [{
				text: 'ok',
				handler: function() {
					_this.closePicker();
					_this.fireEvent('relationpicked', undefined);					
				}
			}]
		}		
	}
	
	/**
	 * Initializes events
	 * @private
	 */
	,_initEvents : function() {
		var _this = this;
		
		_this.addEvents(
			/**
			 * @event relationpicked Fires after relation is picked
			 * @param {String} relation The picked up relation in the format model_name:model_column 
			 */
			'relationpicked'
		);
		
	}
	
});