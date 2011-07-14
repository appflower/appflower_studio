Ext.ns('afStudio.definition');

afStudio.definition.DataDefinition = Ext.extend(Ext.util.Observable, {
	
	/**
	 * The definition's data/content holder.
	 * @property data
	 * @type {Mixed}
	 */
	data : null,
	
	constructor : function(config) {
		config = config || {};
		
		this.data = config.data || null;
		
		this.addEvents(
			/**
			 * @event entityRemove
			 * Fires when an entity was removed
			 * @param {Object} entity being removed
			 */
			'entityRemove',
			/**
			 * @event entityAdd
			 * Fires when a new entity being added
			 * @param {Object} entity just added 
			 */
			'entityAdd'
		);
		
		this.listeners = config.listeners;
		
		afStudio.definition.DataDefinition.superclass.constructor.call(this);
	},

	/**
	 * @abstract
	 * @public
	 */
	getEntity : Ext.emptyFn,
	
	/**
	 * @abstract
	 * @public
	 */
	removeEntity : Ext.emptyFn,
	
	/**
	 * @abstract
	 * @public 
	 */
	addEntity : Ext.emptyFn,
	
	/**
	 * Returns data.
	 * @public
	 * @return {Mixed} data
	 */
	getData : function() {
		return this.data;
	},
	
	/**
	 * Sets data.
	 * @public
	 * @param {Mixed} d
	 * @return {Object} this definition object.
	 */
	setData : function(d) {
		this.data = d;
		
		return this;
	}
});