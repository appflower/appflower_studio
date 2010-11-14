Ext.namespace('afStudio.widgetDesigner');

N = afStudio.widgetDesigner;

/**
 * Widget Designer
 * @class afStudio.widgetDesigner
 * @extends Ext.TabPanel
 */
N.DesignerTabPanel = Ext.extend(Ext.TabPanel, {	
	/**
	 * ExtJS template method
	 * @private
	 */
	initComponent : function() {
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
			height: 400,
			activeTab: 0,
			defaults: {
				layout: 'fit'
			},
			items: [
			{
				itemId: 'designer',
				title: 'Widget Designer'
			},{
				itemId: 'preview',
				title: 'Preview'
			},{
				itemId: 'code-editor',
				title: 'Code Editor'
			}]
		}
	}// eo _initCmp
	
	,_initEvents : function() {
		var _this = this,
			designerTab = _this.getComponent('designer'),
			previewTab = _this.getComponent('preview'),
			codeEditorTab = _this.getComponent('code-editor');
		
		designerTab.on({
			beforerender : function(cmp) {
				cmp.add({
					xtype: 'afStudio.widgetDesigner.designer'
				});
			}
		});

		previewTab.on({
			beforerender : function(cmp) {
				cmp.add({
					html: 'Widget Preview'
				});
			}
		});
		
		codeEditorTab.on({
			beforerender : function(cmp) {
				cmp.add({					
					xtype: 'textarea',
					autoScroll: true					
				});
			}
		});	
				
	}// eo _initEvents
	
});

Ext.reg('afStudio.widgetDesigner', N.DesignerTabPanel);

delete N;