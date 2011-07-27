Ext.ns('afStudio.view.property');

/**
 * @class afStudio.wi.PropertyRecord
 * A specific {@link Ext.data.Record} type.
 * @constructor
 * @param {Object} config A data object in the format: 
 * {name: [name], value: [value], groupField: [groupField]}.  
 * The specified value's type will be read automatically by the grid to determine the type of editor to use when displaying it.
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
            groupField: 'required'
        });
        this.store.on('update', this.onUpdate,  this);
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
    
    // private
    onUpdate : function(ds, record, type) {
//        if (type == Ext.data.Record.EDIT) {
//            var v = record.data.value;
//            var oldValue = record.modified.value;
//            if (this.grid.fireEvent('beforepropertychange', this.source, record.id, v, oldValue) !== false) {
//                this.source[record.id] = v;
//                record.commit();
//                this.grid.fireEvent('propertychange', this.source, record.id, v, oldValue);
//            } else {
//                record.reject();
//            }
//        }
    },

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

    // private
    setValue : function(prop, value, create) {
//TODO set model property    	
//        var r = this.getRec(prop);
//        if (r) {
//            r.set('value', value);
//            this.source[prop] = value;
//        } else if(create) {
//            // only create if specified.
//            this.source[prop] = value;
//            r = new Ext.grid.PropertyRecord({name: prop, value: value}, prop);
//            this.store.add(r);
//
//        }
    },
    
    // private
    remove : function(prop) {
//        var r = this.getRec(prop);
//        if(r){
//            this.store.remove(r);
//            delete this.source[prop];
//        }
    }    
});
