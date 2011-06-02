/**
 * Css Editor
 * Widget Designer
 * @class afStudio.CssEditor
 * @extends Ext.TabPanel
 * @author PavelK
 */
afStudio.CssEditor = Ext.extend(Ext.Window, { 

	/**
	 * initComponent method
	 * ExtJS template method
	 * @private
	 */
	initComponent: function(){
		this.createRegions();
		var config = {
			title: 'CSS Editor', width: 813,
			height: 550, closable: true,
	        draggable: true, 
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        layout: 'border',
	        items: [
	        	this.westPanel,
	        	this.centerPanel
	        ],
			buttons: [
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.CssEditor.superclass.initComponent.apply(this, arguments);	
	},
	
	/**
	 * Function createRegions
	 * This function creates west and center panels and needful components
	 */
	createRegions: function(){
		//Create TreeLoader component
		this.loader = new Ext.tree.TreeLoader({
			 dataUrl: window.afStudioWSUrls.getCssFilestreeUrl()
		});
		
		this.westPanel = new Ext.ux.FileTreePanel({
			split: true, title: 'Files',  iconCls: 'icon-models',
        	region: 'west',
			url:window.afStudioWSUrls.getFiletreeUrl()
			,width: 220
			,rootPath:'root/plugins/appFlowerStudioPlugin/web/css'
			,path:'pluigns'
			,rootVisible:true
			,rootText:'CSS'
			,newfileText:'file.css'
			,maxFileSize:524288*2*10
			,topMenu:false
			,autoScroll:true
			,enableProgress:false
			,singleUpload:true
			,listeners: {
				click: function(node, e){
					if(node.leaf){
						this.codeEditor.loadFile('appFlowerStudioPlugin/css/' + node.text);
					}
				}, scope: this
			}
		});

		// setup loading mask if configured
		this.loader.on({
			 beforeload:function (loader, node, clb){
			 	(function(){
				 	node.getOwnerTree().body.mask('Loading, please Wait...', 'x-mask-loading');
			 	}).defer(100);
			 }
			,load:function (loader, node, resp){
				node.getOwnerTree().body.unmask();
			}
			,loadexception:function(loader, node, resp){
				node.getOwnerTree().body.unmask();
			}
		});
		
		//Create CodePress element
		this.codeEditor = new Ext.ux.CodePress({
			delayedStart: true, closable:true,
			
			//TODO: check this
			title:'Code editor - actions.class.php',
			path: 'appFlowerStudioPlugin/desktop.html',
			tabTip: 'appFlowerStudioPlugin/desktop.html',
			file: 'appFlowerStudioPlugin/desktop.html'
		});
		
		this.centerPanel = new Ext.Panel({
			layout: 'fit', region: 'center', items: [this.codeEditor],
			tbar: [
				{text: 'Save', iconCls: 'icon-save', handler: this.save, scope: this},
				'->',
				{text: 'Theme', iconCls: 'icon-run-run', handler: this.tdshortcut, scope: this}
			]
		})
	},
	
	save: function(){
		Ext.Ajax.request({
		   url: window.afStudioWSUrls.getCssFilesSaveUrl(),
		   params: { node: this.westPanel.getSelectionModel().getSelectedNode().text},
		   xmlData:this.codeEditor.getValue(),
		   success: function(result,request){			   
			   var obj = Ext.decode(result.responseText);
			   afStudio.Msg.info(obj.message);
		   }
		});

		//alert(this.codeEditor.getCode());
	},
	
	/**
	 * Function cancel
	 * Close active wimdow
	 */
	cancel: function(){
		this.close();
	},
	
	/**
	* Template Designer shortcut
	*/
	tdshortcut: function(){
		this.close();
		(new afStudio.Theme()).show();
	}
});