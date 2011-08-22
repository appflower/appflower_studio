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
	layout : 'hbox'
	
	/**
	 * @cfg {Object} layoutConfig
	 */
	,layoutConfig : {
	    align: 'stretch'
	}
	
    ,closable : true
    
	/**
	 * @cfg {String} filePath
	 * 
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
	,_beforeInitComponent : function() {
		var _this = this;
		
		_this.codePress = new Ext.ux.CodePress({
			title: this.fileName, 
			path: this.filePath,
			tabTip: this.tabTip, 
			file: this.file,
			closable: true, 
			tabPanel: this,			
			ctCls: 'codeEditorCls'
		});
		
        _this.codeBrowserTree = new Ext.ux.FileTreePanel({
			title: 'Code Browser',
			flex: 1,
			rootPath: 'root', 
			rootVisible: true, 
			rootText: 'Home',
			url: afStudioWSUrls.getFiletreeUrl(), 
			maxFileSize: 524288 * 2 * 10,
			topMenu: false, 
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
					items: _this.codePress
				}]					
			},
				_this.codeBrowserTree
			]
		};
	}//eo _beforeInitComponent	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wd.CodeEditor.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this,
		    saveBtn = this.getTopToolbar().getComponent('saveBtn');
		    
		saveBtn.on('click', _this.onCodeSaveClick, _this);
		
	}//eo _afterInitComponent
	
	,onCodeSaveClick : function() {
		var _this = this;
		
    	//TODO: add this handler to codeEditor tabs contextMenu "Save" item
    	Ext.Ajax.request({
        	url: _this.codePress.fileContentUrl,
	        params: {
    	    	'file': _this.codePress.file,
        		'code': _this.codePress.getCode()			          	
        	},
        	success: function(response, options) {			
        		_this.fireEvent("logmessage", _this, "Widget Designer code Saved");
        		afStudio.Msg.info(String.format("File <u>{0}</u> was successfully saved.", _this.codePress.title));			            
        	},
		    failure: function (xhr, request) {
			   var message = String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText);
			   afStudio.Msg.error('Server side error', message);
		    }
        });	    	
	}//eo onCodeSaveClick
	
});

/**
 * @type 'wd.codeEditor'
 */
Ext.reg('wd.codeEditor', afStudio.wd.CodeEditor);