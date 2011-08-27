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
	 * @cfg {String} filePath
	 */

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
		
		me.codePress = new Ext.ux.CodePress({
			title: this.fileName, 
			path: this.filePath,
			tabTip: this.tabTip, 
			file: this.file,
			closable: true, 
			tabPanel: this,			
			ctCls: 'codeEditorCls'
		});
		
        me.codeBrowserTree = new Ext.ux.FileTreePanel({
			title: 'Code Browser',
			flex: 1,
			url: afStudioWSUrls.getFiletreeUrl,
			fileCt: wd,
			rootText: 'Home',
			maxFileSize: 524288 * 2 * 10,
			autoScroll: true, 
			enableProgress: false, 
			singleUpload: true
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
					items: me.codePress
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
			cp = me.codePress;
		
		afStudio.xhr.executeAction({
			url: cp.fileContentUrl,
	        params: {
    	    	file: cp.file,
        		code: cp.getCode()			          	
        	},
        	scope: me,
			logMessage: String.format('WD file "{0}" [{1}] was saved', cp.title, cp.file)
		});
	}
	//eo onCodeSave
});

/**
 * @type 'wd.codeEditor'
 */
Ext.reg('wd.codeEditor', afStudio.wd.CodeEditor);