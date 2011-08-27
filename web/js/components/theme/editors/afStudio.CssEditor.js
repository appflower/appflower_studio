/**
 * Css Editor
 * @class afStudio.CssEditor
 * @extends Ext.Window
 * @author PavelK
 */
afStudio.CssEditor = Ext.extend(Ext.Window, { 

	/**
	 * Template method
	 * @override
	 * @private
	 */
	initComponent : function() {
		this.createRegions();
		
		var config = {
			title: 'CSS Editor', 
	        layout: 'border',
			width: 813,
			height: 550, 
	        modal: true, 
			closable: true,
	        draggable: true, 
	        resizable: false,
	        bodyBorder: false, 
	        border: false,
	        items: [
	        	this.westPanel,
	        	this.centerPanel
	        ],
			buttonAlign: 'center',
			buttons: [
			{
				text: 'Cancel',
				scope: this,
				handler: this.cancel
			}]
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		
		afStudio.CssEditor.superclass.initComponent.apply(this, arguments);	
	},
	
	/**
	 * Function createRegions
	 * This function creates west and center panels and needful components
	 */
	createRegions : function() {
		
		this.westPanel = new Ext.ux.FileTreePanel({
			title: 'Files',  
			iconCls: 'icon-models',
			split: true,
        	region: 'west',
			url: afStudioWSUrls.getFiletreeUrl,
			loadMask: true,
			width: 220,
			rootText: 'CSS',
			rootPath: 'root/plugins/appFlowerStudioPlugin/web/css',
			newfileText: 'file.css',
			maxFileSize: 524288 * 2 * 10,
			autoScroll: true,
			enableProgress: false,
			singleUpload: true,
			fileCt: this,
			fileOpenSingleClick: true
		});
		
		//Create CodePress element
		this.codeEditor = new Ext.ux.CodePress({
			delayedStart: true
		});
		
		this.centerPanel = new Ext.Panel({
			region: 'center',
			layout: 'fit',  
			items: this.codeEditor,
			tbar: [
			{
				text: 'Save', 
				iconCls: 'icon-save',
				scope: this,
				handler: this.save
			},'->',{
				text: 'Theme', 
				iconCls: 'icon-run-run',
				scope: this,
				handler: this.tdshortcut
			}]
		})
	},
	
	save : function() {
		Ext.Ajax.request({
		   url: afStudioWSUrls.getCssFilesSaveUrl,
		   params: {node: this.westPanel.getSelectionModel().getSelectedNode().text},
		   xmlData: this.codeEditor.getValue(),
		   success: function(result, request) {			   
			   var obj = Ext.decode(result.responseText);
			   afStudio.Msg.info(obj.message);
		   }
		});
	},
	
	/**
	 * Closes active window.
	 */
	cancel : function() {
		this.close();
	},
	
	/**
	* Template Designer shortcut
	*/
	tdshortcut : function() {
		this.close();
		(new afStudio.Theme()).show();
	},
	
	/**
	 * Opens file inside {@link #codeEditor}.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.  
	 * @param {String} name The file name
	 * @param {String} path The file path
	 */
	openFile : function(name, path) {
		var path = 'appFlowerStudioPlugin/css/' + name;
		
		if (path != this.codeEditor.file) {
			this.codeEditor.loadFile('appFlowerStudioPlugin/css/' + name);
		}
	},
	
	/**
	 * Clears {@link #codeEditor} file associated with deleted file(s)/folder.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.
	 * @param {String} path The deleted file/folder path
	 */
	deleteFile : function(path) {
		//just clean the editor, should be implemented more carefull check based on opened file name and deleted path
		this.codeEditor.setCode('');
	}	
});