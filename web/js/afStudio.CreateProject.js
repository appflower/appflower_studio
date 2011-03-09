afStudio.CreateProject = Ext.extend(Ext.Window, { 
	
	initComponent: function(){
		_self = this;
		
		this.tree = new Ext.ux.FileTreePanel({
			url:window.afStudioWSUrls.getProjectLoadTreeUrl(),
			rootPath:'root',
			rootVisible:true,
			rootText:afStudioHost.user+'@'+afStudioHost.name,
			topMenu:false,
			autoScroll:true,
			enableProgress:false,
			singleUpload:true,			
			onDblClick: Ext.emptyFn,
			onContextMenu: Ext.emptyFn,
			listeners: {
				click: function(n) {
					var path = this.getPath(n);
					var pathDisplayField = _self.form.form.items.items[1];
					var pathField = _self.form.form.items.items[2];
					
					pathDisplayField.setValue('<small>'+path.slice(4)+'</small>');
					pathField.setValue(path.slice(4));
            	}
			},
			height: 200
		});
		
		this.form = new Ext.FormPanel({
			url:window.afStudioWSUrls.getProjectCreateUrl()+'?cmd=save',
		    bodyStyle: 'padding: 5px;', 
		    labelWidth: 140, 
			border: false,
			bodyBorder: false,
			items: [
				{xtype:'textfield', fieldLabel: 'Project name', anchor: '96%', name: 'project_name', allowBlank: false},
				{xtype:'label', html: 'Path to Project:', style: 'font: 12px tahoma,arial,helvetica,sans-serif;'},							
				{xtype:'displayfield', name: 'display_path', hideLabel: true, anchor:'100%', style: 'font-weight:bold;', value: '<small>select path below...</small>'},
				_self.tree,
				{xtype:'hidden', name: 'path'},
				{xtype:'label', html: 'Project Description:', style: 'font: 12px tahoma,arial,helvetica,sans-serif;'},
				{xtype:'textarea', hideLabel: true, anchor: '100%', name: 'description', height: 57, style: 'margin-top: 5px;'},
				{xtype: 'checkbox', hideLabel: true, boxLabel: 'Auto-Deploy on Save', name: 'autodeploy'}
			]
		});

		var config = {
			title: 'Create new project', 
			width:450,
			height:430,
			closable: true,
	        draggable: true, 
	        modal: true, 
	        resizable: false,
	        bodyBorder: false, 
	        border: false,
	        layout: 'fit',
            items:[
            	this.form
            ],
	        
			buttons: [
				{text: 'Create', handler: this.create, scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.CreateProject.superclass.initComponent.apply(this, arguments);	
		this._initEvents();
	},
	
	/**
	 * Function _initEvents
	 * Initialize events
	 */
	_initEvents: function(){
		
	},
	
	/**
	 * Function cancel
	 * Closes window
	 */
	cancel:function(){
		this.close();
	},
	
	create: function()
	{
		var activeForm = this.form.getForm();
		
		if(activeForm.isValid()){
		    activeForm.submit({
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
	}
});