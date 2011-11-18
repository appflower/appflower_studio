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
			
			//model has i:grouping node	
			if (gr) {
				var ref = gr.findChild(N.REF, 'to', oldValue, true);
				
				//additional model consistency logic
				//field is "grouped" - associated with i:ref model node
				if (ref) {
					if (Ext.isEmpty(v)) {
						afStudio.Msg.warning(String.format('Widget Designer - {0} node', N.FIELD), 
							String.format('Field "{0}" is grouped and must have <b>name</b> property.', oldValue));
						
						node.setProperty(p, oldValue);
						
						return false;
						
					//update i:field -> i:ref relation 	
					} else {
						ref.setProperty('to', v);
					}
				}
			}
		}
		
		return true;
	}
});