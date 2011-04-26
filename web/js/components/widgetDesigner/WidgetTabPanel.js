Ext.namespace('afStudio.wd');

/**
 * WidgetTabPanel
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
			},{
				xtype: 'afStudio.wd.codeEditorTab',
				fileName: 'security.yml',
				filePath: this.widgetMeta.securityPath,
				tabTip: this.widgetMeta.securityPath,
				file: this.widgetMeta.securityPath
			},{
				xtype: 'afStudio.wd.codeEditorTab',
				fileName: 'actions.class.php',
				filePath: this.widgetMeta.actionPath,
				tabTip: this.widgetMeta.actionPath,
				file: this.widgetMeta.actionPath				
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
			xtype: 'afStudio.wd.codeEditorTab',
			fileName: fileName,
			filePath: path,
			tabTip: tabTip,
			file: file
		});
		
		this.setActiveTab(t.getId());
	}//eo addCodeEditorTab
});

/**
 * @type 'afStudio.wd.widgetTabPanel'
 */
Ext.reg('afStudio.wd.widgetTabPanel', afStudio.wd.WidgetTabPanel);