Ext.namespace('afStudio.wd');

/**
 * Designer tab panel. 
 * Consists of two parts: {@link afStudio.wd.DesignerPanel} and {@link afStudio.wd.InspectorPalett}.
 * DesignerPanel is a GUI for building widget.
 * InspectorPalett is a palett of instruments dedicated for building/manipulating of widget's properties.
 * 
 * @class afStudio.wd.Designer
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.wd.Designer = Ext.extend(Ext.Panel, {	
	/**
	 * @cfg {String} layout
	 */
	layout : 'border'
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var c = this.controller;
		
		return {
			title: 'Widget Designer',
			defaults: {
				layout: 'fit',
				border: false,
				style: 'padding: 4px;'
			},
			items: [
			{
				region: 'center',
				items: [
				{
					xtype: 'wd.designerPanel',
					controller: c
				}]
			},{
	            region: 'east',
	            width: 350,
	            minWidth: 300,
	            split: true,
	            collapseMode: 'mini',
				items: [
				{
					xtype: 'wd.inspectorPalette',
					controller: c
                }]
			}]
		};
	},
	//eo _beforeInitComponent	
	
	/**
	 * Template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		afStudio.wd.Designer.superclass.initComponent.apply(this, arguments);
	}
});

/**
 * @type 'afStudio.wd.designer'
 */
Ext.reg('wd.designer', afStudio.wd.Designer);