
/**
 * Console
 * @class afStudio.console
 * @extends Ext.Panel
 * @author Radu
 * reedit by Nikolai
 */
afStudio.console = Ext.extend(Ext.Panel, {
	
	id: 'console'
	,startedNotifications: false
	,notificationOffset: 0
	/**
	 * Loads notifications with an offset, for not loading all the time all the notifcations at once
	 */
	,loadNotifications : function() {
		var _this = this;		
		
		_this.body.mask('Loading, please Wait...', 'x-mask-loading');
		
		Ext.Ajax.request({
			url: _this.notificationsUrl,
			method: _this.method,
			params: {
				cmd: 'get',
				offset: _this.notificationOffset
			},
			callback: function(options, success, response) {				
				_this.body.unmask();
				if (!success) {
					Ext.Msg.alert('Server-side failure with status code: ' + response.status);
				}
				var response = Ext.decode(response.responseText);
				
				_this.notificationOffset = response.offset;
				
		      	var textContent = Ext.getCmp(_this.id + '-notifications-tab').body.dom.innerHTML;
		      	Ext.getCmp(_this.id + '-notifications-tab').update(textContent+response.notifications);
		      	Ext.getCmp(_this.id + '-notifications-tab').body.scroll("bottom", 1000000, true );				
			}
			
		});						
	} //eo loadNotifications
	
	,startNotifications: function () {
		var _this = this;
		
		if(!_this.startedNotifications)
		{
			_this.startedNotifications = true;
			
			/*
			* load every 60 seconds the notifications store
			*/
			
			var task = {
			    run: function(){
			        _this.loadNotifications();
			    },
			    interval: 60*1000 //60 seconds
			}
			Ext.TaskMgr.start(task);
		}
	}

	/**
	 * Loads console
	 */
	,loadConsole : function() {
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
				
		      	afStudio.updateConsole(response.console);				
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
				      	
				      	afStudio.updateConsole(response.console);
				    }					
				});
			} else {
		      	afStudio.setConsole('');
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
		
		_this.debugStore = new Ext.data.Store({
            autoLoad: {params:{start: 0, limit: 1}},
            
            url: '/appFlowerStudio/debug',
            id: 'debug_store',
            
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                fields: ['text'],
            }),
            
        });
        
        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="thumb-wrap">',
                '{text}',
                '<div class="x-clear"></div>',
                '</div>' +
               '</tpl>'
        );
        
        var debugDataView = new Ext.DataView({
                                            store: _this.debugStore,
                                            tpl: tpl,
                                            autoHeight: true,
                                            forceFit: true,
                        });
        
		
		var config = {
			itemId: 'console',
			title: "Console",			
			height: 200,
			minHeight: 0,
			autoScroll: true,
			layout: 'fit',
			items: [
				new Ext.TabPanel({
				    id: 'console-tabs',
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
							html: '',
							autoScroll: true
						},
						{
							xtype: 'panel', iconCls: 'icon-notifications', title: 'Notifications',							
							id: this.id + '-notifications-tab', 
							bodyStyle: 'background-color:black;font-family: monospace;font-size: 11px;color: #88ff88;',
							html: '',
							autoScroll: true
						},
						
						{
						    xtype: 'panel', iconCls: 'icon-debug', title: 'Debug', 
						    items: [debugDataView], 
                            tbar: {
                                id: 'debug-toolbar'
                            },
                            bbar: new Ext.PagingToolbar({
                                store: _this.debugStore,
                                displayInfo: true,
                                pageSize: 1,
                                listeners: {
                                    render: function(cmp){
                                        cmp.moveLast();
                                    },
                                },
                                id: 'debug-bbar'
                            }),
                            id: this.id + '-debug-tab',
                            autoScroll: true, 
                            bodyStyle: 'background-color:black;font-family: monospace;font-size: 11px;color: #88ff88;'
                        }
					]
				})
			],
			method: 'post',
			consoleUrl: '/appFlowerStudio/console',
			debugUrl: '/appFlowerStudio/debug',
			notificationsUrl: '/appFlowerStudio/notifications', 
			plugins: new Ext.ux.MaximizeTool()
		}
		return config;
	} //eo _initCmp
	
	
	,consoleDebugClickListener : function(e, t) {      
         var _this = this;
        
        _this.body.mask('Loading, please Wait...', 'x-mask-loading');
        
        _this.debugStore.baseParams.file_name = e.id;
        _this.debugStore.baseParams.command = "file";
        
        _this.debugStore.load({params:{   
                                    start:0,
                                    limit:1,
                                    command: 'file',
                                    file_name: e.id
                                }});
        _this.body.unmask();
        
        // Ext.getCmp('debug-bbar').moveLast();
    } //eo consoleDebugClickListener
	
	
	/**
     * Update debug tab information 
     */
    ,updateDebugTab: function () {
        var _this = this;
        
        _this.body.mask('Loading, please Wait...', 'x-mask-loading');
        
        Ext.Ajax.request({
            url: _this.debugUrl,
            method: _this.method,
            params: {
                command: 'main'
            },
            callback: function(options, success, response) {                
                _this.body.unmask();
                var response = Ext.decode(response.responseText);
                // Ext.getCmp(_this.id + '-debug-tab').update(response.debug);
                _this.body.scroll("bottom", 1000000, true );  
                
                var tb = Ext.getCmp(_this.id + '-debug-tab').getTopToolbar();
                tb.removeAll();
                
                var files_count = response.files.length;
                if (files_count > 0) {
                    Ext.each(response.files, function(file_name, index) {        
                        tb.addButton({
                            text: file_name, 
                            id: file_name,
                            itemId: file_name,
                            // handler: _this.consoleDebugClickListener
                        });
                        tb.getComponent(file_name).on({
                            click: _this.consoleDebugClickListener.createDelegate(_this)
                        })
                        
                        if (index != files_count - 1) {
                            tb.add('-');
                        }
                    });
                }
                
                tb.doLayout();
            }
        });
        
    }
	
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
		});
		
        // Changing tab event
        var consoleTab = Ext.getCmp('console-tabs');
        consoleTab.on({
            tabchange: function(tabPanel, tab) {
                
                switch (tab.id) {
                    case _this.id + '-debug-tab':
                        _this.updateDebugTab();
                        break;
                    case _this.id + '-notifications-tab':
                    	_this.startNotifications();
                    	break;
                }

            }
        });
        
	} //eo _initEvents
	
});

Ext.reg('console', afStudio.console);