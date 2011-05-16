/**
 * BaseEditor for all other Editors
 * @author radu
 */
afStudio.BaseEditor = Ext.extend(Ext.Window, { 
	
	/**
	 * needed configs:
	 * this.helper, this.title
	 *
	 * initComponent method
	 * ExtJS template method
	 * @private
	 */
	initComponent: function(){
		this.checkHelperFileExist();
		this.createRegions();
		var config = {
			width: 813,
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
		afStudio.BaseEditor.superclass.initComponent.apply(this, arguments);	
	},
	
	/**
	 * Function createRegions
	 * This function creates west and center panels and needful components
	 */
	createRegions: function(){
		this.codeEditor = new Ext.ux.CodePress({
			delayedStart: false, 
			closable:true,
			file: 'root/apps/frontend/lib/helper/'+this.helper+'Helper.php', 
			language: 'php'
		});
		
		this.centerPanel = new Ext.Panel({
			layout: 'fit', region: 'center', items: [this.codeEditor],
			tbar: [
				{text: 'Save', iconCls: 'icon-save', handler: this.save, scope: this},
				'->',
				{text: 'Template Designer', iconCls: 'icon-run-run', handler: this.tdshortcut, scope: this}
			]
		})
		
	},
	
	save: function(){
		Ext.Ajax.request({
		   url: window.afStudioWSUrls.getHelperFileSaveUrl(),
		   params: {
		   	helper: this.helper
		   },
		   xmlData:this.codeEditor.getValue(),
		   success: function(result,request){
			   var obj = Ext.decode(result.responseText);
			   afStudio.Msg.info(obj.message);
		   }
		});

	},
	
	checkHelperFileExist: function(){
		Ext.Ajax.request({
		   url: window.afStudioWSUrls.getCheckHelperFileExistUrl(),
		   params: {
		   	 helper: this.helper
		   },
		   failure: function ( result, request) {
				var obj = Ext.decode(result.responseText);
				afStudio.Msg.error(result.responseText);
		   }
		});
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
		(new afStudio.TemplateDesigner()).show();
	}
});