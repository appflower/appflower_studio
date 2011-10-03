Ext.ns('afStudio.wd.edit');

/**
 * EditView - represents the edit widget type. 
 * 
 * @dependency {afStudio.wd.ModelMapper} ModelMapper mixin
 * @dependency {afStudio.wd.list.ListModelInterface} ListModelInterface mixin
 * @dependency {afStudio.wd.list.ModelReflector} ModelReflector mixin
 * 
 * @class afStudio.wd.edit.EditView
 * @extends Ext.FormPanel
 * @author Nikolai Babinski
 */
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
		var me = this;
		
		/**
		 * Model->Component associations holder.
		 * @property modelMapper
		 * @type {Object}
		 */
		this.modelMapper = {};
			
		var labelWidth = this.getModelNodeProperty(this.NODES.FIELDS, 'labelWidth');

		var items = this.createFormCmp();
		
		var buttons = this.createButtons();
		
		this.dumpMapper();
		
		return {
			autoScroll: true,
			labelWidth: labelWidth,
			items: items,
			buttons: buttons
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
	},	
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initEvents : function() {
		afStudio.wd.edit.EditView.superclass.initEvents.call(this);
		
		var me = this;
		
		this.on({
			scope: me,
			
            /**
             * @relayed controller
             */
            modelNodeAppend: me.onModelNodeAppend,
            /**
             * @relayed controller
             */
            modelNodeInsert: me.onModelNodeInsert,
    		/**
    		 * @relayed controller
    		 */
            modelNodeRemove: me.onModelNodeRemove,
    		/**
    		 * @relayed controller
    		 */
            modelPropertyChanged: me.onModelPropertyChanged
		});		
	},
	//eo initEvents 
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
    beforeDestroy : function() {
    	this.modelMapper = null;
        afStudio.wd.edit.EditView.superclass.beforeDestroy.call(this);
    },
	
	/**
	 * Relayed <u>modelNodeAppend</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeAppend}.
	 * @protected
	 * @interface
	 */
	onModelNodeAppend : function(ctr, parent, node, index) {
		afStudio.Logger.info('@view [EditView] modelNodeAppend');
		var executor = this.getExecutor(this.EXEC_ADD, node);
		if (executor) {
			executor(node, index);
		}
	},
	//eo onModelNodeAppend
	
	/**
	 * Relayed <u>modelNodeInsert</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeInsert}.
	 * @protected
	 * @interface
	 */
	onModelNodeInsert : function(ctr, parent, node, refNode) {
		afStudio.Logger.info('@view [EditView] modelNodeInsert');
		var refCmp = this.getCmpByModel(refNode),
			executor = this.getExecutor(this.EXEC_INSERT, node);
		if (executor) {
			executor(parent, node, refNode, refCmp);
		}
	},
	//eo onModelNodeInsert
	
	/**
	 * Relayed <u>modelNodeRemove</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeRemove}.
	 * @protected
	 * @interface
	 */
	onModelNodeRemove : function(ctr, parent, node) {
    	afStudio.Logger.info('@view [EditView] modelNodeRemove');
		var cmp = this.getCmpByModel(node),
			executor = this.getExecutor(this.EXEC_REMOVE, node);
		if (executor) {
			executor(node, cmp);
		}
	},
	//eo onModelNodeRemove	
	
	/**
	 * Relayed <u>modelPropertyChanged</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelPropertyChanged}.
	 * @protected
	 * @interface
	 */
	onModelPropertyChanged : function(node, p, v) {
		afStudio.Logger.info('@view [EditView] modelPropertyChanged');
		var cmp = this.getCmpByModel(node, p),
			executor = this.getExecutor(this.EXEC_UPDATE, node, p);
		if (executor) {
			executor(node, cmp, p, v);
		}
	},
    
	/**
	 * Creates fields, field-sets and tabpanel. 
	 * Returns an array of components being used as edit view items elements.
	 * @protected
	 * @return {Array} components
	 */
	createFormCmp : function() {
		var N = this.NODES,
			cmp = [];
		
		if (this.isGrouped()) {
			//form with sets and tabpanel
			
			Ext.each(this.getPlainFieldSets(), function(s) {
				cmp.push(this.createFieldSet(s));
			}, this);
			
			var flds = this.getFieldsFromDefaultSet(),
				defSet = this.createDefaultFieldSet(flds);
			cmp.push(defSet);
			
			var tabbedSets = this.getTabbedFieldSets();
			if (!Ext.isEmpty(tabbedSets)) {
				cmp.push(this.createTabPanel(tabbedSets));
			}
		} else {
			//simple form without sets and tabpanel	
			Ext.each(this.getFields(), function(f) {
				cmp.push(this.createField(f));
			}, this);
		}
		
		return cmp;
	},
	
	/**
	 * Creates & registers a field component.
	 * @protected
	 * @return {Ext.form.Field} field
	 */
	createField : function(fld) {
		var mpr = this.NODE_ID_MAPPER,
			fldId = fld[mpr];
		
		var fn, cfg = {}, f;
		
		Ext.copyTo(cfg, fld, 'name, value, style, width, height, disabled');
		
		Ext.apply(cfg, {
			fieldLabel: fld.label,
			labelStyle: 'font-weight: bold;'
		});
		
		if (Ext.isDefined(fld.content)) {
			cfg.value = fld.content;
		}
		
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
				cfg.value = String.format('<b>type</b> = {0}', fld.type);
			break;
		}
		
		if (fld.state == 'readonly') {
			cfg.readOnly = true;		
		} else if (fld.state == 'disabled') {
			cfg.readOnly = true;
			cfg.submitValue = false;
		}
		
		//add model node mapping
		cfg[mpr] = fldId;
		
		f = new fn(cfg);
		
		this.mapCmpToModel(fldId, f);
		
		return f;
	},
	//eo createField
	
	/**
	 * Creates buttons.
	 * Returns an array of buttons.
	 * @protected
	 * @return {Array} buttons
	 */
	createButtons : function() {
		var buttons = [];
		
		this.createResetSubmitButtons(buttons);
		
		var fldsBt = this.getFieldsButtons();
		for (var l = fldsBt.length, i = l - 1; i >= 0; i--) {
			buttons.unshift(
				this.createButton(fldsBt[i])
			);
		}
		
		Ext.each(this.getActions(), function(a){
			buttons.push(this.createButton(a, 'action'));
		}, this);
		
		return buttons;
	},
	
	/**
	 * Creates and adds to buttons array submit and reset buttons.  
	 * @protected
	 * @param {Array} buttons The buttons
	 */
	createResetSubmitButtons : function(buttons) {
		var mpr = this.NODE_ID_MAPPER,
			N = this.NODES;

		var fls = this.getModelNodeProperties(N.FIELDS);

		var submitProp =  Ext.isDefined(fls.submit) ? fls.submit : true;
		
		var submitBt = new Ext.Button({
			text: fls.submitlabel ? fls.submitlabel : 'Submit',
			iconCls: 'icon-accept',
			hidden: !submitProp 
		});
		submitBt[mpr] = N.FIELDS + '#submit';
		this.mapCmpToModel(N.FIELDS + '#submitlabel', submitBt);
		
		var resetBt = new Ext.Button({
			text: fls.resetlabel ? fls.resetlabel : 'Reset',
			iconCls: 'icon-application-form',
			hidden: !submitProp ? true : (Ext.isDefined(fls.resetable) ? !fls.resetable : false) 
		});
		resetBt[mpr] = N.FIELDS + '#resetable';
		this.mapCmpToModel(N.FIELDS + '#resetable', resetBt);
		this.mapCmpToModel(N.FIELDS + '#resetlabel', resetBt);

		this.mapCmpToModel(N.FIELDS + '#submit', {sub: submitBt, res: resetBt});
		
		buttons.push(submitBt, resetBt);
	},
	
	/**
	 * Creates & registers a button.
	 * @protected
	 * @param {Object} btn The button definition object
	 * @param {String} (optional) type The button definition object type = "button" | "action", default is "button"
	 * @return {Ext.Button}
	 */
	createButton : function(btn, type) {
		var mpr = this.NODE_ID_MAPPER,
			cfg = {}, button;
		
		type = Ext.isDefined(type) ? type : 'button';	
		
		Ext.copyTo(cfg, btn, 'name, iconCls, icon, style');
		cfg[mpr] = btn[mpr];
		
		if (type == 'button') {
			cfg.text = btn.label ? btn.label : btn.name;
	        if (btn.state && btn.state == 'disabled') {
	        	cfg.disabled = true;	
	        }
		} else if (type == 'action') {
			Ext.apply(cfg, {
				text: btn.text ? btn.text : btn.name,
				tooltip: btn.tooltip
			});
		}
		
		button = new Ext.Button(cfg);

		this.mapCmpToModel(btn[mpr], button);
		
		return button;
	},
	//eo createButton
	
	/**
	 * Creates & registers a field-set.
	 * @protected
	 * @param {Object} fldSet The field-set definition
	 * @return {Ext.form.FieldSet} field-set
	 */
	createFieldSet : function(fldSet) {
		var mpr = this.NODE_ID_MAPPER,
			cfg = {}, 
			fieldSet;
		
		Ext.copyTo(cfg, fldSet, 'title, collapsed');
		
		Ext.apply(cfg, {
			collapsible: true,
			items: []
		});
		
		cfg[mpr] = fldSet[mpr];
		
		fieldSet = new Ext.form.FieldSet(cfg);
		
		this.mapCmpToModel(fldSet[mpr], fieldSet);
		
		var fields = this.getFieldsFromSet(fldSet[mpr]),
			fldSetFloat = fldSet['float'];
		
		var wr = this.createFieldWrapper(fldSetFloat),
			clmW = this.getColumnWidth(fields, 0);
		
		fieldSet.add(wr);
		
		Ext.each(fields, function(item, idx) {
			var ref = item.ref, 
				fld = item.field,
				f = this.createField(fld);
			
			this.wrapField(wr, f, clmW);
			
			if (idx != 0 && ref['break']) {
				wr = this.createFieldWrapper(fldSetFloat);
				clmW = this.getColumnWidth(fields, idx);
				fieldSet.add(wr);
			}
			
		}, this);

		return fieldSet;
	},
	//eo createFieldSet
	
	/**
	 * Creates the default field-set.
	 * @protected
	 * @param {Array} fields The fields definition object
	 * @return {Ext.form.FieldSet} field-set
	 */
	createDefaultFieldSet : function(fields) {
		var mpr = this.NODE_ID_MAPPER,
			N = this.NODES,
			cfg = {}, 
			fieldSet;
		
		var grouping = this.getModelNodeProperties(N.GROUPING);	
			
		Ext.copyTo(cfg, grouping, 'title, collapsed');
		
		Ext.apply(cfg, {
			collapsible: true,
			items: []
		});
		
		var hidden = true, flds = [];
		Ext.each(fields, function(f) {
			if (f.type != 'hidden') {
				hidden = false;
			}
			flds.push(this.createField(f));
		}, this);
		
		cfg.hidden = hidden;
		fieldSet = new Ext.form.FieldSet(cfg);
		fieldSet.add(flds);
		
		return fieldSet;
	},
	//eo createDefaultFieldSet
	
	/**
	 * Creates tabbed field-sets.
	 * @param {Array} tabbedSets The tabbed field-set(s)
	 * @return {Ext.TabPanel} tab panel
	 */
	createTabPanel : function(tabbedSets) {
		var tabPanel = new Ext.TabPanel({
			activeTab: 0,
			height: 300,
			padding: 10,
			items: []
		});
		
		Ext.each(tabbedSets, function(fs){
			var t = {
				title: fs.tabtitle,
				layout: 'anchor',
				items: this.createFieldSet(fs) 
			}
			tabPanel.add(t);
		}, this);
		
		return tabPanel;
	},
	
	/**
	 * Creates field(s) wrapper.
	 * @protected
	 * @param {Boolean} isFloat The float flag
	 * @return {Ext.Container}
	 */
	createFieldWrapper : function(isFloat) {
		isFloat = !Ext.isDefined(isFloat) ? false : isFloat;
		
		var cfg = {
			defaults: {
				xtype: 'container',
				layout: 'form',
				labelAlign: isFloat ? 'top' : 'left'
			},
			items: []
		};
		if (isFloat) {
			cfg.layout = 'column';
		}
		
		return new Ext.Container(cfg);
	},
	
	/**
	 * Wrappes a field and adds it into the wrapper container.
	 * @protected
	 * @param {Ext.Container} wrapper The field(s) wrapper container
	 * @param {Object} field The field being wrapped
	 * @param {Number} (optional) clmW The column width, by default is 1
	 */
	wrapField : function(wrapper, field, clmW) {
		clmW = Ext.isDefined(clmW) ? clmW : 1;

		wrapper.add(
		{
			columnWidth: clmW,
			items: field
		});		
	},

	/**
	 * Returns column width based on the count of floating fields.
	 * @protected
	 * @param {Array} items The i:grouping items
	 * @param {Number} fromIdx The first field index 
	 * @return {Number} column width
	 */
	getColumnWidth : function(items, fromIdx) {
		var count = 0,
			len = items.length;
			
		if (fromIdx < len) {
			for (var i = fromIdx; i < len; i++) {
				count++;
				if (items[i].ref['break'] == true) break;
			}
		}
		count = (count == 0) ? 1 : count; 
		
		return Ext.util.Format.round(1 / count, 2);
	},
	
	/**
	 * Returns "real" button's index based on view definition object associated with a model 
	 * and widget buttons. 
	 * @param {Node} node The button related node
	 * @param {Number} idx The node idx inside the parent model node
	 * @param {String} type (optional) type The button type, can be "button" | "action", defaults to "button"
	 * @return {Number}
	 */
	getButtonIndex : function(node, idx, type) {
		var vd = this.controller.getViewDefinition(),
			btnIdx = vd.getEntityObj(node, idx).idx;
		
		btnIdx = (btnIdx == null) ? 0 : btnIdx;
		
		type = Ext.isDefined(type) ? type : 'button';	
		
		if (type == 'action') {
			var btnLen = this.getFooterToolbar().items.getCount();
			if (btnIdx < btnLen) {
				btnIdx += btnLen - btnIdx;
			}
		}
		
		return btnIdx;
	},
	
	/**
	 * TODO  auxilary method, should be deleted after view will be implemented
	 * @private
	 */
	dumpMapper : function() {
		afStudio.Logger.info('modelMapper', this.modelMapper);
		Ext.iterate(this.modelMapper, function(k, v, o){
			afStudio.Logger.info(k, v);
		});
	}
	
});

//@mixin ModelMapper
//important applyIf is used to have ability to use/override custom mapping/unmapping methods in the class 
Ext.applyIf(afStudio.wd.edit.EditView.prototype, afStudio.wd.ModelMapper);

//@mixin EditModelInterface
Ext.apply(afStudio.wd.edit.EditView.prototype, afStudio.wd.edit.EditModelInterface);

//@mixin ModelReflector
Ext.apply(afStudio.wd.edit.EditView.prototype, afStudio.wd.edit.EditModelReflector);

/**
 * @type 'wd.editView'
 */
Ext.reg('wd.editView', afStudio.wd.edit.EditView);