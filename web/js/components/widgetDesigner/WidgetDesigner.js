Ext.namespace('afStudio.wd');

/**
 * Widget Designer main tab panel container. 
 * 
 * @class afStudio.wd.WidgetDesigner
 * @extends Ext.TabPanel
 * @author Nikolai Babinski
 */
afStudio.wd.WidgetDesigner = Ext.extend(Ext.TabPanel, {

	/**
	 * Required. WD controller
	 * @cfg {ViewController} controller
	 */	
	 
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var c = this.controller,
			w = c.getWidget();
		
		return {
			border: false,			
			activeTab: 0,
			enableTabScroll : true,
			items: [
			{
				xtype: 'wd.designer',
				controller: c
			},{
				xtype: 'wd.codeEditor',
				fileName: 'security.yml',
				filePath: w.securityPath,
				tabTip: w.securityPath,
				file: w.securityPath
			},{
				xtype: 'wd.codeEditor',
				fileName: w.actionName,
				filePath: w.actionPath,
				tabTip: w.actionPath,
				file: w.actionPath				
			}]
			/*
			TODO tabs context menu must be added and improved. Ext.ux.TabMenu is useless and should be removed 
			plugins: new Ext.ux.TabMenu()
			*/
		}
	},
	//eo _beforeInitComponent
	
	/**
	 * Base template method.
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		afStudio.wd.WidgetDesigner.superclass.initComponent.apply(this, arguments);		
		this._afterInitComponent();
	},
	
	//TODO This method should be removed after resolving all issues with code-editor.
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	_afterInitComponent : function() {
		var _this = this;		
		
        this.on('beforetabchange', function(tabPanel, newTab, oldTab) {        	
            if (oldTab && oldTab.iframe) {
                 oldTab.toggleIframe();
            }
            if (newTab && newTab.iframe) {
                 newTab.toggleIframe();
            }
		}, this);
	},
	//eo _afterInitComponent
	
	/**
	 * Adds {@link afStudio.wd.CodeEditorTab} code editor tab.
	 * @param {String} fileName The file Name
	 * @param {String} path The file Path
	 */
	addCodeEditorTab : function(fileName, path) {
		var t = this.add({
			xtype: 'wd.codeEditor',
			fileName: fileName,
			filePath: path,
			tabTip: path,
			file: path
		});
		
		this.setActiveTab(t.getId());
	},
	
	/**
	 * Opens file inside WD.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.  
	 * @param {String} name The file name
	 * @param {String} path The file path
	 */
	openFile : function(name, path) {
		//find if the current path is opened
		var opened = this.find('filePath', path);
		
		if (opened.length > 0) {
			opened[0].show();
		} else {
			this.addCodeEditorTab(name, path);
		}
	},
	
	/**
	 * Removes opened tabs associated with deleted file/folder.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.
	 * @param {String} path The deleted file/folder path
	 */
	deleteFile : function(path) {
		var openedTabs = this.findBy(function(c){
            return c['filePath'] && c['filePath'].indexOf(path) === 0;
        });
		
		Ext.each(openedTabs, function(t){
			this.remove(t);
		}, this);
	},
	
	/**
	 * Release widget designer resources.
	 * @private
	 */
    beforeDestroy : function() {
        Ext.destroy(this.controller);
        afStudio.wd.WidgetDesigner.superclass.beforeDestroy.apply(this);
    }
	
});

/**
 * @type 'widgetdesigner'
 */
Ext.reg('widgetdesigner', afStudio.wd.WidgetDesigner);