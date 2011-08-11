/**
 * <u>i:handler</u> model node.
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Handler = Ext.extend(afStudio.model.Node, {
	
	tag : afStudio.ModelNode.HANDLER,

	properties : [
        {name: "action", type: "token", required: true},
        {name: "type", type: "handlerType", defaultValue: "click"},
      	{name: "is_script", type: "boolean", defaultValue: true}
	],
	
	defaultDefinition : {
		attributes: {
			action: 'i:handler'
		}
	},
	
	nodeTypes : [
		{name: afStudio.ModelNode.PARAM, hasMany: true, unique: 'name'}
	]
});