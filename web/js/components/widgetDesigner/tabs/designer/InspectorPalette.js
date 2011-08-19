Ext.namespace('afStudio.wi');

/**
 * InspectorPalette is the palette of instruments dedicated for browsing/building/manipulating of
 * widget's metadata/properties and handling its appearance. 
 * 
 * @class afStudio.wi.InspectorPalette
 * @extends Ext.Container
 * @author Nikolai
 */
afStudio.wi.InspectorPalette = Ext.extend(Ext.Container, {
	
	/**
	 * @cfg {String} layout (sets to 'accordion') 
	 */
	layout : 'accordion',
	
	/**
	 * @cfg {String} style
	 */
	style: 'border-top: 1px solid #99BBE8;',
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
   		var self = this,
   			c = this.controller,
   			tr = c.getView('inspectorTree'),
   			pg = c.getView('propertyGrid');
   			
        
		return {
			items: [
			{
				layout: 'border',
				
	            title: 'Widget Inspector',
				items: [
				{
					region: 'center',
					items: tr
				},{
					region: 'south',
					split: true,			
					height: 150,				        
			        layout: 'fit',
			        items: pg
				}]
			},{
				xtype: 'filetreepanel',
				ref: 'codeBrowser',
	        	title: 'Code Browser',
				url: afStudioWSUrls.getFiletreeUrl(),
				rootText: 'Home',
				rootPath: 'root',
				rootVisible: true,				
				maxFileSize: 524288 * 2 * 10,
				autoScroll: true,
				enableProgress: false,
				singleUpload: true				
			}]
		};
	}//eo _beforeInitComponent	
	
	/**
	 * initComponent method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		afStudio.wi.InspectorPalette.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
		
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this;
		
		this.on({
			scope: this,
			afterrender: function() {
				//TODO: review and rewrite 
				(function(){
					var pg = this.controller.getView('propertyGrid'),
						it = this.controller.getView('inspectorTree');

					var h1 = pg.getHeight(),
						h2 = it.getHeight(),			
						 h = (h1 + h2) / 2;
					
					pg.setHeight(h);
					it.setHeight(h);
					
					//Hot fix
					this.layout.setActiveItem(1);
					this.layout.setActiveItem(0);
				}).defer(100, this);
			}
		});
	}
	
});

/**
 * @type 'wi.inspectorPalette'
 */
Ext.reg('wi.inspectorPalette', afStudio.wi.InspectorPalette);