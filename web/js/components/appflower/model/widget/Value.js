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
	],

	/**
	 * After node creation, corrects "structure" property's value & {@link #nodeTypes} based on node's structure.
	 * @override
	 */
	onNodeCreate : function() {
		var me = this,
			structure = this.getProperty('structure'),
			cfg = structure.reconfigure;
		
		Ext.iterate(cfg, function(k, nodes){
			var match = true;
			
			Ext.each(nodes, function(n){
				var def = me.getTypeStructure(n);
				
				if (def.required && me.hasChildWithType(def.name) === false) {
					return (match = false);
				}
			});
			
			if (match) {
				structure.setValue(k);
				
				me.nodeTypes.length = 0;
	    		Ext.each(nodes, function(n){
	    			me.nodeTypes.push(n);
	    		});
				
				return false;
			}
		});
	}
	//eo onNodeCreate
});