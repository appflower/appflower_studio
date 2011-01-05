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

		var _this = this;
		
		this.codeEditorAction = new Ext.ux.CodePress({
			iconCls:'icon-script-edit',
			title:'actions.class.php',
			closable:true,
			path:_this.actionPath,
			tabTip:_this.actionPath,
			file:_this.actionPath,
			tabPanel:_this
		});

		this.codeEditorSecurity = new Ext.ux.CodePress({
			iconCls:'icon-script-edit',
			title:'security.yml',
			closable:true,
			path:_this.securityPath,
			tabTip:_this.securityPath,
			file:_this.securityPath,
			tabPanel:_this,
			
			bbar: [
				{text: 'bbar'}
			]
		});
		
		return {
			itemId: 'widget-designer',
			activeTab: 0,
			defaults: {layout: 'fit'},
			items: [
				{itemId: 'designer', title: 'Widget Designer'},
				
				{xtype: 'panel', layout: 'fit',
					iconCls:'icon-script-edit',
					title:'security.yml',
					closable:true,
					tbar: [{text: 'Save', iconCls: 'icon-save', handler: function(){alert('Save button pressed')}}],
					items: [
						this.codeEditorSecurity
					]
				},
				
				this.codeEditorAction
			],
			plugins: new Ext.ux.TabMenu()
		}
	}// eo _initCmp

	,_initEvents : function() {

		var _this = this,
			designerTab = _this.getComponent('designer');		

		designerTab.on({
			beforerender : function(cmp) {
				cmp.add({
					xtype: 'afStudio.widgetDesigner.designer',
                    widgetUri: this.widgetUri
				});
			},
            scope: this
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