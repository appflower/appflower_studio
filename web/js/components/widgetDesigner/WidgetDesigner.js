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
	 * WD controller
	 * @cfg {ViewController} (required) controller
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
			activeTab: 0,
			enableTabScroll: true,
			items: [
			{
				xtype: 'wd.designer',
				controller: c
			},{
				xtype: 'wd.codeEditor',
				fileName: 'security.yml',
				tabTip: w.securityPath,
				file: w.securityPath
			},{
				xtype: 'wd.codeEditor',
				fileName: w.actionName,
				tabTip: w.actionPath,
				file: w.actionPath				
			}]
			/*
			TODO tabs context menu must be added and improved. Ext.ux.TabMenu is useless and should be removed 
			plugins: new Ext.ux.TabMenu()
			*/
		};
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
	},
	
	/**
	 * Adds {@link afStudio.wd.CodeEditorTab} code editor tab.
	 * @param {String} fileName The file Name
	 * @param {String} path The file Path
	 */
	addCodeEditorTab : function(fileName, path) {
		var t = this.add({
			xtype: 'wd.codeEditor',
			fileName: fileName,
			tabTip: path,
			file: path
		});
		
		this.setActiveTab(t.getId());
	},
	
	/**
	 * Searches code tabs relative/equal to path.
	 * @private
	 * @param {String} path The path to search by
	 * @return {Array} code tabs
	 */
	findCodeTabs : function(path, equal) {
		var codeTabs = this.findByType('wd.codeEditor', true),
			tabs = [];
			
		Ext.each(codeTabs, function(c){
			var f = c.file;
			if (f && (equal ? f == path : f.indexOf(path) === 0)) {
				tabs.push(c);
			}
		});
		
		return tabs;
	},
	
	/**
	 * Opens file inside WD.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.  
	 * @param {String} name The file name
	 * @param {String} path The file path
	 */
	openFile : function(name, path) {
		var opened = this.findCodeTabs(path, true);
		
		if (opened.length > 0) {
			opened[0].show();
		} else {
			this.addCodeEditorTab(name, path);
		}
	},
	
	/**
	 * Corrects file paths.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.  
	 * @param {String} name The new file name
	 * @param {String} newpath The new file path
	 * @param {String} oldpath The old file path
	 */
	renameFile : function(name, newpath, oldpath) {
		var openedTabs = this.findCodeTabs(oldpath);
		
		Ext.each(openedTabs, function(t){
			t.setFile(name, newpath, oldpath);
		}, this);
	},
	
	/**
	 * Removes opened tabs associated with deleted file/folder.
	 * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.
	 * @param {String} path The deleted file/folder path
	 */
	deleteFile : function(path) {
		var openedTabs = this.findCodeTabs(path);
		
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