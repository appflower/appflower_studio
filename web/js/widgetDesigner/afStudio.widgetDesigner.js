Ext.namespace('afStudio.widgetDesigner');

N = afStudio.widgetDesigner;

/**
 * Widget Designer
 * @class afStudio.widgetDesigner
 * @extends Ext.TabPanel
 */
N.DesignerTabPanel = Ext.extend(Ext.TabPanel, {
	/**
	* paths
	*/
	actionPath: false
	,securityPath: false
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
			title:'Code editor - actions.class.php',
			closable:true,
			path:_this.actionPath,
			tabTip:_this.actionPath,
			tabId: codeEditorTab.getId(),
			file:_this.actionPath
			/*,tabPanel:tabPanel*/
		});

		this.codeEditorSecurity = new Ext.ux.CodePress({
			title:'Code editor - security.yml',
			closable:true,
			path:_this.securityPath,
			tabTip:_this.securityPath,
			tabId: securityTab.getId(),
			file:_this.securityPath
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
				cmp.add(this.codeEditorSecurity);
			}, scope: this
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

        this.on('beforetabchange', function(tabPanel,newTab,oldTab){
            if(oldTab&&oldTab.iframe){
                 oldTab.toggleIframe();
            }
            if(newTab&&newTab.iframe){
                 newTab.toggleIframe();
            }
		}, this);

	}// eo _initEvents

});

Ext.reg('afStudio.widgetDesigner', N.DesignerTabPanel);

delete N;