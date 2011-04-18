Ext.ns('afStudio.wd.list');

/**
 * SimpleListView
 * 
 * @class afStudio.wd.list.SimpleListView
 * @extends Ext.grid.GridPanel
 * @author Nikolai
 */
afStudio.wd.list.SimpleListView = Ext.extend(Ext.grid.GridPanel, {
	
	/**
	 * @cfg {Object} viewMeta
	 * View metadata object.
	 */
	
	/**
	 * @cfg {String} columnName (defaults to "NewColumn")
	 * Default column name text. 
	 */
	columnName : 'NewColumn'	
	
	/**
	 * @cfg {Number} columnWidth (defaults to 80)
	 * Default column width.
	 */
	,columnWidth : 80
	
	/**
	 * @cfg {Number} maxColumns (defaults to 20)
	 * The number of maximum columns the view can handle. 
	 */
	,maxColumns : 30
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this,
			   vm = this.viewMeta;
	
		if (!Ext.isEmpty(vm['i:fields']['i:column'])) {
			var clm = vm['i:fields']['i:column'];
			
			var columns = [];
			
			for (var i = 0; i < clm.length; i++) {
				var c = clm[i];				
				columns.push({
					header:   c.label,
					width:    c.width ? c.width : this.columnWidth,
					hidden:   c.hidden ? c.hidden.boolean() : false,
					hideable: c.hideable ? c.hideable.boolean() : true,
					fixed:    c.resizable ? c.resizable.boolean() : false
				});				
			}
			for (var i = columns.length - 1; i <= this.maxColumns; i++) {
				columns.push({
					header: this.columnName,
					width: this.columnWidth,
					hidden: true,
					uninit: true
				});
			}
		}

		var store = new Ext.data.ArrayStore({
			idIndex: 0,
			data: [],
			fields: []
		});

		
		return {
			title: vm['i:title'],
	        store: store,      
			columns: columns,
	        view: new afStudio.wd.list.ListGridView(),
	        columnLines: true
		};
		
	}//eo _beforeInitComponent	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wd.list.SimpleListView.superclass.initComponent.apply(this, arguments);
	}//eo initComponent		
});

/**
 * @type 'afStudio.wd.list.simpleListView'
 */
Ext.reg('afStudio.wd.list.simpleListView', afStudio.wd.list.SimpleListView);