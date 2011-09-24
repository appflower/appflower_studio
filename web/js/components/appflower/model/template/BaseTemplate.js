Ext.ns('afStudio.model.template');

N = afStudio.model.template;

/**
 * The base structural template class.
 * 
 * @class afStudio.model.template.BaseTemplate
 * @extends Object
 * @author Nikolai Babinski
 */
N.BaseTemplate = Ext.extend(Object, {
	/**
	 * @property structure The structure holder
	 * @type {Array}
	 */
	structure : [],
	
	/**
	 * @constructor
	 */
	constructor : function() {
		this.extendStructure([
			{name: afStudio.ModelNode.TITLE, required: true}
		]);
	},
	
	/**
	 * Goes over {@link #structure} property and examines model on existance of structural nodes.
	 * If any required structural node is not exists in the model then it is created.
	 * 
	 * @param {afStudio.model.Root} model The root model node.
	 */
	processStructure : function(model) {
		Ext.iterate(this.structure, function(n, idx) {
			var tag = n, required = false;
			if (Ext.isObject(n)) {
				tag = n.name;
				required = (n.required === true) ? true : false;
			}
			if (model.getImmediateModelNode(tag) == null && required) {
				model.createNode(tag);
			}
		});
	},
	//eo processStructure

	/**
	 * Extends template's structure.
	 * @protected
	 * @param {Array} nodes The nodes being added to {@link #structure}  
	 */
	extendStructure : function(nodes) {
		var ns = [];
		for (var i = 0, l = nodes.length; i < l; i++) {
			var n = nodes[i];
			ns[i] = Ext.isObject(n) ? Ext.apply({}, n) : n;
		}
		
		this.structure = this.structure.concat(ns);
	},
	
	/**
	 * Returns node index by its name.
	 * @param {String} name The node name property
	 * @return {Number} index or null if node was not found
	 */
	getNodeIdx : function(name) {
		var str = this.structure,
			idx = Ext.each(str, function(n, idx){
				return !(Ext.isObject(n) ? n.name == name : n == name);
			});
		
		return Ext.isDefined(idx) ? idx : null;
	},
	
	/**
	 * Sets nodes properties.
	 * @param {String} nodeName The node name property, the node being modified 
	 * @param {Object} ps The object contains properties to be set
	 */
	setNode : function(nodeName, ps) {
		var idx = this.getNodeIdx(nodeName);
		if (idx != null) {
			var n = this.structure[idx];
			if (!Ext.isObject(n)){
				n = this.structure[idx] = {name: n};
			}
			
			Ext.iterate(ps, function(k, v){
				n[k] = v;
			});
		}
	},
	
	/**
	 * Removes node from structure.
	 * @param {String} nodeName The node name property
	 * @return {NULL|Array} An array containing the removed elements. 
	 * If only one element is removed, an array of one element is returned. Or null if node was not found.
	 */
	removeNode : function(nodeName) {
		var idx = this.getNodeIdx(nodeName);
		
		if (idx != null) {
			return  this.structure.splice(idx, 1);
		}
		
		return null;
	}
});

delete N;