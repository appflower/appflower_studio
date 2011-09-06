/**
 * <u>i:field</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Field = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.FIELD,
	
	properties : [
        {name: 'name', type: 'token', required: true},
        {name: 'label', type: 'token'},
        {name: 'type', type: 'inputType', defaultValue: 'input'},
        {name: 'selected', type: 'token'},
        {name: 'state', type: 'stateType', defaultValue: 'editable'},
        {name: 'value', type: 'token'},
        {name: 'style', type: 'token'},
        {name: 'width', type: 'positiveInteger'}, 
    	{name: 'height', type: 'positiveInteger'}, 
		{name: 'checked', type: 'boolean'},
		{name: 'rich', type: 'boolean', defaultValue: false}, 
 		{name: 'content', type: 'token'},
 		{name: 'module', type: 'token'},
        {name: 'action', type: 'token'},
 		{name: 'fromLegend', type: 'token', defaultValue: 'Options'},
 		{name: 'toLegend', type: 'token', defaultValue: 'Selected'},
 		{name: 'dateFormat', type: 'token'},
 		{name: 'timeFormat', type: 'token'},
 		{name: 'clear', type: 'boolean', defaultValue: true}, 
 		{name: 'session', type: 'boolean', defaultValue: false},
 		{name: 'disabled', type: 'boolean', defaultValue: false},
 		{name: 'plugin', type: 'token', defaultValue: '*'}, 
 		{name: 'url', type: 'internalUriType'},
 		{name: 'permissions', type: 'permissionType', defaultValue: '*'}        
	],
	
	nodeTypes : [
	    {name: afStudio.ModelNode.VALUE}, 
	    {name: afStudio.ModelNode.TOOLTIP}, 
	    {name: afStudio.ModelNode.HELP}, 
	    {name: afStudio.ModelNode.VALIDATOR, hasMany: true, unique: 'name'}, 
	    {name: afStudio.ModelNode.HANDLER, hasMany: true}, 
	    {name: afStudio.ModelNode.TRIGGER}, 
	    {name: afStudio.ModelNode.WINDOW},
	    {name: afStudio.ModelNode.IF}
	]
});