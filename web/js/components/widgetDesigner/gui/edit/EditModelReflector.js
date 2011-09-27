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
	
		//Buttons
		
		/**
		 * Updates submit button's label 
		 */
		executeUpdateFieldsSubmitlabel : function(node, cmp, p, v) {
			cmp.setText(v);
		},
		
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
		
		executeUpdateFieldsResetable : function(node, cmp, p, v) {
			v ? cmp.show() : cmp.hide();
		},
		
		executeUpdateFieldsResetlabel : function(node, cmp, p, v) {
			cmp.setText(v);
		}
		
		
	}
	
})();

/**
 * Extends base mixin {@link afStudio.wd.ModelReflector} class.
 */
Ext.applyIf(afStudio.wd.edit.EditModelReflector, afStudio.wd.ModelReflector);