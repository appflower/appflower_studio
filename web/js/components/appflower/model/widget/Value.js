/**
 * <u>i:value</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Value = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.VALUE,
	
	properties : [
        {name: 'type', type: 'valueType', required: true},
        {name: 'structure', type: 'valueStructureType', defaultValue: 'source',
        	reconfigure: {
        		'class & method': [
        			{name: afStudio.ModelNode.CLASS, required: true},
        			{name: afStudio.ModelNode.METHOD, required: true}
        		],
        		'source': [
        			{name: afStudio.ModelNode.SOURCE, required: true}
        		],
        		'item': [
        			{name: afStudio.ModelNode.ITEM, required: true, hasMany: true}
        		]
        	}
        },
 		{name: 'permissions', type: 'permissionType', defaultValue: '*'}        
	],
	
	defaultDefinition : {
		attributes: {
			type: 'orm'
		}
	},
	
	nodeTypes : [
		{name: afStudio.ModelNode.SOURCE, required: true}
	]
});