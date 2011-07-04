/**
 * <u>i:actions</u> model node.
 */
afStudio.model.widget.Actions = Ext.extend(afStudio.model.Node, {

	id : afStudio.ModelNode.ACTIONS,
	
	tag : afStudio.ModelNode.ACTIONS,
	
	properties : [
	{
		name: "permissions", 
		type: 'permissionType', 
		defaultValue: "*"
	}],
	
	nodeTypes : [
		{name: afStudio.ModelNode.ACTION, required: true},
		{name: afStudio.ModelNode.IF, required: true}
	]	
});