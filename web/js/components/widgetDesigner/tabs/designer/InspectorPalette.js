/**
 * InspectorPalette is the palette of instruments dedicated for browsing/building/manipulating of widget's data. 
 * 
 * @class afStudio.wi.InspectorPalette
 * @extends Ext.Container
 * @author Nikolai Babinski
 */
afStudio.wd.InspectorPalette = Ext.extend(Ext.Container, {
	/**
	 * @cfg {String} layout (sets to 'accordion') 
	 */
	layout : 'accordion',
	
	/**
	 * @cfg {String} style
	 */
	style : 'border-top: 1px solid #99BBE8;',
	
	/**
	 * Inspector tree container component.
	 * @property itCt
	 * @type {Ext.Panel}
	 */
	/**
	 * Property grid container component.
	 * @property pgCt
	 * @type {Ext.Panel}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
   		var c = this.controller,
   			tr = c.getView('inspectorTree'),
   			pg = c.getView('propertyGrid');
   			
		return {
			items: [
			{
	            title: 'Widget Inspector',
				layout: 'border',
				defaults: {
					layout: 'fit',
					border: false
				},
				items: [
				{
					region: 'center',
					ref: '../itCt',
					items: tr
				},{
					region: 'south',
					ref: '../pgCt',
					split: true,
                    collapseMode: 'mini',					
			        items: pg
				}]
			}]
		};
	},
	//eo _beforeInitComponent	
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.wd.InspectorPalette.superclass.initComponent.apply(this, arguments);
		
		this._afterInitComponent();
	},
		
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	_afterInitComponent : function() {
		this.on({
			scope: this,
			
			afterrender: function() {
				(function(){
					h = this.pgCt.ownerCt.getInnerHeight() / 2;
					this.pgCt.setHeight(h);	 
					this.pgCt.ownerCt.doLayout();	 
				}).defer(100, this);
			}
		});
	}
});

/**
 * @type 'wd.inspectorPalette'
 */
Ext.reg('wd.inspectorPalette', afStudio.wd.InspectorPalette);