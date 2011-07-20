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
	 * If any structural node is not exists in the model then it is created.
	 * 
	 * @param {afStudio.model.Root} model The root model node.
	 */
	processStructure : function(model) {
		Ext.iterate(this.structure, function(n, idx) {
			var sName = Ext.isObject(n) ? n.name : n;
			if (model.getImmediateModelNode(sName) == null) {
				model.createNode(sName);
			}
		});
	}
});

delete N;