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
	 * @cfg {Object} readerCfg.fields (required) The reader's fields.
	 * 
	 * @cfg {Object} readerCfg The {@link Ext.data.JsonReader} configuration object.
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
        delete config.readerCfg;
		
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
	}
	//eo onBeforewrite
});
