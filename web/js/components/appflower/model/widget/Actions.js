/**
 * Base action class.
 * @class afStudio.model.widget.BaseAction
 * @extends afStudio.model.Node
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.BaseAction = Ext.extend(afStudio.model.Node, {

	properties : [
	{
		name: "permissions", 
		type: 'permissionType', 
		defaultValue: "*"
	}],
	
	nodeTypes : [
		{name: afStudio.ModelNode.ACTION, required: true, hasMany: true},
		{name: afStudio.ModelNode.IF}
	]
});

/**
 * <u>i:actions</u> model node.
 */
afStudio.model.widget.Actions = Ext.extend(afStudio.model.widget.BaseAction, {
	id : afStudio.ModelNode.ACTIONS,	
	tag : afStudio.ModelNode.ACTIONS	
});

/**
 * <u>i:rowactions</u> model node.
 */
afStudio.model.widget.Rowactions = Ext.extend(afStudio.model.widget.BaseAction, {
	id : afStudio.ModelNode.ROW_ACTIONS,	
	tag : afStudio.ModelNode.ROW_ACTIONS	
});

/**
 * <u>i:moreactions</u> model node.
 */
afStudio.model.widget.Moreactions = Ext.extend(afStudio.model.widget.BaseAction, {
	id : afStudio.ModelNode.MORE_ACTIONS,	
	tag : afStudio.ModelNode.MORE_ACTIONS	
});