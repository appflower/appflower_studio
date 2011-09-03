Ext.namespace('afStudio.wd');

/**
 * @class afStudio.wd.CodeEditor
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.wd.CodeEditor = Ext.extend(Ext.Panel, {	
	/**
	 * @cfg {String} layout
	 */
	layout : 'hbox',
	
	/**
	 * @cfg {Object} layoutConfig
	 */
	layoutConfig : {
	    align: 'stretch'
	},
	
    closable : true,

    /**
     * @cfg {String} fileName
     */
    
    /**
     * @cfg {String} tabTip 
     */
    
    /**
     * @cfg {String} file
     */    
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var me = this,
			wd = this.findParentByType('widgetdesigner');
		
		me.ace = new afStudio.wd.Editor({
			file: this.file
		});
		
        me.codeBrowserTree = new Ext.ux.FileTreePanel({
			title: 'Code Browser',
			flex: 1,
			url: afStudioWSUrls.getFiletreeUrl,
			fileCt: wd,
			rootText: 'Home',
			maxFileSize: 524288 * 2 * 10,
			autoScroll: true, 
			enableProgress: false 
		});
		
		return {
			title: this.fileName,
			iconCls: 'icon-script-edit',
			defaults: {
				style: 'padding: 5px;'
			},
			tbar: [
			{
				text: 'Save',
				itemId: 'saveBtn',
				iconCls: 'icon-save'
			}],
			items: [
			{
				title: 'Code Editor',
				flex: 3,
				layout: 'fit',
				items: [
				{
					border: false,
					layout: 'fit',
					items: me.ace
				}]					
			},
				me.codeBrowserTree
			]
		};
	},
	//eo _beforeInitComponent	
	
	/**
	 * Template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wd.CodeEditor.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	},
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	_afterInitComponent : function() {
		var me = this,
		    saveBtn = this.getTopToolbar().getComponent('saveBtn');
		    
		saveBtn.on('click', me.onCodeSave, me);
		
	},
	
    //TODO: add this handler to codeEditor tabs contextMenu "Save" item
	/**
	 * Saves code.
	 */
	onCodeSave : function() {
		var me = this,
			cp = me.ace;
		
		afStudio.xhr.executeAction({
			url: afStudioWSUrls.getFilecontentUrl,
	        params: {
    	    	file: cp.getFile(),
        		code: cp.getCode()		          	
        	},
        	scope: me,
			logMessage: String.format('WD file "{0}" [{1}] was saved', this.fileName, this.file)
		});
	},
	//eo onCodeSave
	
	/**
	 * Sets {@link #file} property + undercover ace editor file property and title if needed.
	 * @param {String} name
	 * @param {String} newpath
	 * @param {String} oldpath
	 */
	setFile : function(name, newpath, oldpath) {
		if (oldpath == this.file) {
			this.setTitle(name);
			this.fileName = name;
			this.file = newpath;
			this.ace.setFile(this.file, true);
		} else {
			this.file = this.file.replace(oldpath, newpath);
			this.ace.setFile(this.file);
		}
	}
});

/**
 * @type 'wd.codeEditor'
 */
Ext.reg('wd.codeEditor', afStudio.wd.CodeEditor);