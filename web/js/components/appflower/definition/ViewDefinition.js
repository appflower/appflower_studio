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
	 * <i>Read-only</i> definition object.
	 * @property data
	 * @type {Object}
	 */
	
	/**
	 * Checks if a node can be added to another node. 
	 * Returns true if node can be added to parent otherwise false.
	 * @public
	 * @param {Node} parent The parent node being checked for addition
	 * @param {Node} node The node to add
	 * @return {Boolean}
	 */
	canBeAdded : function(parent, node) {
		var parent = this.getEntity(parent),
			key = node.tag;
			
		if (Ext.isDefined(parent[key])) {
			if (Ext.isArray(parent[key])) {
				return this.searchEntityIndex(parent[key], node) != null ? false : true;				
			} else {
				return !this.equal(parent[key], node);
			}
		}
		
		return true;
	},
	
	/**
	 * Returns definition's entity by model node.
	 * @override
	 * @public
	 * @param {afStudio.model.Node} node The model node
	 * @return {Mixed} entity
	 */
	getEntity : function(node) {
		var ent = this.getEntityObj(node).entity;
		
		return this.out(ent);
	},
	
	/**
	 * Returns definition being saved.
	 * @public
	 * @return {Object} data
	 */
	getDataForSave : function() {
		//convert boolean values to string because of incorrect server-side serialization process
		var d = this.out(this.data, true);
		
		return d;
	},
	
	/**
	 * Sets entity's attribute.
	 * @protected
	 * @param {Node} node The model node 
	 * @param {String} p The property name
	 * @param {Mixed} v The property value
	 */
	setEntityAttribute : function(node, p, v) {
		var entObj = this.getEntityObj(node),
			ep = entObj.parent,
			ek = entObj.key,
			ent = entObj.entity;
			
		var property = node.getProperty(p);
		if (p != '_content' && Ext.isEmpty(v)) {
			this.removeEntityAttribute(ent, p);
			return;
		}
		
		//fix definition entity if node has properties and children
		if (!Ext.isObject(ent)) {
			if (node.getProperties().length > 0 || node.nodeTypes.length > 0) {
				ent = ep[ek] = {
					_content: ent
				};
			}
		}
		
		if (p == '_content') {
			if (Ext.isObject(ent)) {
				ent._content = v;
			} else {
				ep[ek] = v;
			}
		} else {
			if (!ent.attributes) {
				ent.attributes = {};
			}
			ent.attributes[p] = v;
		}
	},
	//eo setEntity
	
	/**
	 * Removes entity's attribute
	 * @public
	 * @param {Object} ent The entity object
	 * @param {String} attr The attribute being deleted
	 */
	removeEntityAttribute : function(ent, attr) {
		if (ent.attributes) {
			delete ent.attributes[attr];
			
			if (this.isEmptyEntityAttributes(ent)) {
				delete ent.attributes;
			}
		}
	},
	
	/**
	 * Checks if an entity has any attributes.
	 * Returns true if the passed entity has at least one attribute. 
	 * @protected
	 * @param {Object} ent
	 * @return {Boolean}
	 */
	isEmptyEntityAttributes : function(ent) {
		for (var p in ent.attributes) {
			return false;
		}
		
		return true;
	},
	
	/**
	 * Adds entity.
	 * @override
	 * @public
	 * @param {Node} parent The parent node to which a new child is added
	 * @param {Node} node The node being added
	 */
	addEntity : function(parent, node) {
		var entObj = this.getEntityObj(parent),
			ep = entObj.parent,
			ek = entObj.key,
			ent = entObj.entity;

		var entity = this.createEntity(node);
//		Nothing to do right now, a node which has no properties and value-data(_content - ViewDefinition, data - Node)
//		is treated as empty that is why newly created entity can be = "null".
//		if (entity == null) {
//			throw new afStudio.definition.error.DefinitionError('create-entity');
//		}
		
		var child = ent[node.tag];
		
		if (Ext.isDefined(child)) {
			if (!Ext.isArray(child)) {
				child = ent[node.tag] = [child];
			}
			child.push(entity);
		} else {
			ent[node.tag] = entity;
		}
	},
	//eo addEntity	
	
	/**
	 * Inserts node's corresponding entity before refNode's corresponding entity. 
	 * @public
	 * @param {None} parent
	 * @param {None} node
	 * @param {None} refNode
	 */
	insertBeforeEntity : function(parent, node, refNode) {
		var entObj = this.getEntityObj(refNode),	
			ep = entObj.parent,
			ek = entObj.key,
			ei = entObj.idx;

		//node should be added
		if (node.tag != refNode.tag) {
			this.addEntity(parent, node);
		}
		
		var entity = this.createEntity(node);
		if (Ext.isDefined(ei)) {
			ep[ek].splice(ei, 0, entity);
		}
	},
	
	/**
	 * Removes node's corresponding entity.
	 * @override
	 * @public
	 * @param {afStudio.model.Node} node The model node whose corresponding entity being removed
	 */
	removeEntity : function(node) {
		var entObj = this.getEntityObj(node),
			ep = entObj.parent,
			ek = entObj.key,
			ei = entObj.idx,
			ent = entObj.entity;
	
		if (ei != null) {
			ep[ek].splice(ei, 1);
			Ext.isEmpty(ep[ek]) ? delete ep[ek] : null;
		} else {
			delete ep[ek];
		}
		this.fireEvent('entityRemove', ent);
	},
	//eo removeEntity
	
	/**
	 * Creates entity object form model node.
	 * @protected
	 * @param {Node} node The model node
	 */
	createEntity : function(node) {
		var eAttr = node.getPropertiesHash(),
			eContent = node.getNodeData() ? node.getNodeData().getValue() : null,
			entity = null;
	
		var attrEmpty = true;
		for (var p in eAttr) {
			attrEmpty = false;
			break;
		};			
		
		//if node has properties or children
		if (node.getProperties().length > 0 || node.nodeTypes.length > 0) {
			entity = {};
		}
		if (eAttr && !attrEmpty) {
			entity = {
				attributes: {}
			};
			Ext.apply(entity.attributes, eAttr);
		}
		if (eContent != null) {
			if (Ext.isObject(entity)) {
				entity._content = eContent;
			} else {
				entity = eContent;
			}
		}
		
		return entity;
	},
	
	/**
	 * Returns entity object:
	 * <ul>
	 * {
	 * 	<li><b>parent</b>:{Object} The entity's parent object(wrapper).</li>
	 * 	<li><b>entity</b>:{Mixed} The entity corresponding to a node parameter.
	 * 	If entity can be found this property is set to null. 
	 * 	</li>
	 * 	<li><b>key</b>:{String} The entity's key name inside parent object.</li>
	 * 	<li><b>idx</b>:{Number} If <i>parent[key]</i> is reference to an array,
	 * 	the idx contains entity's index inside it, otherwise it is null. 
	 * 	</li>
	 * }
	 * </ul>
	 * @private
	 * @return {Object}
	 */
    getEntityObj : function(node) {
		var ctr = node.getOwnerTree(),
			sep = node.getPathSeparator(),
    		path = node.getPath().split(sep);
    		
    	//remove "/root"
    	path.splice(0, 2);

    	//node is the model root
    	if (path.length == 0) {
    		return {
	    		parent: null,
	    		entity: this.data,
	    		key: 'root',
	    		idx: null
    		};
    	}
    	
    	var parent, 
    		ent, 
    		idx = null;
    	parent = ent = this.data;
    	
    	for (var i = 0, l = path.length; i < l; i++) {
    		var nodeId = path[i],
    				ek = nodeId.replace(/-\d+$/, '');

			parent = ent;
			
			var nextEnt = ent[ek];
			
    		if (Ext.isDefined(nextEnt)) {
   				if (Ext.isArray(nextEnt)) {
   					var n = ctr.getNodeById(nodeId);
   					if (!n) {
   						throw new Ext.Error(String.format('ViewDefinition. Model does not contain Node {0} with ID = "{1}"', node, nodeId));
   					}
					idx = this.searchEntityIndex(nextEnt, n);
					if (idx == null) {
						throw new Ext.Error(String.format('ViewDefinition. Cannot get model node\'s entity, node: {0}, path: {1}', node, path));
					}
					ent = nextEnt[idx];
		    	} else {
    				ent = nextEnt;
		    	}
    		} else {
    			ent = null;
    			break;
    		}
    	}
    	
    	var entKey = (path[path.length - 1]).replace(/-\d+$/, '');
    	
    	var result = {
    		parent: parent,
    		entity: ent,
    		key: entKey,
    		idx: Ext.isArray(parent[entKey]) ? idx : null
    	};
    	
    	return result;
    },
    //eo getEntityWithParent

	/**
	 * Compares entity and model node, returns true if model node represents the entity - they are equal. 
	 * @protected
	 * @param {Object} entity The entity
	 * @param {afStudio.model.Node} node The model node.
	 * @return {Boolean}
	 */
	equal : function(entity, node) {
		var np = node.getPropertiesHash(),
			nc = node.getNodeData() ? node.getNodeData().getValue() : null;

		var equal = true;
		
		if (Ext.isObject(entity)) {
			//compare attributes
			Ext.iterate(entity.attributes, function(k, v) {
				return (!(Ext.isEmpty(np[k]) || Ext.isEmpty(v)) && np[k] !== v) ? (equal = false) : true;
			});
			//compare _content
			if (equal && Ext.isDefined(entity._content) && nc != entity._content) {
				equal = false;
			}
		} else {
			equal = (entity == nc);	
		}
		
		return equal;
	},
	//eo equal	
	
	/**
	 * Searching an entity corresponding to model node.
	 * Search is based on <i>attributes</i> and <i>_content</i> comparison.
	 * @private
	 * @param {Array} entArray The array of entities.
	 * @param {afStudio.model.Node} node The model node.
	 * @return {Number} entity's index inside entArray or null if entity was not found. 
	 */
	searchEntityIndex : function(entArray, node) {
		var	entIdx;
		for (var i = 0, len = entArray.length; i < len; i++) {
			if (this.equal(entArray[i], node)) {
				entIdx = i;
				break;
			}
		}
		
		return Ext.isNumber(entIdx) ? entIdx : null;
	}
	//eo searchEntityIndex
});