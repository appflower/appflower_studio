/**
 * Model <u>root</u> node. This node is the container of whole model.
 * 
 * @class afStudio.model.Root
 * @extends afStudio.model.Node
 * @author Nikolai Babinski
 */
afStudio.model.Root = Ext.extend(afStudio.model.Node, {
	
	id : 'root',
	
	tag: 'root',
	
	properties : [
      	{name: "xmlns:i",  required: false},
		{name: "xmlns:xsi",  required: false},
		{name: "xsi:schemaLocation",  required: false},
      	{name: "type", required: true},
      	{name: "tabbed", required: false, type: Boolean},
      	{name: "module", required: false, type: String},
      	{name: "dynamic", value: false, required: false, type: Boolean}
	],
	
	/**
	 * Returns Model's type.
	 * @return {String} type
	 */
	getModelType : function() {
		return this.getProperty('type');
	},
	
	/**
	 * Returns model node by its ID.
	 * @param {String} nodeId The node ID value
	 * @return {Node} The found child or null if none was found
	 */
	getModelNode : function(nodeId) {
		return this.findChildById(nodeId, true);
	},
	
	structure: {
		
	}
	
});