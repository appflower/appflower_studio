Ext.ns('afStudio.model');

/**
 * Base class for all nodes depending from the model type.
 * 
 * @class afStudio.model.TypedNode
 * @extends afStudio.model.Node
 * @author Nikolai Babinski
 */
afStudio.model.TypedNode = Ext.extend(afStudio.model.Node, {

	/**
	 * @cfg {String} (Required) modelType
	 * The model type.
	 */
	
	/**
	 * The array of node properties.
	 * @property properties
	 * @type {Array}
	 */
	properties : [],
	
	/**
	 * TypedNode constructor
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function(config) {
		config = config || {};		
		
		this.applyType(config.modelType);
		
		afStudio.model.TypedNode.superclass.constructor.call(this, config);
	},
	//eo constructor
	
	/**
	 * Applies node type dependencies.
	 * @param {String} type
	 */
	applyType : function(type) {
		var pt = this[type + 'Properties'];		
		if (pt) {
			this.properties = this.properties.concat(pt);
		}
		var nt = this[type + 'NodeTypes'];
		if (nt) {
			this.nodeTypes = this.nodeTypes.concat(nt);
		}
	}
	//eo applyType
});