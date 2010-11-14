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
			flex: 1,			
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
			bbar: {
				items: [
				'->',
				{
					text: 'Add Field',
					iconCls: 'icon-add'
				}]
			}
		});
		
		var propsGrid = new Ext.grid.PropertyGrid({	        
	        width: 300,
	        frame: true,
	        autoHeight: true,
	        propertyNames: {
	            tested: 'QA',
	            borderWidth: 'Border Width'
	        },
	        source: {
	            '(name)': 'Properties Grid',
	            grouping: false,
	            autoFitColumns: true,
	            productionQuality: false,
	            created: new Date(Date.parse('10/15/2006')),
	            tested: false,
	            version: 0.01,
	            borderWidth: 1
	        },
	        viewConfig : {
	            forceFit: true,
	            scrollOffset: 2 // the grid will never have scrollbars
	        }
    	});
		
		
		return {
			itemId: 'designer',	
			defaults: {
				style: 'padding:4px;'
			},
			items: [grid, propsGrid]
		}
	}// eo _initCmp
	
	,_initEvents : function() {
		var _this = this;				
	}// eo _initEvents
	
});

Ext.reg('afStudio.widgetDesigner.designer', N.DesignerTab);

delete N;