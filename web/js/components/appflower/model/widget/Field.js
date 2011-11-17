/**
 * <u>i:field</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Field = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.FIELD,
	
	properties : [
        {name: 'name', type: 'token', required: true},
        {name: 'label', type: 'token', required: true},
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
        {name: 'vtype', type: 'token'},
        {name: 'minChars', type: 'positiveInteger'},
 		{name: 'permissions', type: 'permissionType', defaultValue: '*'}        
	],
	
	defaultDefinition : {
		attributes: {
			name: 'field',
			label: 'field'
		}
	},
	
	nodeTypes : [
	    {name: afStudio.ModelNode.VALUE}, 
	    {name: afStudio.ModelNode.TOOLTIP}, 
	    {name: afStudio.ModelNode.HELP}, 
	    {name: afStudio.ModelNode.VALIDATOR, hasMany: true, unique: 'name'}, 
	    {name: afStudio.ModelNode.HANDLER, hasMany: true}, 
	    {name: afStudio.ModelNode.TRIGGER}, 
	    {name: afStudio.ModelNode.WINDOW},
	    {name: afStudio.ModelNode.IF}
	],
	
	/**
	 * @override 
	 */
	onModelPropertyChanged : function(node, p, v, oldValue) {
		var tree = this.getOwnerTree();
		
		//"name" property
		if (tree && p == "name") {
			var N = afStudio.ModelNode,
				r = tree.root,
				gr = r.getImmediateModelNode(N.GROUPING);
			
			console.log('field name is being changed');	
				
			var ref = gr.findChild(N.REF, 'to', oldValue, true);
			
			if (ref) {
				if (Ext.isEmpty(v)) {
					afStudio.Msg.warning(String.format('Widget Designer - {0} node', N.FIELD), 
						String.format('Field is grouped! Incorrect <u>to</u> property. <br/> Field with <u>name</u> = <b>{0}</b> does not exists.', v));
					
					return false;
				} else {
					ref.setProperty('to', v);
				}
			}
		}
		
		return true;
	}
});