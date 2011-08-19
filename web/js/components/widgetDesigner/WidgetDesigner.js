Ext.namespace('afStudio.wd');

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
			TODO Should be improved 
			plugins: new Ext.ux.TabMenu()
			*/
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
		afStudio.wd.WidgetDesigner.superclass.initComponent.apply(this, arguments);		
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;		
		
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
	 * Adds {@link afStudio.wd.CodeEditorTab} code editor tab.
	 * 
	 * @param {String} fileName The file Name
	 * @param {String} path The file Path
	 * @param {String} tabTip The tab panel tooltip string
	 * @param {String} file  The file
	 */
	,addCodeEditorTab : function(fileName, path, tabTip, file) {
		var t = this.add({
			xtype: 'wd.codeEditorTab',
			fileName: fileName,
			filePath: path,
			tabTip: tabTip,
			file: file
		});
		
		this.setActiveTab(t.getId());
	}//eo addCodeEditorTab
});

/**
 * @type 'widgetdesigner'
 */
Ext.reg('widgetdesigner', afStudio.wd.WidgetDesigner);