/**
 * <u>i:set</u> model node.
 * The inner node of <u>i:grouping</u>.
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Set = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.SET,
	
	properties : [
		{name: 'title', type: 'token', required: true},
		{name: 'tabtitle', type: 'token'},
		{name: 'columns', type: 'positiveInteger',  defaultValue: 1},
		{name: 'float', type: 'boolean',  defaultValue: false},
		{name: 'collapsed', type: 'boolean',  defaultValue: false},
		{name: 'tabHeight', type: 'positiveInteger',  defaultValue: 225},
		{name: 'iconCls', type: 'token'}, 
		{name: 'icon', type: 'absoluteUriType'}
	],
	
	nodeTypes : [
		{name: afStudio.ModelNode.REF, required: true, hasMany: true, unique: 'to'}
	]
});