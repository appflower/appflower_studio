Ext.namespace('afStudio.wd');

/**
 * Designer tab panel
 * 
 * @class afStudio.wd.DesignerTab
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.wd.DesignerTab = Ext.extend(Ext.Panel, {	
	/**
	 * @cfg {String} layout
	 */
	layout : 'hbox'
	
	/**
	 * @cfg {Object} layoutConfig
	 */
	,layoutConfig : {
	    align: 'stretch',
	    pack: 'start'
	}
	
	/**
	 * Widget meta data object:
	 * <u>
	 *   <li><b>actionPath</b>: Path to widget's action controller.</li>
	 *   <li><b>securityPath</b>: Path to widget's security config.</li>
	 *   <li><b>widgetUri</b>: Widget URI</li>
	 *   <li><b>definition</b>: Widget's metadata definition.</li>
	 * </ul>
	 * @cfg {Object} widgetMeta
	 */	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {

		return {
			title: 'Widget Designer',
			defaults: {
				layout: 'fit',
				style: 'padding: 2px;'
			},
			items: [
			{
				xtype: 'afStudio.wd.designerPanel',
				widgetMeta: this.widgetMeta,
				flex: 3								
			},{ 
				xtype: 'container',
				flex: 1,				
				items: [
				{
					xtype: 'afStudio.wi.inspectorPalette',
					widgetMeta: this.widgetMeta
                }]
			}]
		};
	}//eo _beforeInitComponent	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wd.DesignerTab.superclass.initComponent.apply(this, arguments);
	}//eo initComponent	
			
	,preview : function() {
		afApp.widgetPopup(this.widgetUri, this.rootNode.text, null, "iconCls:\'" + "\',width:800,height:600,maximizable: false", afStudio);
	}//eo preview
	
	,saveDesigner: function() {
	}	
	
});

/**
 * @type 'afStudio.wd.designerTab'
 */
Ext.reg('afStudio.wd.designerTab', afStudio.wd.DesignerTab);