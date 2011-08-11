Ext.ns('afStudio.model.template');

N = afStudio.model.template;

/**
 * The base structural template class.
 * 
 * @class afStudio.model.template.BaseTemplate
 * @extends Object
 * @author Nikolai Babinski
 */
N.BaseTemplate = Ext.extend(Object, {

	structure : [
		afStudio.ModelNode.TITLE
	],
	
	/**
	 * Goes over {@link #structure} property and examines model on existance of structural nodes.
	 * If any required structural node is not exists in the model then it is created.
	 * 
	 * @param {afStudio.model.Root} model The root model node.
	 */
	processStructure : function(model) {
		Ext.iterate(this.structure, function(n, idx) {
			var tag = n, required = false;
			if (Ext.isObject(n)) {
				tag = n.name;
				required = (n.required === true) ? true : false;
			}
			if (model.getImmediateModelNode(tag) == null && required) {
				model.createNode(tag);
			}
		});
	}
});

delete N;