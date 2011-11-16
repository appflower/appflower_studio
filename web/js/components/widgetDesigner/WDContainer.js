Ext.namespace('afStudio.wd');

/**
 * 
 * @class afStudio.wd.WidgetContainer
 * @extends Ext.Container
 * @author Nikolai Babinski
 */
afStudio.wd.WDContainer = Ext.extend(Ext.Container, {
	/**
	 * WD controller
	 * @cfg {ViewController} (required) controller
	 */	
	
	layout : 'border',
	
	/**
	 * Template method
	 * @override
	 * @private
	 */
	initComponent : function() {
	
		Ext.apply(this, {
			defaults: {
				margins: '5'
			},
			items: [
			{
				region: 'center',
				ref: 'widgetdesigner',
				xtype: 'widgetdesigner',
				controller: this.controller
			},{
				region: 'east',
				ref: 'filetree',
				xtype: 'filetreepanel',
				width: 280,
	            minWidth: 200,
	            split: true,
	            collapsible: true,
				cmargins: '5',
	        	title: 'Code Browser',
				url: afStudioWSUrls.getFiletreeUrl,
				rootText: 'Home',
				maxFileSize: 524288 * 2 * 10,
				autoScroll: true,
				enableProgress: false
			}]
		});
			
		afStudio.wd.WDContainer.superclass.initComponent.apply(this, arguments);
		
		//set up appropriate container
		this.filetree.fileCt = this.widgetdesigner;
	}
});

/**
 * @type 'wd'
 */
Ext.reg('wd', afStudio.wd.WDContainer);