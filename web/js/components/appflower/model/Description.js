/**
 * <u>i:description</u> model node.
 */
afStudio.model.Description = Ext.extend(afStudio.model.Node, {
	
	tag : afStudio.ModelNode.DESCRIPTION,
	
	properties : [
		{name: 'image', type: 'token'},
		{name: 'condition', type: 'token'},
		{name: 'permissions', type: 'permissionType', defaultValue: "*"}
	],
	
	defaultDefinition : 'Description'
});