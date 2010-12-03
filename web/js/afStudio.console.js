
/**
 * Console
 * @class afStudio.console
 * @extends Ext.Panel
 * @author Radu
 * reedit by Nikolai
 */
afStudio.console = Ext.extend(Ext.Panel, {
//afStudio.console = Ext.extend(Ext.TabPanel, {	
	
	/**
	 * Loads console
	 */
	loadConsole : function() {
		var _this = this;		
		
		_this.body.mask('Loading, please Wait...', 'x-mask-loading');
		
		Ext.Ajax.request({
			url: _this.consoleUrl,
			method: _this.method,
			params: {
				command: 'start'
			},
			callback: function(options, success, response) {				
				_this.body.unmask();
				if (!success) {
					Ext.Msg.alert('Server-side failure with status code: ' + response.status);
				}
				var response = Ext.decode(response.responseText);
				
//				var textContent = Ext.getCmp('ext-comp-1053-console-tab').getEl().dom.textContent;
		      	var textContent = Ext.getCmp(_this.id + '-console-tab').body.dom.textContent;
		      	Ext.getCmp(_this.id + '-console-tab').update(textContent + response.console);
//		      	_this.body.dom.innerHTML += response.console;

		      	_this.body.scroll("bottom", 1000000, true );				
			}
			
		});						
	} //eo loadConsole
	
	/**
	 * <u>keyup</u> event listener
	 * @param {Ext.form.TextField} cmdField
	 * @param {Ext.EventObject} e
	 */
	,consoleCommandFieldKeyListener : function(cmdField, e) {		
		var _this = this,
			fieldValue = cmdField.getValue(),
			key = e ? e.getKey() : Ext.EventObject.getKey();				
		 
		if (key == Ext.EventObject.ENTER) {			
			_this.body.mask('Loading, please Wait...', 'x-mask-loading');
				
			cmdField.setValue('');
			
			if (fieldValue != 'clear') {
				Ext.Ajax.request({
					url: _this.consoleUrl,
					method: _this.method,
					params:{
						command: fieldValue
					},
					callback: function(options, success, response) {
				    	var response = Ext.decode(response.responseText);				     					
				      	afStudio.vp.layout.west.items[0].root.reload();				      	     
				      	_this.body.unmask();
				      	

						var textContent = Ext.getCmp('ext-comp-1053-console-tab').getEl().dom.textContent;
				      	Ext.getCmp(_this.id + '-console-tab').update(textContent + response.console);
				      	_this.body.scroll("bottom", 1000000, true );
				    }					
				});
			} else if(fieldValue == 'clear') {
		      	Ext.getCmp(_this.id + '-console-tab').update('');
				_this.body.scroll("bottom", 1000000, true);
			}
		}
	} //eo consoleCommandFieldKeyListener
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent: function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.console.superclass.initComponent.apply(this, arguments);
		this._initEvents();
	}
	
	,_initCmp : function() {
		var _this = this;
		
		var console_cmd_label = new Ext.form.Label({text: 'Enter command: '});
		
		var console_cmd_field = new Ext.form.TextField({
			itemId: 'console_cmd',
			width: 300,
			style:'margin-left:5px;',
			enableKeyEvents: true
		});
		
		var console_cmd_display = new Ext.form.DisplayField({value: '<span style="margin-left:10px;"><b>cmds:</b> ' + afStudioConsoleCommands + '</span>'});
		
//		var config = {
//			itemId: 'console',
//			title: "Console",
//			iconCls: 'icon-console',
//			height: 200,
//			minHeight: 0,
//			autoScroll: true,
//			tbar: {
//				items:[
//					console_cmd_label,
//					console_cmd_field,
//					console_cmd_display
//				]
//			},
//			html: '',
//			method: 'post',
//			consoleUrl: '/appFlowerStudio/console',
//			bodyStyle: 'background-color:black;font-family: monospace;font-size: 11px;color: #88ff88;',
//			plugins: new Ext.ux.MaximizeTool()
//		};
		
		var config = {
			itemId: 'console',
			
			title: "Console",
			
//			iconCls: 'icon-console',
			height: 200,
			minHeight: 0,
			autoScroll: true,
			layout: 'fit',
			items: [
				new Ext.TabPanel({
					activeTab: 0,
					items: [
						{
							xtype: 'panel', iconCls: 'icon-console', title: 'Console', 
							tbar: {
								items:[
									console_cmd_label,
									console_cmd_field,
									console_cmd_display
								]
							},
							id: this.id + '-console-tab', 
							bodyStyle: 'background-color:black;font-family: monospace;font-size: 11px;color: #88ff88;',
							html: ''
						},
						{xtype: 'panel', iconCls: 'icon-debug', title: 'Debug', html: ''}
					]
				})
			],
			method: 'post',
			consoleUrl: '/appFlowerStudio/console'
			, 
			plugins: new Ext.ux.MaximizeTool()
		}
		return config;
	} //eo _initCmp
	
	
	/**
	 * Initializes events
	 * @private
	 */
	,_initEvents : function() {
		var _this = this,
			consoleCmdField = Ext.getCmp(this.id + '-console-tab').getTopToolbar().getComponent('console_cmd');
			
		_this.on({
			afterrender: function() {
				_this.loadConsole();
			}
		});
		
		consoleCmdField.on({
			keyup : _this.consoleCommandFieldKeyListener.createDelegate(_this)
		})
	} //eo _initEvents
	
});

Ext.reg('console', afStudio.console);