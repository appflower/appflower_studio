/**
 * <u>i:validator</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Validator = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.VALIDATOR,
	
	properties : [
        {name: 'name', type: 'token', required: true},
 		{name: 'permissions', type: 'permissionType', defaultValue: '*'}        
	],
	
	nodeTypes : [
	    {name: afStudio.ModelNode.PARAM, hasMany: true, unique: 'name'}
	]
});