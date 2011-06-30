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
	
		var mt = this.getModelType(config);
		
		this.applyType(mt);
		
		afStudio.model.TypedNode.superclass.constructor.call(this, config);
	},
	//eo constructor
	
	getModelType : function(cfg) {
		var mt;
		
		if (!cfg.modelType && !cfg.parentNode) {
			throw new Error('TypedNode, type was not specified');
		}
		
		if (cfg.modelType) {
			mt = cfg.modelType;
		} else if (cfg.parentNode) {			
	        var p = cfg.parentNode;
	        while (p.parentNode && (p = p.parentNode));
			mt = p.getModelType();
		}
		
		return mt;
	},
	
	applyType : function(type) {
		if (!type) {
			return;
		}
		
		var pt = this[type + 'Properties'];		
		if (pt) {
			this.properties = this.properties.concat(pt);
		}
		var nt = this[type + 'NodeTypes'];
		if (nt) {
			this.nodeTypes = this.nodeTypes.concat(nt);
		}
	}
});