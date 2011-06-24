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
      	{name: "type", required: true},      	
      	{name: "xmlns:i",  required: false},
		{name: "xmlns:xsi",  required: false},
		{name: "xsi:schemaLocation",  required: false}
	],
	
	/**
	 * Returns Model's type.
	 * @return {String} type
	 */
	getModelType : function() {
		return this.getProperty('type');
	},
	
	getModelNode : function() {
	//implement	
	}	
});