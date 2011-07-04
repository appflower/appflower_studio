/**
 * <u>i:datasource</u> model node.
 */
afStudio.model.widget.Datasource = Ext.extend(afStudio.model.Node, {

	id : afStudio.ModelNode.DATA_SOURCE,
	
	tag : afStudio.ModelNode.DATA_SOURCE,
	
	properties : [
		{name: "type", type: "valueType", required: true},
      	{name: "className", type: 'token'},
      	{name: "modelName", type: 'token'},
      	{name: "lister", type: 'boolean', defaultValue: false},
      	{name: "dataLoadedHandler", type: 'token'}
	],
	
	nodeTypes : [
		{name: afStudio.ModelNode.CLASS, required: true},
		{name: afStudio.ModelNode.METHOD}
	]
});