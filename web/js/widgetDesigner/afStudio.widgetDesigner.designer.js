Ext.namespace('afStudio.widgetDesigner');

N = afStudio.widgetDesigner;

/**
 * Designer Tab Container
 * @class afStudio.widgetDesigner.DesignerTab
 * @extends Ext.Container
 */
N.DesignerTab = Ext.extend(Ext.Container, {
	
	layout: 'hbox',
	layoutConfig: {
	    align: 'stretch',
	    pack: 'start'
	},
	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));		
		afStudio.widgetDesigner.DesignerTab.superclass.initComponent.apply(this, arguments);		
		this._initEvents();
	}	
	
	/**
	 * Initialises component
	 * @return {Object} the component initial literal
	 * @private
	 */
	,_initCmp : function() {
		
		//Simple grid
		var grid = new Ext.grid.GridPanel({			
			flex: 3,			
			frame: true,
			border: true,
			autoScroll: true,
			store: new Ext.data.JsonStore({
				root: 'data',
				fields: ['field', 'group']
			}),			
			columns: [
				{header: 'Field', dataIndex: 'field'},
				{header: 'Group', dataIndex: 'group'}
			],
			viewConfig: {
				forceFit: true
			},
			tbar: {
				items: [
					{text: 'Save', iconCls: 'icon-save'},
					{xtype: 'tbseparator'},
					{text: 'Add Field', iconCls: 'icon-add'},
					{xtype: 'tbseparator'},
					{text: 'Preview', iconCls: 'icon-preview', handler: function(){alert('Preview button clicked')}}					
				]
			}
		});
		
		return {
			itemId: 'designer',	
			defaults: {
				style: 'padding:4px;'
			},
			items: [
				grid, 
				{
					xtype: 'panel', flex: 1, layout: 'fit',
					items: [
						{xtype: 'afStudio.widgetDesigner.inspector'}
					]
				}
			]
		}
	},
	
	_initEvents : function() {
		var _this = this;				
	}// eo _initEvents
	
});

Ext.reg('afStudio.widgetDesigner.designer', N.DesignerTab);

delete N;