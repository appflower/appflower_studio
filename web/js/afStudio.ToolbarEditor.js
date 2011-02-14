/**
 * Css Editor
 * Widget Designer
 * @class afStudio.CssEditor
 * @extends Ext.TabPanel
 * @author milos
 */
afStudio.ToolbarEditor = Ext.extend(Ext.Window, { 

	/**
	 * initComponent method
	 * ExtJS template method
	 * @private
	 */
	initComponent: function(){
		this.createRegions();
		var config = {
			title: 'Toolbar Editor', width: 813,
			height: 550, closable: true,
	        draggable: true, 
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        layout: 'border',
	        items: [
	        	this.centerPanel
	        ],
			buttons: [
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.ToolbarEditor.superclass.initComponent.apply(this, arguments);	
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
			delayedStart: false, 
			closable:true,
			file: 'root/apps/frontend/lib/helper/ImmExtjsToolbarHelper.php', 
			language: 'php'
		});
		
		this.centerPanel = new Ext.Panel({
			layout: 'fit', region: 'center', items: [this.codeEditor],
			tbar: [
				{text: 'Save', iconCls: 'icon-save', handler: this.save, scope: this}
			]
		})
		
	},
	
	save: function(){
		Ext.Ajax.request({
		   url: window.afStudioWSUrls.getToolbarHelperFileSaveUrl(),
//		   params: { node: this.westPanel.getSelectionModel().getSelectedNode().text},
		   xmlData:this.codeEditor.getValue(),
		   success: function(result,request){
//			   alert(result.responseText);
			   var obj = Ext.decode(result.responseText);
			   Ext.Msg.alert("Information",obj.message);
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
	}
});