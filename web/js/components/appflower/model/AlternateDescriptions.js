/**
 * <u>i:alternateDescriptions</u> model node.
 */
afStudio.model.AlternateDescriptions = Ext.extend(afStudio.model.Node, {

	id : afStudio.ModelNode.ALTERNATE_DESCRIPTIONS,
	
	tag : afStudio.ModelNode.ALTERNATE_DESCRIPTIONS,
	
	properties : [
	{
		name: 'permissions', 
		type: 'permissionType', 
		defaultValue: "*"
	}],
	
	nodeTypes : [
		{name: afStudio.ModelNode.DESCRIPTION, required: true}
	]
});