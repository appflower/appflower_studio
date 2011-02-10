Ext.namespace('afStudio.layoutDesigner.view');

afStudio.layoutDesigner.view.NormalView = Ext.extend(Ext.ux.Portal, {
	
	/**
	 * @cfg {Number} viewLayout (defaults to 1)
	 * View's layout
	 */
	viewLayout : 1
	
	/**
	 * @property {Object} viewLayoutConfig
	 */
	,viewLayoutConfig : {
		1 : [1],
		2 : [0.5, 0.5],
		3 : [0.25, 0.75],
		4 : [0.75, 0.25],
		5 : [0.33, 0.33,0.33],
		6 : [0.5, 0.25, 0.25],
		7 : [0.25, 0.5, 0.25],
		8 : [0.25, 0.25, 0.25, 0.25],
		9 : [0.4, 0.2, 0.2, 0.2]
	}
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		_this.viewLayout = Ext.isDefined(_this.viewLayout) 
			? _this.viewLayout 
			: afStudio.layoutDesigner.view.NormalView.prototype.viewLayout;
		
		var viewItems = this.initView();

		return {
			items: viewItems  
		}
	}//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.layoutDesigner.view.NormalView.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {

	}//eo _afterInitComponent
	
	,initView : function() {
		var _this = this,
		  clsMeta = this.viewLayoutConfig[this.viewLayout],			   
				l = [];	   
		
		for (var i = 0; i < clsMeta.length; i++) {			
			l.push(_this.createLayoutColumn(i, clsMeta[i]));
		}

		return l;
	}//eo initView
	
	/**
	 * Creates {@link #designerPortal} column
	 * @param {Number} id The column's ID
	 * @param {Number} width The column's width
	 * @return {Object} column configuration
	 */
	,createLayoutColumn : function(id, width) {
		return {
			itemId: 'portal-column-' + id,				
			columnWidth: width,
			style: 'padding:5px 0 5px 5px',
			defaults: {
				bodyCssClass: 'layout-designer-widget'
			},
			items: [{
				title: 'Test',
				frame: true,
				html: '<br /><center>Widget</center><br />',
				bodyCssClass: 'layout-designer-widget'
			}]
		}
	}//eo createLayoutColumn
});