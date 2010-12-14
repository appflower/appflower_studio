
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
		
		var notificationsReader = new Ext.data.JsonReader ({
			fields: [
			{
				name: "id"
			},
			{
				name: "message",
				sortType: "asText"
			},
			{
				name: "messageType",
				sortType: "asText"
			},
			{
				name: "user",
				sortType: "asText"
			},
			{
				name: "ip",
				sortType: "asText"
			},
			{
				name: "created_at",
				sortType: "asDate"
			},
			{
				name: "redirect"
			},
			{
				name: "load"
			},
			{
				name: "_color",
				type: "auto"
			},
			{
				name: "_cell_color",
				type: "auto"
			}
			],
			totalProperty: "totalCount",
			root: "rows",
			properties: "properties"
		});

		var notificationsStore = new Ext.data.GroupingStore ({
			sortInfo: {
				field: "created_at",
				direction: "DESC"
			},
			reader: notificationsReader,
			remoteSort: true,
			proxy: new Ext.data.HttpProxy ({
				url: "/appFlowerStudio/notifications",
				method: "GET",
			})
		});

		var notificationsPt = new Ext.PagingToolbar ({
			store: notificationsStore,
			displayInfo: true,
			pageSize: 5,
		});
		
		var notificationsGrid = new Ext.grid.GridPanel ({
			iconCls: 'icon-notifications', 
			title: 'Notifications',
		    loadMask: true,
			frame: false,
			bodyStyle: "border: 1px solid #8db2e3;",
			stripeRows: true,
			autoHeight: true,
			clearGrouping: true,
			canMask: function () { return !Ext.isIE&&!grid_A84GD0ln115AA18s.disableLoadMask&&!Ext.get('loading'); },
			view: new Ext.ux.GroupingColorView ({
				forceFit: true,
				groupTextTpl: " {text} ({[values.rs.length]} {[values.rs.length > 1 ? \"Items\" : \"Item\"]})"
			}),
			columns: [
			{
				dataIndex: "id",
				sortType: "asText",
				header: "ID",
				sortable: true,
				width: 10,
				hidden: true,
				hideable: true,
				id: "id"
			},
			{
				dataIndex: "message",
				sortType: "asText",
				header: "Message",
				sortable: true,
				width: 40,
				hidden: false,
				hideable: true,
				id: "message"
			},
			{
				dataIndex: "messageType",
				sortType: "asText",
				header: "Message Type",
				sortable: true,
				width: 10,
				hidden: false,
				hideable: true,
				id: "messageType"
			},
			{
				dataIndex: "ip",
				sortType: "asText",
				header: "IP",
				sortable: true,
				width: 10,
				hidden: false,
				hideable: true,
				id: "ip"
			},
			{
				dataIndex: "user",
				sortType: "asText",
				header: "User",
				sortable: true,
				width: 10,
				hidden: false,
				hideable: true,
				id: "user"
			},
			{
				dataIndex: "created_at",
				sortType: "asDate",
				header: "Created At",
				sortable: true,
				width: 20,
				hidden: false,
				hideable: true,
				id: "created_at"
			}
			],
			store: notificationsStore,
			bbar: notificationsPt
			});

		/*
		* load every 60 seconds the notifications store
		*/
		
		var task = {
		    run: function(){
		        notificationsStore.load({
					params:{
						start:0, 
						limit:5
					}
				});
		    },
		    interval: 60*1000 //60 seconds
		}
		Ext.TaskMgr.start(task);
			
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
							html: ''
						},

						notificationsGrid,
						
						{
						    xtype: 'panel', iconCls: 'icon-debug', title: 'Debug', html: '', 
                            tbar: {
                                id: 'debug-toolbar'
                            /*    items: [
                                    {
                                        id: this.id + '-console-debug-frontend',
                                        itemId: 'debug_frontend',
                                        text: 'Frontend'
                                    },
                                    {xtype: 'tbseparator'},
                                    {text: 'Logfile2'}
                                ]*/
                            },
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
        
        Ext.Ajax.request({
            url: _this.debugUrl,
            method: _this.method,
            params: {
                file_name: e.id
            },
            callback: function(options, success, response) {                
                _this.body.unmask();
                var response = Ext.decode(response.responseText);
                Ext.getCmp(_this.id + '-debug-tab').update(response.debug);
                _this.body.scroll("bottom", 1000000, true );    
            }
        });
          

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
                Ext.getCmp(_this.id + '-debug-tab').update(response.debug);
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
                }

            }
        });
        
	} //eo _initEvents
	
});

Ext.reg('console', afStudio.console);