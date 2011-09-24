Ext.ns('afStudio.definition');

/**
 * Base definition class.
 * @abstract
 * Should be used concrete class implementation.
 * 
 * @class afStudio.definition.DataDefinition
 * @extends Ext.util.Observable
 * @author Nikolai Babinski <niba@appflower.com>
 */
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
	 * Compares entity and passed in data, returns true if entity and data are equal. 
	 * @abstract
	 * @protected
	 * @param {Object} entity The entity
	 * @param {Mixed} obj The data.
	 * @return {Boolean}
	 */
	equal : function(entity, obj) {
	},
	
	/**
	 * Returns data.
	 * @public
	 * @return {Mixed} data
	 */
	getData : function() {
		return this.out(this.data);
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
	},

	/**
	 * Returns cloned passed in variable without keeping the old reference so having "safe" return.
	 * Returning properties/object from DataDefinition class should be safe and cannot be modified outside the class.
	 * @protected
	 * @param {Mixed} obj The variable to be returned safely without keeping the old reference
	 * @param {Boolean} (Optional) wrapBoolean Flag defines if boolean values should be converted to strings (defaults to false).
	 * @return {Object} cloned object
	 */
	out : function(obj, wrapBoolean) {
		return this.cloneObj(obj, wrapBoolean);
	},
	
	//TODO in ExtJS 4.* remove this method, instead should be used Ext.clone/Object.merge
  	/**
     * Clone almost any type of variable including array, object and Date without keeping the old reference
  	 * @private
     * @param {Mixed} item The variable to clone
     * @param {Boolean} (Optional) wrapBoolean Flag defines if boolean values should be converted to strings (defaults to false).
     * @return {Mixed} clone
     */
    cloneObj : function(item, wrapBoolean) {
        if (item === null || item === undefined) {
            return item;
        }

        var type = Object.prototype.toString.call(item);

        // Date
        if (type === '[object Date]') {
            return new Date(item.getTime());
        }

        var i, clone, key;

        // Array
        if (type === '[object Array]') {
            i = item.length;
            clone = [];
            while (i--) {
                clone[i] = this.cloneObj(item[i], wrapBoolean);
            }
        }
        // Object
        else if (type === '[object Object]' && item.constructor === Object) {
            clone = {};
            for (key in item) {
                clone[key] = this.cloneObj(item[key], wrapBoolean);
            }
        }

        //Boolean values converting to string
        if (wrapBoolean === true && Ext.isBoolean(item)) {
        	item = String(item);
        }
        
        return clone || item;
    }
    //eo clone
});