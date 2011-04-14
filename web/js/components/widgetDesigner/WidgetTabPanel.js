Ext.namespace('afStudio.wd');

/**
 * 
 * @class afStudio.wd.WidgetTabPanel
 * @extends Ext.TabPanel
 */
afStudio.wd.WidgetTabPanel = Ext.extend(Ext.TabPanel, {

	/**
	 * Widget meta data.
	 * @cfg {Object} widgetMeta
	 */
	
	/**
	 * Reference to the this tabs panel container - widget panel
	 * @property widgetPanel
	 * @type {afStudio.wd.WidgetPanel}
	 */ 
	 
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var _this = this;
		
		this.widgetPanel = this.ownerCt;
		
		return {
			itemId: 'widget-designer',
			border: false,			
			activeTab: 0,
			items: [
			{
				xtype: 'afStudio.wd.designerTab',				
				widgetMeta: this.widgetMeta
			}],
			plugins: new Ext.ux.TabMenu()
		}
	}//eo _beforeInitComponent
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		afStudio.wd.WidgetTabPanel.superclass.initComponent.apply(this, arguments);		
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;		

//		cmp.addCodeEditorTab('security.yml', _this.securityPath, _this.securityPath, _this.securityPath);
//		cmp.addCodeEditorTab('actions.class.php', _this.actionPath, _this.actionPath, _this.actionPath);		
		
        this.on('beforetabchange', function(tabPanel, newTab, oldTab) {        	
            if (oldTab && oldTab.iframe) {
                 oldTab.toggleIframe();
            }
            if (newTab && newTab.iframe) {
                 newTab.toggleIframe();
            }
		}, this);
	}//eo _afterInitComponent
	
	/**
	 * Function addCodeEditorTab
	 * @param {String} fileName - File Name
	 * @param {String} path - File Path
	 * @param {String} tabTip - Tab panel tooltip string
	 * @param {String} file - File
	 */
	,addCodeEditorTab : function(fileName, path, tabTip, file) {
		var codePress = new Ext.ux.CodePress({
			title: fileName, 
			path: path,
			tabTip: tabTip, 
			file: file,
			closable: true, 
			tabPanel: this,			
			ctCls: 'codeEditorCls'
		});
		
        var codeBrowserTree = new Ext.ux.FileTreePanel({
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
				
		var panel = new Ext.Panel({
			title: fileName,
			iconCls: 'icon-script-edit',
			layout: 'hbox',
            layoutConfig: {
            	align: 'stretch'
            },
            closable: true,
            //custom cfg property
			filePath: path,
			tbar: [
			{
				text: 'Save', 
				iconCls: 'icon-save', 
				handler: onSaveBtnClick,
				scope: this
			}],
			defaults : {
				style: 'padding: 5px;'
			},
			items: [
			{
				xtype: 'panel',
				title: 'Code Editor',
				flex: 3,
				layout: 'fit',
				items: [
				{
					xtype: 'panel',
					border: false,
					layout: 'fit',
					items: codePress 
					
				}]
			}, 
				codeBrowserTree
			]
		});
		
		function onSaveBtnClick() {
			var self = this;
	    	//TODO: move to public function and it as ContextMenu "Save" item handler in Ext.ux.TabMenu
	    	Ext.Ajax.request({
	        	url: codePress.fileContentUrl, 
		        method: 'post',
		        params: {
	    	    	'file': codePress.file,
	        		'code': codePress.getCode()			          	
	        	},
	        	success:function(response, options){			
	        		self.fireEvent("logmessage",self,"Widget Designer code Saved");
	        		Ext.Msg.alert("Success","The file was saved !");			            
	        	},
	        	failure: function() {
					Ext.Msg.alert("Failure","The server can't save the file !");
				}
	        });	    	
		}
		
		this.add(panel);
	}//eo addCodeEditorTab
});

/**
 * @type 'afStudio.wd.widgetTabPanel'
 */
Ext.reg('afStudio.wd.widgetTabPanel', afStudio.wd.WidgetTabPanel);