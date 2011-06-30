/**
 * <u>i:confirm</u> model node.
 */
afStudio.model.Confirm = Ext.extend(afStudio.model.Node, {

	id : afStudio.ModelNode.CONFIRM,
	
	tag : afStudio.ModelNode.CONFIRM,
	
	properties : [
      	{name: "permissions", type: 'permissionType', 'default': "*"},
      	{name: "url", type: "internalUriType", required: true},
      	{name: "title", type: "token", 'default': "Confirmation"},
        {name: "permissions", type: "i:permissionType", 'default': "*"}
      	
	]	
});