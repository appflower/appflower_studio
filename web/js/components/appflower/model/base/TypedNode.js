Ext.ns('afStudio.model');

/**
 * Base class for all nodes depend from the model type.
 * 
 * @class afStudio.model.TypedNode
 * @extends afStudio.model.Node
 * @author Nikolai Babinski
 */
afStudio.model.TypedNode = Ext.extend(afStudio.model.Node, {

	/**
	 * @cfg {String} modelType
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
		this.parentNode = config.parentNode || null;		
		var mt = config.modelType ? config.modelType : this.getModelType();
		
		this.applyType(mt);
		
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