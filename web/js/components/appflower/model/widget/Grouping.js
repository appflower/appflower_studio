/**
 * <u>i:grouping</u> model node.
 */
afStudio.model.widget.Grouping = Ext.extend(afStudio.model.Node, {

	id : afStudio.ModelNode.GROUPING,
	
	tag : afStudio.ModelNode.GROUPING,
	
	properties : [
		{name: 'title', type: 'token', defaultValue: 'Default'},
		{name: 'isSetting', type: 'boolean', defaultValue: 'false'},
		{name: 'collapsed', type: 'boolean', defaultValue: 'false'}      	
	],
	
	nodeTypes : [
		{name: afStudio.ModelNode.SET, required: true, hasMany: true}
	]	
});