Ext.ns('afStudio.view.property');

/**
 * @class afStudio.view.property.PropertyRecord
 * A specific {@link Ext.data.Record} type.
 * @constructor
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.property.PropertyRecord = Ext.data.Record.create([
    {name: 'name', type: 'string'},
    'value',
    'type',
    'required',
    'defaultValue'
]);

/**
 * @class afStudio.view.property.PropertyStore
 * @extends Ext.grid.PropertyStore
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.property.PropertyStore = Ext.extend(Ext.grid.PropertyStore, {

	/**
	 * @constructor
	 * @param {Ext.grid.Grid} grid The grid this store will be bound to
	 * @param {Object} source The source data config object
	 */
    constructor : function(grid, source) {
        this.grid = grid;
        //TODO make it customizable
        this.store = new Ext.data.GroupingStore({
            recordType: afStudio.view.property.PropertyRecord,
            groupDir: 'DESC',
            groupField: 'required'
        });
        if (source) {
            this.setSource(source);
        }
        Ext.util.Observable.constructor.call(this);
    },
    
    /**
     * @override
     * @param {Object} o The source object
     */
    setSource : function(o) {
        this.source = o;
        this.store.removeAll();
        var data = [];
        for (var k in o) {
            if (this.isEditableProperty(o[k])) {
                data.push(new afStudio.view.property.PropertyRecord(o[k], k));
            }
        }
        this.store.loadRecords({records: data}, {}, true);
    },
    //eo setSource

    /**
     * Checks if property can be edit inside property grid
     * @param {Object} property The property
     * @protected
     * @return {Boolean}
     */
    isEditableProperty : function(property) {
    	var types = afStudio.model.Types,
    		pt = property.type;
    		
		if (pt) {
			if (Ext.isString(pt) && types.getType(pt)) {
				return true;
			} else if (Ext.isObject(pt)) {
				return types.getType(pt.type) ? true : false;
			}
		}
        
		return false;
    },
    //eo isEditableProperty

    /**
     * Sets property's value.
     * @protected
     * @param {String} prop The property 
     * @param {Mixed} value The value being set
     */
    setValue : function(prop, value) {
        var r = this.getRec(prop);
        if (r) {
            r.set('value', value);
            r.commit();
            this.source[prop].value = value;
        }
    }
});