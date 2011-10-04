Ext.ns('afStudio.wd.edit');

/**
 * EditView reflector.
 * 
 * @mixin ModelReflector
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.edit.EditModelReflector = (function() {
	
	return {
	
		/**
		 * Changes the line of some executors. 
		 * @override
		 */
		correctExecutorLine : function(line, type, node, property) {
			if (['Field', 'Description'].indexOf(line) != -1) {
				var pt = this.getExecutorToken(node.parentNode.tag);
				line = pt + line;
			}
			
			return line;
		},
		
		
		//TODO labelWidth property implementation
		executeUpdateFieldsLabelWidth : function(node, cmp, p, v) {
			/*
			console.log('label width', v);
			this.labelWidth = v;
			this.form.applyToFields({labelWidth: v});
			*/
		},
		
		//buttons, responsible properties: i:fields, i:actions
		//----------------------------------------------------
		
		//submit & reset buttons
		
		/**
		 * Updates submit button's label 
		 */
		executeUpdateFieldsSubmitlabel : function(node, cmp, p, v) {
			cmp.setText(v);
		},
		/**
		 * Updates reset button's label
		 */
		executeUpdateFieldsResetlabel : function(node, cmp, p, v) {
			cmp.setText(v);
		},
		/**
		 * Submit & Reset buttons visibility state 
		 */
		executeUpdateFieldsSubmit : function(node, cmp, p, v) {
			if (v === false) {
				cmp.sub.hide();
				cmp.res.hide();
			} else {
				cmp.sub.show();
				if (this.getModelByCmp(cmp.res)[1]) {
					cmp.res.show();
				}
			}
			this.doLayout();
		},
		/**
		 * Reset button visibility
		 */
		executeUpdateFieldsResetable : function(node, cmp, p, v) {
			v ? cmp.show() : cmp.hide();
		},
		
		//general buttons
		
		/**
		 * Adds a button.
		 * @private
		 * @param {Node} node The button related node
		 * @param {Number} idx The node idx inside the parent model node
		 * @param {String} type (optional) type The button type, can be "button" | "action", defaults to "button"
		 */
		addButton : function(node, idx, type) {
			type = Ext.isDefined(type) ? type : 'button';	
			
			var fb = this.getFooterToolbar(),
				pBtn = this.getModelNodeProperties(node),
				oBtn = this.createButton(pBtn, type);
				
			idx = this.getButtonIndex(node, idx, type);
			fb.insertButton(idx, oBtn);
			this.doLayout();
		},
		
		/**
		 * @private
		 */
		removeButton : function(node, cmp) {
			cmp.destroy();
			this.unmapCmpFromModel(node);
		},
		
		/**
		 * @private
		 */
		insertButton : function(parent, node, refNode, refCmp, type) {
			type = Ext.isDefined(type) ? type : 'button';
			
			var fb = this.getFooterToolbar(),
				pBtn = this.getModelNodeProperties(node),
				oBtn = this.createButton(pBtn, type),
				idx = fb.items.indexOf(refCmp);
			
			fb.insertButton(idx, oBtn);			
			this.doLayout();			
		},
		
		/**
		 * Sets button <u>name</u> property.
		 * @private
		 * @param {Object} btn The button whose name property being set
		 * @param {String} v The name value
		 */
		setButtonName : function(btn, v) {
			var oldValue = btn.name;
			btn.name = v;
			if (Ext.isEmpty(btn.text) || btn.text == oldValue) {
				btn.setText(v);
			}
		},
		
		/**
		 * Sets button <u>text</u> property
		 * @private
		 */
		setButtonText : function(btn, v) {
			btn.setText(v ? v : btn.name);
		},
		
		/**
		 * Adds i:fields->i:button
		 */
		executeAddButton : function(node, idx) {
			this.addButton(node, idx);
		},
		/**
		 * Removes i:fields->i:button
		 */
		executeRemoveButton : function(node, cmp) {
			this.removeButton(node, cmp);
		},
		/**
		 * Inserts i:fields->i:button
		 */
		executeInsertButton : function(parent, node, refNode, refCmp) {
			this.insertButton(parent, node, refNode, refCmp);
		},
		/**
		 * label
		 */
		executeUpdateButtonLabel : function(node, cmp, p, v) {
			this.setButtonText(cmp, v);
		},
		/**
		 * name
		 */
		executeUpdateButtonName : function(node, cmp, p, v) {
			this.setButtonName(cmp, v);
		},
		/**
		 * iconCls
		 */		
		executeUpdateButtonIconCls : function(node, cmp, p, v) {
			cmp.setIconClass(v);
		},
		/**
		 * icon
		 */		
		executeUpdateButtonIcon : function(node, cmp, p, v) {
			cmp.setIcon(v);
		},
		
		//i:action buttons
		
		executeAddAction : function(node, idx) {
			this.addButton(node, idx, 'action');
		},
		executeRemoveAction : function(node, cmp) {
			this.removeButton(node, cmp);
		},
		executeInsertAction : function(parent, node, refNode, refCmp) {
			this.insertButton(parent, node, refNode, refCmp, 'action');
		},
		/**
		 * name
		 */
		executeUpdateActionName : function(node, cmp, p, v) {
			this.setButtonName(cmp, v);
		},
		/**
		 * text
		 */
		executeUpdateActionText : function(node, cmp, p, v) {
			this.setButtonText(cmp, v);
		},
		/**
		 * iconCls
		 */		
		executeUpdateActionIconCls : function(node, cmp, p, v) {
			cmp.setIconClass(v);
		},
		/**
		 * icon
		 */		
		executeUpdateActionIcon : function(node, cmp, p, v) {
			cmp.setIcon(v);
		},
		/**
		 * tooltip
		 */
		executeUpdateActionTooltip : function(node, cmp, p, v) {
			cmp.setTooltip(v);	
		},
		
		
		//fields (i:fields->i:field)
		//----------------------------------------------------
		/**
		 * Sets field's <u>content</u> property.
		 * @private
		 */
		setFieldContent : function(node, fld, v) {
			var fv = this.getModelNodeProperty(node, 'value');
			fld.content = v;
			fld.setValue(Ext.isEmpty(v) && !Ext.isEmpty(fv) ? fv : v);  
		},
		/**
		 * Sets field's <u>value</u> property.
		 * @private
		 */
		setFieldValue : function(fld, v) {
			if (Ext.isEmpty(fld.content)) {
				fld.setValue(v);
			}
		},
		
		/**
		 * Adds a field
		 */
		executeAddFieldsField : function(node, idx) {
			var pField = this.getModelNodeProperties(node),				
				oField = this.createField(pField);
			
			if (this.isGrouped()) {
				var defSet = this.getComponent('default-set');
				
				if (Ext.isEmpty(defSet)) {
					
				} else {
					var fldIdx = this.getFieldIndex(node, idx, 'default-set');
					defSet.insert(fldIdx, oField);
					defSet.doLayout();
				}
				
			} else {
				var fldIdx = this.getFieldIndex(node, idx);
				this.insert(fldIdx, oField);
				this.doLayout();
			}
		},
		
		/**
		 * type
		 */
		executeUpdateFieldsFieldType : function(node, cmp, p, v) {
			if (this.isGrouped()) {
				
			} else {
				var fldIdx = this.items.indexOf(cmp);
				this.remove(cmp, true);
				this.executeAddFieldsField(node, fldIdx);
			}
		},
		/**
		 * label
		 */
		executeUpdateFieldsFieldLabel : function(node, cmp, p, v) {
			cmp.label.update(!Ext.isEmpty(v) ? (v + ':') : v);
		},
		/**
		 * content
		 */
		executeUpdateFieldsFieldContent : function(node, cmp, p, v) {
			this.setFieldContent(node, cmp, v);
		},
		/**
		 * value
		 */
		executeUpdateFieldsFieldValue : function(node, cmp, p, v) {
			this.setFieldValue(cmp, v);
		},
		/**
		 * disabled
		 */
		executeUpdateFieldsFieldDisabled : function(node, cmp, p, v) {
			v == true ? cmp.disable() : cmp.enable();
		},
		/**
		 * height
		 */
		executeUpdateFieldsFieldHeight : function(node, cmp, p, v) {
			cmp.setHeight(v);
		},
		/**
		 * width
		 */
		executeUpdateFieldsFieldWidth : function(node, cmp, p, v) {
			cmp.setWidth(v);
		},
		/**
		 * style
		 */
		executeUpdateFieldsFieldStyle : function(node, cmp, p, v) {
			var stl = cmp.el.getStyles('width', 'height');
			cmp.el.dom.removeAttribute('style', '');
			cmp.el.applyStyles(stl).applyStyles(v);
		},
		/**
		 * state
		 */
		executeUpdateFieldsFieldState : function(node, cmp, p, v) {
			switch (v) {
				case 'editable':
					cmp.enable();
					cmp.setReadOnly(false);
					break;
				case 'readonly':
					cmp.enable();
					cmp.setReadOnly(true);
					break;
				case 'disabled':
					cmp.disable();
					break;
			}
		},
		/**
		 * checked
		 */
		executeUpdateFieldsFieldChecked : function(node, cmp, p, v) {
			if (['checkbox', 'radio'].indexOf(cmp.getXType()) != -1) {
				cmp.setValue(v);
			}
		},
		/**
		 * rich
		 */
		executeUpdateFieldsFieldRich : function(node, cmp, p, v) {
			if (cmp.getXType() == 'textarea') {
				this.executeUpdateFieldsFieldType(node, cmp, p, v);
			}
		}
		
	}
})();

/**
 * Extends base mixin {@link afStudio.wd.ModelReflector} class.
 */
Ext.applyIf(afStudio.wd.edit.EditModelReflector, afStudio.wd.ModelReflector);