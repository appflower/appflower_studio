Ext.namespace('afStudio.wd');

/**
 * Designer tab panel. 
 * Contains from two parts: {@link afStudio.wd.DesignerPanel} and {@link afStudio.wi.InspectorPalett}.
 * DesignerPanel is a GUI for building widget.
 * InspectorPalett is a palett of instruments dedicated for building/manipulating of widget's properties.
 * 
 * @class afStudio.wd.Designer
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.wd.Designer = Ext.extend(Ext.Panel, {	
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
				style: 'padding: 2px;'
			},
			items: [
			{
				xtype: 'wd.designerPanel',
				controller: c,
				flex: 3
			},{
				xtype: 'container',
				flex: 1,
				items: [
				{
					xtype: 'wi.inspectorPalette',
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