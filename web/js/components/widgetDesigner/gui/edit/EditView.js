Ext.ns('afStudio.wd.edit');


afStudio.wd.edit.EditView = Ext.extend(Ext.FormPanel, {

	/**
	 * The associated with this view controller.
	 * @cfg {afStudio.controller.BaseController} (Required) controller
	 */

	/**
	 * @cfg {Boolean} frame (defaults to true)
	 */
	frame : true,
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var me = this,
			nodes = afStudio.ModelNode;		
		
		/**
		 * Model->Component associations holder.
		 * @property modelMapper
		 * @type {Object}
		 */
		this.modelMapper = {};
			
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
	 * Returns grid's component by a model.
	 * @public
	 * @interface
	 * @param {String|Node} node The model node or model node's id
	 * @param {String} property The model node's property
	 * @return {Ext.Component} node
	 */
	getCmpByModel : function(node, property) {
		var nId = Ext.isString(node) ? node : node.id;
		var mapping = this.modelMapper[nId] || (property ? this.modelMapper[nId + '#' + property] : false);
		if (mapping) {
			return  Ext.isFunction(mapping) ? mapping() : mapping;
		}
		
    	return null;
	},
	//eo getCmpByModel	
	
	/**
	 * Returns model node by component associated with it. If node was not found returns null/undefined.
	 * @public
	 * @interface
	 * @param {Ext.Component} cmp The grid's component associated with a model node
	 * @return {Node} model node
	 */
	getModelByCmp : function(cmp) {
		var mpr = this.getModelNodeMapper(),
			nodeId = cmp[mpr];
			
		return this.getModelNode(nodeId);
	},
	
	
	/**
	 * Maps this grid's component to a model node.
	 * @protected
	 * @param {String} node The model node ID
	 * @param {Component/Function} cmp The component being mapped to the model node or a function returning a mapped component
	 */
	mapCmpToModel : function(node, cmp) {
		this.modelMapper[node] = cmp;
	},
	
	/**
	 * Unmaps the grid's component from the model node.
	 * @protected
	 * @param {String/Node} node The model node's ID or model node
	 */
	unmapCmpFromModel : function(node) {
		node = Ext.isString(node) ? node : node.id;
		delete this.modelMapper[node];
	},
	
	/**
	 * Creates the mapper function. All passed in parameters except the first one(mapper function) are added to the mapper.
	 * @protected
	 * @param {Function} fn The function mapper
	 * @return {Funtion} mapper
	 */
	createMapper : function(fn) {
		var args = Array.prototype.slice.call(arguments, 1);
		return fn.createDelegate(this, args);
	},
	
	/**
	 * @protected
	 */
	createFormCmp : function() {
		var N = afStudio.ModelNode,
			cmp = [];
		
		if (this.getModelNodeByPath([N.GROUPING, N.SET])) {
			//exploring grouping and sets
		} else {

			var fields = this.getFields();
			
			Ext.each(fields, function(f){
				console.log('field', f);
				cmp.push(this.createField(f));
			}, this);
		}
		
		return cmp;
	},
	
	
	/**
	 * @protected
	 */
	createField : function(fld) {
		var mpr = this.getModelNodeMapper(),
			fldId = fld[mpr];
		
		var fn, cfg = {};
		
		switch (fld.type) {
			case 'input':
				fn = Ext.form.TextField;
			break;
			
			case 'textarea':
				fn = fld.rich ? Ext.form.HtmlEditor : Ext.form.TextArea;
			break;
			
			case 'checkbox':
				fn = Ext.form.Checkbox;
				cfg.checked = Ext.isDefined(fld.checked) ? fld.checked : false;
			break;
			
			case 'radio':
				fn = Ext.form.Radio;
				cfg.checked = Ext.isDefined(fld.checked) ? fld.checked : false;
			break;
			
			case 'password':
				fn = Ext.form.TextField;
				cfg.inputType = 'password';
			break;
			
			case 'hidden':
				fn = Ext.form.Hidden;
			break;
			
			case 'file':
				fn = Ext.form.TextField;
				cfg.inputType = 'file';
			break;
			
			case 'combo':
				fn = Ext.form.ComboBox;
				Ext.apply(cfg, {
					store: []
				});
			break;
			
			case 'static':
				fn = Ext.form.DisplayField;
			break;
			
			case 'date':
				fn = Ext.form.DateField;
				cfg.format = fld.dateFormat ? fld.dateFormat : 'Y-m-d';
			break;
			
			default:
				fn = Ext.form.DisplayField;
				cfg.value = fld.type;
			break;
		}
		
		Ext.copyTo(cfg, fld, 'name, value, style, width, height, disabled');
		
		cfg.fieldLabel = fld.label;
		
		if (Ext.isDefined(fld.content)) {
			cfg.value = fld.content;
		}
		
		if (fld.state == 'readonly') {
			cfg.readOnly = true;		
		} else if (fld.state == 'disabled') {
			cfg.readOnly = true;
			cfg.submitValue = false;
		}
		
		//add model node mapping
		cfg[mpr] = fldId;
		
		var f = new fn(cfg);
		
		this.mapCmpToModel(fldId, f);
		
		return f;
	}
	//eo createField
	
});


//@mixin EditModelInterface
Ext.apply(afStudio.wd.edit.EditView.prototype, afStudio.wd.edit.EditModelInterface);

//@mixin ModelReflectorS
Ext.apply(afStudio.wd.edit.EditView.prototype, afStudio.wd.edit.ModelReflector);

/**
 * @type 'wd.editView'
 */
Ext.reg('wd.editView', afStudio.wd.edit.EditView);