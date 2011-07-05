/**
 * <u>i:description</u> model node.
 */
afStudio.model.widget.Description = Ext.extend(afStudio.model.Node, {

	id : afStudio.ModelNode.DESCRIPTION,
	
	tag : afStudio.ModelNode.DESCRIPTION,
	
	properties : [
		{name: 'image', type: 'token'},
		{name: 'condition', type: 'token'},
		{name: 'permissions', type: 'permissionType', defaultValue: "*"}
	]
});