afStudio.LoadProject = Ext.extend(Ext.Window, { 
	
	initComponent: function(){
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
			onContextMenu: Ext.emptyFn
		});

		var config = {
			title: 'Load Project', 
			width:348,
			height:400,
			closable: true,
	        draggable: true, 
//	        plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        layout: 'fit',
            items:[
            	this.tree
            ],
	        
			buttons: [
				{text: 'Load', handler: this.load, scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.LoadProject.superclass.initComponent.apply(this, arguments);	
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
	
	load: function()
	{
		var node = this.tree.getSelectionModel().getSelectedNode();	
		if(node)
		{	
			var path = this.tree.getPath(node);
			
			//first check if there is a AF project inside path, and if it is load the selected project in browser
			Ext.Ajax.request({
				url:window.afStudioWSUrls.getProjectLoadTreeUrl(),
				method: 'post',
				params: {
					cmd: 'isPathValid',
					path: path
				},
				callback: function(options, success, response) {				
					response = Ext.decode(response.responseText);
					
					if(response.title&&response.message)
	                {
	                    Ext.Msg.show({
	                    	title: response.title, 
	                    	msg: response.message,
	                    	buttons: Ext.Msg.OKCANCEL,
	                    	modal: true,
	                    	fn: function(buttonId){
	                    		
	                    		if(buttonId=='ok'&&response.project){
	                                window.location.href=response.project.url+'/studio';
	                            }
	                            else{
	                            	this.close();
	                            }
	                    	}
	                    });
	                }
				}
				
			});
		}
		else
		{
			Ext.Msg.alert('','Please select a directory !');	
		}
	}
});