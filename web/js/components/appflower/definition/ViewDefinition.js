Ext.ns('afStudio.definition');

/**
 * View Definition.
 * Widgets <u>definition</u> data holder. Definition is an Object representing a view xml structure.
 * 
 * @class afStudio.definition.ViewDefinition
 * @extends afStudio.definition.DataDefinition
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.definition.ViewDefinition = Ext.extend(afStudio.definition.DataDefinition, {
	/**
	 * Definition Object. <i>Read-Only</i>
	 * @property data
	 * @type {Object}
	 */
	
	/**
	 * Returns definition's entity by model node.
	 * @override
	 * @param {afStudio.model.Node} node The model node
	 */
	getEntity : function(node) {
		var entObj = this.getEntityAncestor(node),
			ea = entObj.ancestor,
			ek = entObj.entityKey,
			entity;
		
		if (Ext.isArray(ea[ek])) {
			var eArray = ea[ek],
				eIdx = entObj.entityIdx;
			entity = eArray[eIdx];			
		} else {
			entity = ea[ek];
		}
		
		return this.out(entity);
	},
	//eo getEntity
	
	/**
	 * Removes entity corresponding to the model node passed in.
	 * @override
	 * @param {afStudio.model.Node} node The model node
	 */
	removeEntity : function(node) {
		var entObj = this.getEntityAncestor(node),
			ea = entObj.ancestor,
			ek = entObj.entityKey,
			entity;
		
		if (Ext.isArray(ea[ek])) {
			var eArray = ea[ek],
				eIdx = entObj.entityIdx;
			entity = eArray[eIdx];
			eArray.splice(eIdx, 1);
			Ext.isEmpty(eArray) ? delete ea[ek] : null;
		} else {
			entity = ea[ek];
			delete ea[ek];
		}
		
		entity = this.out(entity);
		
		this.fireEvent('entityRemove', entity);
	},
	//eo removeEntity
	
	/**
	 * @override 
	 */
	addEntity : function(parent, node) {
	},
	//eo addEntity
	
	/**
	 * @private
	 */
	getEntityAncestor : function(node) {
		var d = this.data,
			sep = node.getPathSeparator(),
    		path = node.getPath().split(sep);

    	//remove "/root"
    	path.splice(0, 2);

    	var i = 0,
    		len = path.length,
    		ancestor = d,
    		ent = d;
    	while (i < len && ent[path[i]]) {
    		if (i > 0) {
    			ancestor = ent;
    		}
    		ent = ent[path[i]];
    		i++;
    	}
    	
    	var result = {
    		ancestor: ancestor,
    		entityKey: path[i - 1]
    	};
    	
    	if (i < len) {
    		var entKey   = path[i].replace(/-\d+$/, '');
    		result.ancestor  = ent;
    		result.entityKey = entKey;
    		if (Ext.isArray(ent[entKey])) {
    			var entIdx = this.searchEntityIndex(ent[entKey], node);
    			if (!Ext.isDefined(entIdx)) {
    				throw new Ext.Error('Entity was not found!');
    			}
    			result.entityIdx = entIdx;
    		}
    	}
    	
    	return result;
	},
	//eo getEntityAncestor
	
	/**
	 * Search is based on <i>attributes</i> and <i>_content</i> comparison.
	 * @private
	 */
	searchEntityIndex : function(entArray, node) {
		var np = node.getPropertiesHash(),
			nc = node.getNodeData();
		
		var entIdx;
		for (var i = 0, len = entArray.length; i < len; i++) {
			var found = true;
			Ext.iterate(entArray[i].attributes, function(k, v) {
				return (np[k] !== v) ? (found = false) : true; 
			});
			if (found) {
				if (Ext.isPrimitive(nc) && nc != entArray[i]._content) {
					continue;
				}
				entIdx = i;
				break;
			}
		}
		
		return entIdx;
	}
	//eo searchEntityIndex
});