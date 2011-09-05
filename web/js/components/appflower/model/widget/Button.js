/**
 * <u>i:button</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Button = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.BUTTON,
	
	properties : [
		{name: 'name', type: 'token', required: true},
		{name: 'label', type: 'token', required: true},
	    {name: 'action', type: 'combinedUriType', required: true},
	    {name: 'type', type: 'buttonType', defaultValue: 'button'},
		{name: 'icon', type: 'absoluteUriType'},
		{name: 'iconCls', type: 'token'},
	    {name: 'state', type: 'stateType', defaultValue: 'editable'},
		{name: 'style', type: 'token'},
		{name: 'updater', type: 'boolean', defaultValue: false},
		{name: 'permissions', type: 'permissionType', defaultValue: '*'}
	],
	
	nodeTypes : [
		{name: afStudio.ModelNode.HANDLER, hasMany: true, unique: 'name'}
	]
});