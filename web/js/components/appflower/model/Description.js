/**
 * <u>i:description</u> model node.
 */
afStudio.model.Description = Ext.extend(afStudio.model.Node, {
	
	tag : afStudio.ModelNode.DESCRIPTION,
	
	_content : {name: '_content', required: true},
	
	properties : [
		{name: 'image', type: 'token'},
		{name: 'condition', type: 'token'},
		{name: 'permissions', type: 'permissionType', defaultValue: "*"}
	],
	
	defaultDefinition : { 
		_content: 'New description'
	}
});