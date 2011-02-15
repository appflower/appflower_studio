/**
 * Css Editor
 * Widget Designer
 * @class afStudio.CssEditor
 * @extends Ext.TabPanel
 * @author milos_silni
 */
afStudio.ToolbarEditor = Ext.extend(Ext.Window, { 

	/**
	 * initComponent method
	 * ExtJS template method
	 * @private
	 */
	initComponent: function(){
		this.checkToolbarHelperFileExist();
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
		   xmlData:this.codeEditor.getValue(),
		   success: function(result,request){
			   var obj = Ext.decode(result.responseText);
			   Ext.Msg.alert("Information",obj.message);
		   }
		});

	},
	
	checkToolbarHelperFileExist: function(){
		Ext.Ajax.request({
		   url: window.afStudioWSUrls.buildUrlFor('/appFlowerStudio/checkToolbarHelperFileExist'),
		   failure: function ( result, request) {
				var obj = Ext.decode(result.responseText);
				Ext.MessageBox.alert('Failed', result.responseText); 
		   }
		});

	},
	
	/**
	 * Function cancel
	 * Close active wimdow
	 */
	cancel: function(){
		this.close();
	}
});