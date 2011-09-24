/**
 * <u>i:method</u> model node.
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Method = Ext.extend(afStudio.model.Node, {
					  
	id : afStudio.ModelNode.METHOD,
	
	tag : afStudio.ModelNode.METHOD,
	
	properties : [
      	{name: "name", type: 'token', required: true},
		{name: "type", type: "fetchType", defaultValue: "static"}
	],
	
	defaultDefinition : {
		attributes: {
			name: 'i:method'
		}
	},
	
	nodeTypes : [
		{name: afStudio.ModelNode.PARAM, hasMany: true, unique: 'name'}
	]
});