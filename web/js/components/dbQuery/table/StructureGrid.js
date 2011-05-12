Ext.ns('afStudio.dbQuery');

afStudio.dbQuery.StructureGrid = Ext.extend(Ext.grid.GridPanel, {
	/**
	 * @cfg {Object} metaData required
	 * The metaData object contains model's structure
	 */	
	
	/**
	 * @cfg {String} model required
	 * This model name
	 */
	
	/**
	 * @cfg {String} schema required
	 * This model's schema name
	 */
	
	/**
	 * @cfg {String} storeDataUrl required
	 * Data fetching URL
	 */

	/**
	 * Loads metadata inside grid
	 * @param {Object} data
	 */
	loadModelData : function(data) {
		this.getStore().loadData(data);
	}
	
	,booleanRenderer : function(v, p, record) {
	    p.css += ' x-grid3-check-col-td'; 
	    return '<div class="x-grid3-check-col' + (v ? '-on' : '') + '"> </div>';
	}	
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this,
			store,
			columnModel;
		
		function keyConverter(v, rec) {
			return rec.primaryKey ? 'primary' : (rec.index == 'unique' ? 'unique' : (rec.index ? 'index' : null));
		}		
		function relationConverter(v, rec) {
			return (rec.foreignModel && rec.foreignReference) ? rec.foreignModel + '.' + rec.foreignReference : null;
		}
		
		store = new Ext.data.JsonStore({			
			url: _this.storeDataUrl,
			autoLoad: false,
		    baseParams: {
		    	xaction: 'read',
		    	model: _this.model,
		    	schema: _this.schema
		    },
		    idProperty: 'id',
		    fields: [		    
				{name: 'id'},
				{name: 'key', mapping: 'id', convert: keyConverter}, //fake field
				{name: 'relation', mapping: 'id', convert: relationConverter}, //fake field 
				{name: 'autoIncrement'},
				{name: 'primaryKey'},
				{name: 'index'},
			    {name: 'name'},
			    {name: 'type'},
			    {name: 'size'},
			    {name: 'required'},			    
			    {name: 'default'},
			    {name: 'foreignTable'},
			    {name: 'foreignModel'},
			    {name: 'foreignReference'},
			    {name: 'onDelete'}
		    ]
		});		
				
		columnModel = new Ext.grid.ColumnModel({
			defaults: {
				sortable: true
			},
			columns: [
			{	//Key				
				header: '<div class="model-pk-hd">&#160;</div>', 
				width: 25, 
				dataIndex: 'key',					
				renderer : function(value, metaData, record, rowIndex, colIndex, store) {
					var html = '';
					switch(value) {
						case 'primary': html = '<div class="pk-cell">&#160;</div>';	    break;
						case 'index':	html = '<div class="index-cell">&#160;</div>';	break;
						case 'unique':	html = '<div class="unique-cell">&#160;</div>';	break;
					};
					return  html;
				}
			},{
				header: "Name",
				width: 100,
				dataIndex: 'name'
			},{
				header: "Type",
				width: 100,
				dataIndex: 'type'
			},{
				header: "Size",
				width: 50,
				dataIndex: 'size'
			},{
				header: "Autoincrement",
				width: 55,
				dataIndex: 'autoIncrement',
				renderer: _this.booleanRenderer
			},{
				header: "Default value",
				width: 100,
				dataIndex: 'default'
			},{
				header: "Relation",
				width: 150,
				sortable: true,
				dataIndex: 'relation'
			},{
				header: "Required",
				width: 50,
				sortable: true,
				dataIndex: 'required',
				align: 'center',
				renderer: _this.booleanRenderer
			},{
				header: "On Delete",
				width: 50,
				sortable: true,
				dataIndex: 'onDelete',
				align: 'center'
			}]
		});
		
		return {			
			title: 'Structure',
			iconCls: 'icon-table-gear',
	        store: store,
	        colModel: columnModel,
	        columnLines: true,
			loadMask: true,
	        autoScroll: true,
	        viewConfig: {
	            forceFit: true
	        }
		}
	}//eo _beforeInitComponent
	 
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.dbQuery.StructureGrid.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this,
			store = _this.getStore(),
			   cm = _this.getColumnModel();
		
		//Load Model structure
		_this.loadModelData(_this.metaData);
		
	}//eo _afterInitComponent
	
}); 

/**
 * @type 'afStudio.dbQuery.structureGrid'
 */
Ext.reg('afStudio.dbQuery.structureGrid', afStudio.dbQuery.StructureGrid);