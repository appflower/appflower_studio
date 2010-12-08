Ext.namespace('afStudio.widgetDesigner');

N = afStudio.widgetDesigner;

/**
 * Widget Designer
 * @class afStudio.widgetDesigner
 * @extends Ext.TabPanel
 */
N.DesignerTabPanel = Ext.extend(Ext.TabPanel, {	
	/**
	* path to xml configuration file
	*/
	path: false
	,mask: false
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.widgetDesigner.DesignerTabPanel.superclass.initComponent.apply(this, arguments);
		this._initEvents();
	}	
	
	/**
	 * Initialises component
	 * @return {Object} the component initial literal
	 * @private
	 */
	,_initCmp : function() {
		
		return {
			itemId: 'widget-designer',
//			height: 400,
			activeTab: 0,
			defaults: {
				layout: 'fit'
			},
			items: [
			{
				itemId: 'designer',
				title: 'Widget Designer'
			},{
				itemId: 'security',
				title: 'Security'
			},{
				itemId: 'code-editor',
				title: 'Action Code'
			}]
		}
	}// eo _initCmp
	
	,_initEvents : function() {
		
		var _this = this,
			designerTab = _this.getComponent('designer'),
			securityTab = _this.getComponent('security'),
			codeEditorTab = _this.getComponent('code-editor');

		this.codeEditor = new Ext.ux.CodePress({
			title:'test',
			closable:true,
			path:_this.path,
			tabTip:_this.path,
			tabId: codeEditorTab.getId(),
			file:_this.path
			/*,tabPanel:tabPanel*/
		});
		
		designerTab.on({
			beforerender : function(cmp) {
				cmp.add({
					xtype: 'afStudio.widgetDesigner.designer'
				});
			}
		});

		securityTab.on({
			beforerender : function(cmp) {
				cmp.add({
					html: 'Widget Preview'
				});
			}
		});
		
		codeEditorTab.on({
			beforerender : function(cmp) {
				cmp.add(this.codeEditor);
			}, scope: this
		});	
		
		if(this.mask)
		{
			this.mask.hide.defer(1000,this.mask);
		}
		
		this.on('tabchange', function(panel, tab){
			if('code-editor' == tab.itemId){
				this.codeEditor.showMask();
			}
		}, this);
		
	}// eo _initEvents
	
});

Ext.reg('afStudio.widgetDesigner', N.DesignerTabPanel);

delete N;