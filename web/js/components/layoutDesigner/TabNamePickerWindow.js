Ext.namespace('afStudio.layoutDesigner');

/**
 * Picks tab title
 * 
 * @class afStudio.layoutDesigner.TabNamePickerWindow
 * @extends Ext.Window
 * @author Nikolai
 */
afStudio.layoutDesigner.TabNamePickerWindow = Ext.extend(Ext.Window, {
	
	/**
	 * @property {Ext.FormPanel} pickerForm
	 * Picker form
	 */
	
	/**
	 * Closes/Hides this window
	 */
	closePickerWindow : function() {
		
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	}//eo closeWidgetSelectorWindow
	
	/**
	 * Fires this window <u>tabnamepicked</u> event
	 */
	,pickTabName : function() {
		var f = this.pickerForm.getForm();
		
		if (f.isValid()) {
			var tabTitle = this.pickerForm.tabNameField.getValue();			
			this.closePickerWindow();
			this.fireEvent('tabnamepicked', tabTitle);
		}
	}//eo selectWidget	
	
	/**
	 * This <u>show</u> event listener
	 * Resets form
	 */
	,onTabNamePickerShow : function() {
		var _this = this,
			    f = this.pickerForm;
	    
		f.getForm().reset();
		f.tabNameField.focus(true, 200);
	}//eo onTabNamePickerRendered	
	
	/**
	 * tabNameField <u>keypress</u> event listener
	 * Picks tab title when ENTER key is pressed.
	 * @param {Ext.form.TextField} field
	 * @param {Ext.EventObject} e
	 */
	,onTabPickerFieldKeyPress : function(field, e) {
 		if (e.getKey() == e.ENTER) { 			
 			this.pickTabName();
 		}
	}//eo onTabPickerFieldKeyPress
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		//Window's form panel
		var pickerForm = new Ext.FormPanel({
			ref: 'pickerForm',				
			baseCls: 'x-plain',
			anchor: '100%',
			border: false,
			defaults: {
	            anchor: '100%',
				msgTarget: 'qtip'
			},
			items: [
			{
				xtype: 'textfield',
				ref: 'tabNameField',
				allowBlank: false,
				blankText: 'Tab title is required!',
				vtype: 'alphanum',
				hideLabel: true,
				height: 35,
				style: 'font-size: 20px',
				enableKeyEvents: true,
				name: 'tabNameField'
			}]
		});
		
		return {
			title: 'Choose tab title',
			closeAction: 'hide',
			modal: true,
			frame: true,
			width: 200,
			height: 100,
			closable: true,
            resizable: false,
            items: pickerForm,
            buttonAlign: 'center',
			buttons: [
			{
				text: 'Save',
				handler: _this.pickTabName, 
				scope: _this				
			},{
				text: 'Cancel', 
				handler: _this.closePickerWindow, 
				scope: _this
			}]
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
		afStudio.layoutDesigner.TabNamePickerWindow.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this,
			tabNamePicker = this.pickerForm.tabNameField;

		_this.addEvents(
			/**
			 * @event 'tabnamepicked' Fires when tab name was inputted and picked
			 * @param {String} tabName
			 */
			'tabnamepicked'
		);
		
		tabNamePicker.on('keypress', _this.onTabPickerFieldKeyPress, _this);
		
		_this.on({
			show: _this.onTabNamePickerShow, 
			scope: _this
		});
	}//eo _afterInitComponent	
	
});
