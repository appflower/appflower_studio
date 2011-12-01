Ext.ns('afStudio.models');

/**
 * @class afStudio.models.ModelStore
 * @extends Ext.data.Store
 * @author Nikolai Babinski
 */
afStudio.models.ModelStore = Ext.extend(Ext.data.Store, {

	/**
	 * @cfg {Boolean} autoSave
	 */
	autoSave : false,
	
	/** 
	 * @cfg {Object} readerCfg The {@link Ext.data.JsonReader} configuration object.
	 */
	/**
	 * @cfg {Object} readerCfg.fields (required) The reader's fields.
	 */
	/**
	 * @cfg {Object} writerCfg The {@link Ext.data.JsonWriter} configuration object.
	 */
	 
	/**
	 * @constructor
	 * @param {Object} config The configuration object
	 */
	constructor : function(config) {
		config = config || {};
		
		/**
		 * @property proxy The store proxy 
		 */
		this.proxy = config.proxy;
		delete config.proxy;
        
		/**
		 * @property readerCfg The reader configuration object
		 */
		this.readerCfg = Ext.applyIf(config.readerCfg || {}, {
        	root: 'data'
        });
        delete config.readerCfg;
        
		this.reader = new Ext.data.JsonReader(this.readerCfg);

		/**
		 * @property writerCfg The writer configuration object
		 */
		this.writerCfg = Ext.applyIf(config.writerCfg || {}, {
        	listful: true
        });
        delete config.writerCfg;
		
        this.writer = new Ext.data.JsonWriter(this.writerCfg),
        
		afStudio.models.ModelStore.superclass.constructor.call(this, config);
		
		this.initStoreEvents();
	},
	
	/**
	 * @protected
	 */
	initStoreEvents : function() {
		this.on({
			scope: this,
			
			load: this.onLoad,
			beforewrite: this.onBeforewrite
		});
	},
	
	/**
	 * Store <u>load</u> event listener. Details {@link Ext.data.Store#load}.
	 * @private
	 */
	onLoad : function(store, records) {
		var rs = [new this.recordType()];
		this.add(rs);
	},
	
	/**
	 * Store <u>beforewrite</u> event listener. Details {@link Ext.data.Store#beforewrite}.
	 */
	onBeforewrite : function(store, action, records, opts) {
		//only for create
		if (action == Ext.data.Api.actions.create) {
			var empRec = [];
			Ext.each(records, function(r, idx) {
				var emp = true;
				for (var p in r.data) {
					emp = false; 
					break;
				}
				if (emp) {
					empRec.push(idx);
				}
			});
			
			Ext.each(empRec, function(i){
				records.splice(i, 1);
			});
			
			if (Ext.isEmpty(records)) {
				return false;
			}
		}
	},
	
	/**
	 * Details {@link Ext.data.Store#save}.
	 * Override is needed to send create records in direct order - the order in which they were added.
	 * @override
	 */
    save : function() {
        if (!this.writer) {
            throw new Ext.data.Store.Error('writer-undefined');
        }

        var queue = [],
            len,
            trans,
            batch,
            data = {},
            i;
        // DESTROY:  First check for removed records.  Records in this.removed are guaranteed non-phantoms.  @see Store#remove
        if (this.removed.length) {
            queue.push(['destroy', this.removed]);
        }

        // Check for modified records. Use a copy so Store#rejectChanges will work if server returns error.
        var rs = [].concat(this.getModifiedRecords());
        if (rs.length) {
            // CREATE:  Next check for phantoms within rs.  splice-off and execute create.
            var phantoms = [];
            
            for (i = 0; i < rs.length; i++) {
                if (rs[i].phantom === true) {
                    var rec = rs.splice(i, 1).shift();
                    i--; //index correction after removal
                    
                    if (rec.isValid()) {
                        phantoms.push(rec);
                    }
                } else if (!rs[i].isValid()) { // <-- while we're here, splice-off any !isValid real records
                    rs.splice(i, 1);
                    i--;
                }
            }
            
            // If we have valid phantoms, create them...
            if(phantoms.length){
                queue.push(['create', phantoms]);
            }

            // UPDATE:  And finally, if we're still here after splicing-off phantoms and !isValid real records, update the rest...
            if(rs.length){
                queue.push(['update', rs]);
            }
        }
        
        len = queue.length;
        if (len) {
            batch = ++this.batchCounter;
            for (i = 0; i < len; ++i) {
                trans = queue[i];
                data[trans[0]] = trans[1];
            }
            if (this.fireEvent('beforesave', this, data) !== false) {
                for (i = 0; i < len; ++i) {
                    trans = queue[i];
                    this.doTransaction(trans[0], trans[1], batch);
                }
                return batch;
            }
        }
        
        return -1;
    }	
});