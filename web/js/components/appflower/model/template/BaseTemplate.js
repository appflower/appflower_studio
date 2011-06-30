Ext.ns('afStudio.model.template');

N = afStudio.model.template;

/**
 * The parent structural template class.
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
	 * 
	 * 
	 * @param {afStudio.model.Node} model The model node
	 */
	processStructure : function(model) {		
		Ext.iterate(this.structure, function(n, idx) {
			if (model.getModelNode(n) == null) {
				model.createNode(n);
			}
		});
	}
});

delete N;

//add model types