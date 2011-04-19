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
			   vm = this.viewMeta,
		  columns = [];
		
		if (!Ext.isEmpty(vm['i:fields']['i:column'])) {
			var clm = vm['i:fields']['i:column'];
			
			if (Ext.isArray(clm)) {
				for (var i = 0; i < clm.length; i++) {
					var c = clm[i];			
					columns.push({
						header:   c.label,
						name:     c.name,
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
				
			} else {
				columns.push({
					header:    clm.label,
					name:      clm.name,
					width:     clm.width ? clm.width : this.columnWidth,
					hidden:    clm.hidden ? clm.hidden.boolean() : false,
					hideable:  clm.hideable ? clm.hideable.boolean() : true,
					fixed:     clm.resizable ? clm.resizable.boolean() : false					
				});				
				for (var i = 1; i <= this.maxColumns; i++) {
					columns.push({
						header: this.columnName,
						width: this.columnWidth,
						hidden: true,
						uninit: true
					});
				}				
			}
		}

		var store = new Ext.data.ArrayStore({
			idIndex: 0,
			data: [[]],
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
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.on({
			scope: _this,
			afterrender: function() {
				
				this.on({
					scope: this,
					columnmove: function(oldIndex, newIndex) {
						if (oldIndex != newIndex) {
							var clmName = this.getColumnModel().config[newIndex].name;
							
							var t = Ext.getCmp('wd-inspector-tree');
							var fn = t.getRootNode().getFieldsNode();
							
							if (fn && fn.findChild('text', clmName)) {
								if (oldIndex > newIndex) {
									fn.childIdsOrdered.dragUp(oldIndex, newIndex);
								} else {
									fn.childIdsOrdered.dragDown(oldIndex, newIndex);
								}
							}
							
							var definition = t.getRootNode().dumpDataForWidgetDefinition();
							
							var wdef = new afStudio.wd.WidgetDefinition({
								widgetUri: this.widgetUri,
								widgetType: this.viewMeta.type
							});
							wdef.saveDefinition(definition);
						}
					}
				});
				
				
			},
			contextmenu: function(e) {
				e.preventDefault();
			}
		});
		
	}//eo _afterInitComponent
});

/**
 * @type 'afStudio.wd.list.simpleListView'
 */
Ext.reg('afStudio.wd.list.simpleListView', afStudio.wd.list.SimpleListView);