Ext.namespace('afStudio.common');

/**
 * Widget location combobox.
 * 
 * @class afStudio.common.WidgetLocation
 * @extends Ext.ux.form.GroupingComboBox
 * @author Nikolai Babinski
 */
afStudio.common.WidgetLocation = Ext.extend(Ext.ux.form.GroupingComboBox, {

	/**
	 * @cfg {String} url The widget location url, defaults to {@link afStudioWSUrls.moduleGroupedUrl}
	 */
	url : afStudioWSUrls.moduleGroupedUrl,
	
	/**
	 * @cfg {String} locationType The location type, one of "app" or "plugin", defaults to "app"
	 */
	locationType : 'app',
	
	/**
	 * @cfg {Boolean} autoLoad The autoload flag, <tt>true</tt> means load locations list 
	 * just after the component is created, defaults to true
	 */
	autoLoad : true,
	
	valueField : 'value',
	
	displayField : 'text',
	
	groupField : 'group',
	
	allowBlank : false,
	
	emptyText : 'Please select widget location...',
	
	blankText : 'Widget location is required',
	
	msgTarget : 'qtip',
	
	mode : 'local',
	
	forceSelection : true,
	
    fieldLabel : 'Widget Location',
    
	loadingText : 'Please wait...',

	/**
	 * Template method.
	 * @override
	 * @private
	 */
	initComponent : function() {
		var storeFields = [this.valueField, this.displayField, this.groupField];
		
        this.store = new Ext.data.JsonStore({
            url: this.url,
        	autoLoad: this.autoLoad,
            baseParams: {
            	type: this.locationType
            },
            root: 'data',
            idProperty: this.valueField,
            fields: storeFields       	
        });
        
        afStudio.common.WidgetLocation.superclass.initComponent.call(this);
	}
});

Ext.reg('common.widgetlocation', afStudio.common.WidgetLocation);