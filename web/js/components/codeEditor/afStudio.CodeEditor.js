/**
 * Code Editor
 * @class afStudio.CodeEditor
 * @extends Ext.Window
 * @author Radu Topala <radu@appflower.com>
 */
afStudio.CodeEditor = Ext.extend(Ext.Window, { 

	/**
	 * Template method.
	 * @override
	 * @private
	 */
	initComponent : function() {
		this.createRegions();
		
		var config = {
			title: 'Code Browser', 
	        layout: 'border',
	        width: '100%',
			height: Ext.getBody().getViewSize().height - 25, 
			y:25,
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
		
		afStudio.CodeEditor.superclass.initComponent.apply(this, arguments);
		
		Ext.EventManager.on(window, 'resize', this.updateCodeBrowserHeight, this);
	},
	
	/**
	 * Updates CodeEditor's height based on the window's height.
	 * @protected
	 */
	updateCodeBrowserHeight : function() {
		this.setHeight(Ext.getBody().getViewSize().height - 25);
	},
	
	/**
	 * Template method.
	 * @private
	 * @override
	 */
	onDestroy : function() {
		Ext.EventManager.un(window, 'resize', this.updateCodeBrowserHeight, this);
		
		afStudio.CodeEditor.superclass.onDestroy.call(this);		
	},
	
	/**
	 * Function createRegions
	 * This function creates west and center panels and needful components
	 * @private
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
			rootText: 'Project',
			rootPath: 'root',
			newfileText: 'newFile.php',
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
			logMessage: String.format('CodeEditor file [{0}] was saved', cp.file)
		});
	},
	
	/**
	 * Closes active window.
	 */
	cancel : function() {
		this.close();
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