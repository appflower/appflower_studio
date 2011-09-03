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
			rootPath: 'root/web/css',
			newfileText: 'file.css',
			maxFileSize: 524288 * 2 * 10,
			autoScroll: true,
			enableProgress: false,
			fileCt: this,
			fileOpenSingleClick: true
		});
		
		//Ace editor
		this.codeEditor = new Ext.ux.AceComponent();
		
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
	
	/**
	 * Saves file.
	 * @author Nikolai Babinski
	 */
	save : function() {
		var me = this,
			cp = this.codeEditor;
		
		afStudio.xhr.executeAction({
			url: afStudioWSUrls.getFilecontentUrl,
	        params: {
    	    	file: cp.file,
        		code: cp.getCode()			          	
        	},
        	scope: me,
			logMessage: String.format('CssEditor file [{0}] was saved', cp.file)
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
	 * @author Nikolai Babinski
	 */
	openFile : function(name, path) {
		//prevent loading already loaded file
		if (path != this.codeEditor.file) {
			this.codeEditor.loadFile(path);
		}
	},

	/**
	 * Resets {@link #codeEditor} file property.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.  
	 * @param {String} name The new file name
	 * @param {String} newpath The new file path
	 * @param {String} oldpath The old file path
	 * @author Nikolai Babinski
	 */
	renameFile : function(name, newpath, oldpath) {
		var ace = this.codeEditor;
		if (ace.file == oldpath) {
			ace.setFile(newpath);
		}
	},
	
	/**
	 * Clears {@link #codeEditor} file associated with deleted file(s)/folder.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.
	 * @param {String} path The deleted file/folder path
	 * @author Nikolai Babinski
	 */
	deleteFile : function(path) {
		this.codeEditor.setCode('');
	}	
});