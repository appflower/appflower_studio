afStudio.databaseConnectionSettings = Ext.extend(Ext.Window, { 
	form: null,
	initComponent: function(){
		this.createForm();
		
		var config = {
			title: 'Database Connection Settings', width: 463,
			autoHeight: true, closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        items: this.form,
			buttons: [
				{text: 'Save', handler: this.saveDatabaseSettings, scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.databaseConnectionSettings.superclass.initComponent.apply(this, arguments);	
		
		this.show();
	},
	
	createForm: function(){
/***
		this.form = new Ext.FormPanel({
		    url: 'appFlowerStudio/configureDatabase', defaultType: 'textfield', width: 450, frame: true, 
			labelWidth: 100, title: false,
			items: [
				{xtype: 'panel', layout: 'column',
					items: [
						{xtype: 'panel', columnWidth: 1, layout: 'form', style: 'margin-right: 5px;',
							items: [{xtype: 'textfield', fieldLabel: 'Database Host', name: 'f[database]', anchor: '92%', allowBlank: false}]
						},
						{xtype: 'panel', width: 150, layout: 'form', labelWidth: 35,
							items: [{xtype: 'textfield', fieldLabel: 'Port', name: 'f[port]', anchor: '88%'}]
						}
					]
				},
				{xtype:'textfield', fieldLabel: 'Username', anchor: '96%', name: 'f[username]', allowBlank: false},
				{xtype:'textfield', fieldLabel: 'Password', anchor: '96%', name: 'f[password]'},
				{xtype: 'checkbox', hideLabel: true, boxLabel: 'Persistent', name: 'f[persistent]'},
				{xtype: 'checkbox', hideLabel: true, boxLabel: 'Pooling', name: 'f[pooling]'}
			]
		});		
*/		
		
		this.form =  new Ext.FormPanel({
			url: 'appFlowerStudio/configureDatabase', defaultType: 'textfield', width: 450, frame: true,
	        labelWidth: 100, title: false,
			items: [
	        	{xtype:'textfield', fieldLabel: 'Database', anchor: '96%', name: 'database', allowBlank: false},
				{xtype: 'panel', layout: 'column',
					items: [
						{xtype: 'panel', columnWidth: 1, layout: 'form', style: 'margin-right: 5px;',
							items: [{xtype: 'textfield', fieldLabel: 'Host', name: 'host', anchor: '92%', allowBlank: false}]
						},
						{xtype: 'panel', width: 100, layout: 'form', labelWidth: 35,
							items: [{xtype: 'textfield', fieldLabel: 'Port', name: 'port', anchor: '82%', allowBlank: false}]
						}
					]
				},
				{xtype:'textfield', fieldLabel: 'Username', anchor: '96%', name: 'username', allowBlank: false},
				{xtype:'textfield', fieldLabel: 'Password', anchor: '96%', name: 'password', allowBlank: false},
				{xtype: 'checkbox', hideLabel: true, boxLabel: 'Persistent', name: 'persistent'},
				{xtype: 'checkbox', hideLabel: true, boxLabel: 'Pooling', name: 'pooling'}
			]
		});

                this.form.getForm().load({
                    url: 'appFlowerStudio/loadDatabaseConnectionSettings',

                    failure: function(form, action) {
                        Ext.Msg.alert("Load failed", 'Error while getting data');
                    }
                });
	},
	
	saveDatabaseSettings: function(){
		var f = this.form.getForm();
		if(f.isValid()){
		    f.submit({
		        failure:function(form,action){
		                if(action.result)
		                {
		                    if(action.result.message)
		                    {
		                        Ext.Msg.alert("Failure", action.result.message, function(){
		                                if(action.result.redirect){
		                                        window.location.href=action.result.redirect;
		                                }
		                        });
		                    }
		                }
		        },
		        success:function(form,action){
		                if(action.result)
		                {
		                    if(action.result.message)
		                    {
		                        Ext.Msg.alert("Success", action.result.message, function(){
		                                if(action.result.redirect){
		                                        window.location.href=action.result.redirect;
		                                }
		                        });
		                    }
		                }
		        }
		    });
		}
	},
	
	cancel: function(){
		this.close();
	}
});