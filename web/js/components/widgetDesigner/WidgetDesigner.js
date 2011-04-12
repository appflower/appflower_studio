Ext.namespace('afStudio.wd');

/**
 * Widget Designer
 * @class afStudio.wd.DesignerTabPanel
 * @extends Ext.TabPanel
 */
afStudio.wd.DesignerTabPanel = Ext.extend(Ext.TabPanel, {

	/**
	 * @cfg actionPath
	 * Widget's action path
	 */
	actionPath : false
	
	/**
	 * @cfg securityPath
	 * Widget's security path
	 */
	,securityPath : false
	
	/**
	 * @cfg {String} (required) widgetUri
	 * Unique widget URI
	 */
    
	/**
	 * @cfg {Ext.tree.TreeNode} (required) rootNodeEl
	 * WI tree's root node.
	 */
	
	,mask : false
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {

		var _this = this;
		
		return {
//			id: 'widget-designer-panel',
			itemId: 'widget-designer',
			activeTab: 0,
			items: [
			{
				itemId: 'designer',
				title: 'Widget Designer',
				layout: 'fit'
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
		afStudio.wd.DesignerTabPanel.superclass.initComponent.apply(this, arguments);		
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this,
			designerTab = _this.getComponent('designer');		
					
		this.on({
			render: function(cmp) {
				cmp.addCodeEditorTab('security.yml', _this.securityPath, _this.securityPath, _this.securityPath);
				cmp.addCodeEditorTab('actions.class.php', _this.actionPath, _this.actionPath, _this.actionPath);
			}
		});
		
		designerTab.on({
			scope: this,			
			beforerender: function(cmp) {
				cmp.add({
					xtype: 'afStudio.wd.designer',
                    widgetUri: this.widgetUri,
                    rootNodeEl: this.rootNodeEl,
                    listeners: {
                    	logmessage: function(cmp, message) {
                    		this.fireEvent("logmessage", cmp, message);
                    	},
                    	scope: this
                    }
				});
			}
		});

		if (this.mask) {
			this.mask.hide.defer(1000, this.mask);
		}

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
			frame: true,
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
				frame: true,
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
					items: codePress, 
					layout: 'fit'
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
 * @type 'afStudio.wd.designerTabPanel'
 */
Ext.reg('afStudio.wd.designerTabPanel', afStudio.wd.DesignerTabPanel);