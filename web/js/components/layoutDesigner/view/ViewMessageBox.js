Ext.namespace('afStudio.layoutDesigner.view');

afStudio.layoutDesigner.view.ViewMessageBox = Ext.extend(Ext.Panel, {
	
	floating : true
	
	,style : 'z-index: 10; text-align: center; font-size: 20px;'
	
	,width : 600
	
	/**
	 * @property messageHolder
	 * @type {Ext.Container}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	,_beforeInitComponent : function() {
		var _this = this;

		return {
			items: {
				ref: 'messageHolder',
				xtype: 'container',
				style: 'padding: 20px',
				html: 'View has no widgets added yet, add you first widget to get started.'	
			}
		};
	}//eo _beforeInitComponent	
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.layoutDesigner.view.ViewMessageBox.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent

	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on({
			afterrender: _this.onAfterRender,
			scope: _this
		});
	}//eo _afterInitComponent 
	
	,onAfterRender : function() {
		var box = this.ownerCt.ownerCt.getBox();
			x = Ext.util.Format.round(box.width/2, 0) - this.getWidth()/2,
			y = Ext.util.Format.round(box.height/2, 0) - this.getHeight();

		this.setPosition(x, y);		
	}
});