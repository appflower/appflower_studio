Ext.ns('afStudio.definition');

afStudio.definition.ViewDefinition = Ext.extend(afStudio.definition.DataDefinition, {
	/**
	 * @override
	 */
	getEntity : function(node) {
		var entObj = this.getEntityAncestor(node);
		
		return	entObj.ancestor[entObj.entityKey]; 
	},
	
	/**
	 * @override
	 */
	removeEntity : function(node) {
		var entObj = this.getEntityAncestor(node),
//			p = 
			entity = entObj.ancestor[entObj.entityKey];
		
		if (Ext.isArray(entObj.ancestor)) {
			entObj.ancestor.splice(entObj.entityKey, 1);
			//TODO delete empty arrays 
//			if (Ext.isEmpty(entObj.ancestor)) {
//				delete entObj.ancestor[entObj.entityKey];
//			}			
		} else {
			delete entObj.ancestor[entObj.entityKey];
		}
		
		this.fireEvent('entityRemove', entity);
	},
	
	/**
	 * @override 
	 */
	addEntity : function() {
	},
	
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
    			ancestor = Ext.isArray(ent[entKey]) ? ent[entKey] : ent;
    		
    		result.ancestor = ancestor;
    		result.entityKey = entKey;
    		
    		//node.getNodeData();
    		if (Ext.isArray(ancestor)) {
    			var entIdx = this.searchEntityIndex(ancestor, node);
    			if (!Ext.isDefined(entIdx)) {
    				throw new Ext.Error('Entity was not found!');
    			}
    			result.entityKey = entIdx;
    		}
    	}
    	
    	return result;
	},
	
	/**
	 * @private
	 */
	searchEntityIndex : function(entArray, node) {
		var np = node.getPropertiesHash();
		
		//TODO add _content check
		
		var entIdx;
		for (var i = 0, len = entArray.length; i < len; i++) {
			var found = true;
			Ext.iterate(entArray[i].attributes, function(k, v) {
				if (np[k] !== v) {
					return (found = false);
				}
			});
			if (found) {
				entIdx = i;
				break;
			}
		}
		
		return entIdx;
	}
});