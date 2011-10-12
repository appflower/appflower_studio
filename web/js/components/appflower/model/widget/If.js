/**
 * <u>i:if</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.If = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.IF,
	
	_content : null,
	
	properties : [
        {name: 'test', type: 'token', required: true}
	],
	
	//TODO reconfiguration should be implemented in interception manner
	nodeCfg: {
		//The element can be used in 4 cases:
		//
		//1. in a form (form fields go into ifs)
		//2. inside form elements (value, validator etc are if's children)
		//3. Actions can be also if's children (any actions)
		//4. That's for pages, you can conditionally render areas and components of areas.		
		//4 - is not implemented right now, because this model node is used only for widgets
		
		'i:fields': [
			{name: afStudio.ModelNode.FIELD, required: true, hasMany: true, unique: 'name'},
			{name: afStudio.ModelNode.BUTTON, hasMany: true, unique: 'name'},
			{name: afStudio.ModelNode.RADIO_GROUP, hasMany: true, unique: 'name'}
		],
		'i:field': [
		    {name: afStudio.ModelNode.VALUE}, 
		    {name: afStudio.ModelNode.TOOLTIP}, 
		    {name: afStudio.ModelNode.HELP}, 
		    {name: afStudio.ModelNode.VALIDATOR, hasMany: true, unique: 'name'}, 
		    {name: afStudio.ModelNode.HANDLER, hasMany: true} 
		],
		'i:actions': [
			{name: afStudio.ModelNode.ACTION, required: true, hasMany: true, unique: 'name'}
		]
	},

	/**
	 * After node creation, corrects "structure" property's value & {@link #nodeTypes} based on node's structure.
	 * @override
	 */
	onNodeCreate : function() {
		var me = this,
			parentType = this.parentNode.tag,
			ncfg = this.nodeCfg;
			
		Ext.iterate(ncfg, function(t, nodes){
			if (t == parentType) {
				me.nodeTypes.length = 0;
	    		Ext.each(nodes, function(n){
	    			me.nodeTypes.push(n);
	    		});
				
				return false;
			}
		});
		
		this.fireEvent('modelReconfigure', this);
	}
	//eo onNodeCreate
});