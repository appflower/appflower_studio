afStudio.LoadProject = Ext.extend(Ext.Window, { 
	form: null,
	initComponent: function(){
		this.codeBrowserTree = new Ext.ux.FileTreePanel({
			url:window.afStudioWSUrls.getProjectLoadTreeUrl(),
			id:'ftp',
			rootPath:'root',
			rootVisible:true,
			rootText:'Home',
			maxFileSize:524288*2*10,
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
            	this.codeBrowserTree
            ],
	        
			buttons: [
				{text: 'Load', handler: this.cancel, scope: this},
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
		/***
		this.on('show', function(cmp){
			Ext.get('help-iframe').on('load', function(){
				cmp.body.unmask()
			});
		 	(function(){
				 	cmp.body.mask('Loading, please Wait...', 'x-mask-loading');
				 	
		 	}).defer(100);
		})
		**/ 
	},
	
	/**
	 * Function cancel
	 * Closes window
	 */
	cancel:function(){
		this.close();
	}
});