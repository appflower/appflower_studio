/**
 * <u>i:method</u> model node.
 */
afStudio.model.widget.Method = Ext.extend(afStudio.model.Node, {

	id : afStudio.ModelNode.METHOD,
	
	tag : afStudio.ModelNode.METHOD,
	
	properties : [
      	{name: "name", type: 'token', required: true},
		{name: "type", type: "fetchType", defaultValue: "static"}
	],
	
	nodeTypes : [
		{name: afStudio.ModelNode.PARAM}
	]
});