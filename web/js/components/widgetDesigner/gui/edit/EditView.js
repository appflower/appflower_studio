Ext.ns('afStudio.wd.edit');


afStudio.wd.edit.EditView = Ext.extend(Ext.FormPanel, {

	/**
	 * The associated with this view controller.
	 * @cfg {afStudio.controller.BaseController} (Required) controller
	 */

	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var me = this,
			nodes = afStudio.ModelNode;		
		
		var items = this.createFormCmp();
		
		var labelWidth = this.getModelNodeProperty(nodes.FIELDS, 'labelWidth');
		
		return {
			labelWidth: labelWidth,
			items: items
		}
	},
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		
		afStudio.wd.edit.EditView.superclass.initComponent.apply(this, arguments);
		
		//this._afterInitComponent();
	},	
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initEvents : function() {
		afStudio.wd.edit.EditView.superclass.initEvents.call(this);
	},
	
	
	/**
	 * @protected
	 */
	createFormCmp : function() {
		var N = afStudio.ModelNode;
		
		if (this.getModelNodeByPath([N.GROUPING, N.SET])) {
			
			//exploring grouping and sets
			
		} else {
			//simple edit form
		}
		
		return [];
	}
	
});


//@mixin EditModelInterface
Ext.apply(afStudio.wd.edit.EditView.prototype, afStudio.wd.edit.EditModelInterface);

//@mixin ModelReflector
Ext.apply(afStudio.wd.edit.EditView.prototype, afStudio.wd.edit.ModelReflector);

/**
 * @type 'wd.editView'
 */
Ext.reg('wd.editView', afStudio.wd.edit.EditView);