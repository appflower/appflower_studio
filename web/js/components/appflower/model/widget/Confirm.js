/**
 * <u>i:confirm</u> model node.
 */
afStudio.model.widget.Confirm = Ext.extend(afStudio.model.Node, {

	id : afStudio.ModelNode.CONFIRM,
	
	tag : afStudio.ModelNode.CONFIRM,
	
	properties : [
      	{name: "url", type: "internalUriType", required: true},
      	{name: "permissions", type: 'permissionType', defaultValue: "*"},
      	{name: "title", type: "token", defaultValue: "Confirmation"},
        {name: "permissions", type: "i:permissionType", defaultValue: "*"}
	]
});