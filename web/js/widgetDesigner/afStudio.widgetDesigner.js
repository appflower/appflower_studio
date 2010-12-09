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
		var _this = this;
		
		return {
			itemId: 'widget-designer',
			enableTabScroll:true,
//			height: 400,
			activeTab: 0,
			defaults: {
				layout: 'fit',
				autoScroll: true
			},
			plugins: new Ext.ux.TabMenu(),
			items: [
			{
				itemId: 'designer',
				title: 'Widget Designer'
			},{
				itemId: 'security',
				title: 'Security'
			},new Ext.ux.CodePress({
				title: 'Action Code',
				closable:true,
				path:_this.path,
				tabTip:_this.path,
				file:_this.path,
				tabPanel:_this
			})]
		}
	}// eo _initCmp
	
	,_initEvents : function() {
		
		var _this = this,
			designerTab = _this.getComponent('designer'),
			securityTab = _this.getComponent('security');

		/**
		* load inital Action Code
		*
		* @author radu
		*/
		this.codeEditor = 
		
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