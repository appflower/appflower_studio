Ext.namespace('afStudio.common');

/**
 * Simple Model's fields grid. 
 * The list contains 3 columns: name, type, size.
 * 
 * @class afStudio.common.ModelFieldsGrid
 * @extends Ext.grid.GridPanel
 * @author Nikolai Babinski
 */
afStudio.common.ModelFieldsGrid = Ext.extend(Ext.grid.GridPanel, {

	/**
	 * Store required parameters: "schema" and "model"
	 */

	/**
	 * @cfg {String} url 
	 */
	url : afStudioWSUrls.modelListUrl,
	
	/**
	 * @cfg {Boolean} autoLoadData 
	 */
	autoLoadData : false,

	/**
	 * @cfg {Boolean} multiSelect 
	 */
	multiSelect : false,
	
	loadMask : true,
	
	border : false,
	
	autoScroll : true,
	
	autoExpandColumn : 'name',
	
	/**
	 * Initializes component.
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var me = this;
		
		var store = new Ext.data.JsonStore({
			url: me.url,
			autoLoad: me.autoLoadData,				
			baseParams: {
				xaction: 'read'
			},
			root: 'data',
			idProperty: 'id',    							
			fields: ['id', 'name', 'type', 'size', 'required']
		});
		
		var clms = [
			{header: 'Name', id: 'name', sortable: true, dataIndex: 'name'},
			{header: 'Type', width: 110, sortable: true, align: 'center', dataIndex: 'type'},
			{header: 'Size', width: 44, sortable: true, align: 'right', dataIndex: 'size'}
		];
		
		var sm = null;
		if (me.multiSelect === true) {
			sm = new Ext.grid.CheckboxSelectionModel();
			clms.unshift(sm);
		} else {
			sm = new Ext.grid.RowSelectionModel({singleSelect: true});
		}
		
		return {
			store: store,
			selModel: sm,
			columns: clms
		};
	},
	
	/**
	 * Template method.
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		
		afStudio.common.ModelFieldsGrid.superclass.initComponent.call(this);
	}
});

Ext.reg('common.mfieldsgrid', afStudio.common.ModelFieldsGrid);