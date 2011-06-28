/**
 * Model <u>root</u> node. This node is the container of whole model.
 * 
 * @class afStudio.model.Root
 * @extends afStudio.model.Node
 * @author Nikolai Babinski
 */
afStudio.model.Root = Ext.extend(afStudio.model.Node, {
	
	/**
	 * @cfg {Function/String} (Optional) structureTpl
	 * <u>structureTpl</u> can be a Function or a String class name of model template structure.   
	 */
	
	/**
	 * Root node ID, value = "root".
	 * Read-only.
	 * @property id
	 * @type {String}
	 */
	id : 'root',
	//TODO think a bit over about model Root node ID.
	//Maybe it can be optimized and be more flexibile, depends of Model future usage.
	
	/**
	 * Root node tag property, value = "root".
	 * @property tag
	 * @type {String}
	 */
	tag: 'root',
	
	properties : [
      	{name: "xmlns:i",  required: false},
		{name: "xmlns:xsi",  required: false},
		{name: "xsi:schemaLocation",  required: false},
      	{name: "type", required: true},
      	{name: "tabbed", required: false, type: Boolean},
      	{name: "module", required: false, type: String},
      	{name: "dynamic", value: false, required: false, type: Boolean}
	],
	
	/**
	 * Model Root node constructor.
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function(config) {
		afStudio.model.Root.superclass.constructor.call(this, config);
		
		this.initStructure(config.structureTpl);
		
		this.processStructure();
	},
	//eo constructor
	
	/**
	 * Initialized Model Root node {@link #structure}.
	 * @protected
	 * Template method. 
	 * @param {Function/String} strc The model structure
	 */
	initStructure : function(strc) {
		var mt = this.getModelType();
		
		if (strc) {
			//all structure templates should be located inside "afStudio.model.template" namespace.
			strc = Ext.isFunction(strc) ? strc : afStudio.model.template[strc];
		} else if (mt) {
			var sTpl = mt.ucfirst() + 'Template';
			strc = afStudio.model.template[sTpl];
		}
		/**
		 * Model Root node's structure @type {Function}
		 */
		this.structure = Ext.isFunction(strc) ? new strc() : undefined;
	},
	//eo initStructure
	
	/**
	 * Processes node structure based on {@link #structure}.
	 * @protected
	 * Template method.
	 */
	processStructure : function() {
		if (!this.structure) {
			return;
		}
		
		this.suspendEvents();
		this.structure.processStructure(this);
		this.resumeEvents();
	},
	//eo processStructure
	
	/**
	 * Returns Model's type.
	 * @return {String} type
	 */
	getModelType : function() {
		return this.getPropertyValue('type');
	},
	
	/**
	 * Returns model node by its ID.
	 * @param {String} nodeId The node ID value
	 * @return {Node} The found child or null if none was found
	 */
	getModelNode : function(nodeId) {
		return this.findChildById(nodeId, true);
	}
});