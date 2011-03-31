Ext.namespace('afStudio.layoutDesigner.view');

/**
 * ViewMessageBox an auxiliary panel for showing messages regarding to each separate view.
 * 
 * @class afStudio.layoutDesigner.view.ViewMessageBox
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.layoutDesigner.view.ViewMessageBox = Ext.extend(Ext.Panel, {
	
	/**
	 * @cfg {Boolean} floating set to <b>true</b>
	 * To enable floating panel functionality.
	 * <b>important</b> it should be <u>true</u>.  
	 */
	floating : true
	
	/**
	 * @cfg {String} style
	 */
	,style : 'z-index: 10; text-align: center; font-size: 20px;'
	
	/**
	 * @cfg {Number} width (defaults to 600)
	 */
	,width : 600
	
	/**
	 * @cfg {Mixed} Required viewContainer
	 */
	
	/**
	 * @property messageHolder
	 * @type {Ext.Container}
	 */
	
	/**
	 * @cfg {String} viewMessage
	 * The messge to show.
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
				html: this.viewMessage
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

	/**
	 * Initializes events & does post configuration actions.
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on({
			afterrender: _this.onAfterRender,
			scope: _this
		});
	}//eo _afterInitComponent 
	
	/**
	 * This panel <u>afterrender</u> event listener
	 */
	,onAfterRender : function() {				
		var box = this.viewContainer.getBox(),
			x = Ext.util.Format.round(box.width/2, 0) - this.getWidth()/2,
			y = Ext.util.Format.round(box.height/2, 0) - this.getHeight();

		this.setPosition(x, y);
	}//eo onAfterRender 
	
//	,setMessage : function() {
//		
//		this.messageHolder.update('View has no widgets added yet, add you first widget to get started.');
//		//				html: 'View has no widgets added yet, add you first widget to get started.'
//	}
});