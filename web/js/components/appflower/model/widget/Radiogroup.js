/**
 * <u>i:radiogroup</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Radiogroup = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.RADIO_GROUP,
	
	properties : [
        {name: 'name', type: 'token', required: true},
      	{name: 'label', type: 'token', required: true},
      	{name: 'comment', type: 'token'},
      	{name: 'help', type: 'token'},
 		{name: 'permissions', type: 'permissionType', defaultValue: '*'}        
	],
	
	nodeTypes : [
	    {name: afStudio.ModelNode.Field, required: true, hasMany: true, unique: 'name'}
	]
});