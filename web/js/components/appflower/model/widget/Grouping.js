/**
 * <u>i:grouping</u> model node.
 */
afStudio.model.widget.Grouping = Ext.extend(afStudio.model.TypedNode, {

	id : afStudio.ModelNode.GROUPING,
	
	tag : afStudio.ModelNode.GROUPING,
	
	properties : [
		{name: 'title', type: 'token', defaultValue: 'Default'},
		{name: 'isSetting', type: 'boolean', defaultValue: 'false'},
		{name: 'collapsed', type: 'boolean', defaultValue: 'false'}      	
	],
	
	editNodeTypes : [
		{name: afStudio.ModelNode.SET, required: true}
	],
	
	listNodeTypes : [
		{name: afStudio.ModelNode.BY, required: true}		
	]
});