Ext.ns('afStudio.wd.edit');


afStudio.wd.edit.EditView = Ext.extend(Ext.Panel, {

	initComponent : function() {

		Ext.apply(this, {

//			layout : 'fit',

			items: [
			{
				xtype: 'platform.basement',
//				height: 800,
				items: [
				{
					columnWidth:.5,
					style: 'padding: 10px',
					items: [{html: 'A'}, {html: 'B'}]
				},{
					columnWidth:.5,
					style: 'padding: 10px',
					items: [{html: 'C'}]
				},{
					width: 80,
					style: 'padding: 10px'
				}]
			}],

			plugins: new Ext.ux.WidgetFieldDragZone()

		});

		afStudio.wd.edit.EditView.superclass.initComponent.apply(this, arguments);		
	}
	
});