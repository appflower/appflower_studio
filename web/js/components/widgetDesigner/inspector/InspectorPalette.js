Ext.namespace('afStudio.wi');

afStudio.wi.InspectorPalette = Ext.extend(Ext.Container, {
	
	/**
	 * @cfg {String} layout (sets to 'accordion') 
	 */
	layout : 'accordion'
	
	/**
	 * @cfg {String} style
	 */
	,style: 'border-top: 1px solid #99BBE8;'
	
	/**
	 * Widget metadata.
	 * @cfg {Object} widgetMeta
	 */
	
	/**
	 * Widget inspector panel.
	 * 
	 * @property inspectorPanel
	 * @type {afStudio.wi.InspectorPanel}
	 */
	
	/**
	 * Code browser tree component.
	 * 
	 * @property codeBrowser
	 * @type {Ext.ux.FileTreePanel}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
   		var _this = this;
		
        this.codeBrowser = new Ext.ux.FileTreePanel({
        	title: 'Code Browser',
			url: afStudioWSUrls.getFiletreeUrl(),
			width: 248,
			height: 500,			
			rootPath: 'root',
			rootVisible: true,
			rootText: 'Home',
			maxFileSize: 524288 * 2 * 10,
			topMenu: false,
			autoScroll: true,
			enableProgress: false,
			singleUpload: true
		});
        
		return {
			itemId: 'inspector',
			items: [
			{
				xtype: 'afStudio.wi.inspectorPanel',				
				ref: 'inspectorPanel',
				widgetMeta: this.widgetMeta
			},
				this.codeBrowser
			]
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
				//TODO: calculate and width to the WidgetInpectorTree and Properties grid
				(function(){	
					var pg = this.inspectorPanel.propertyGrid,
						it = this.inspectorPanel.inspectorTree;

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
	}//eo _afterInitComponent
	
});

/**
 * @type 'afStudio.wi.inspectorPalette'
 */
Ext.reg('afStudio.wi.inspectorPalette', afStudio.wi.InspectorPalette);