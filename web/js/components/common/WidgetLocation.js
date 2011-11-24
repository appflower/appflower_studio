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
	 * @cfg {String} locationType The location type 
	 * One of "app" or "plugin" to get applications or plugins modules correspondingly.
	 * To fetch all locations - combined apps and plugins locationType should be <tt>undefined</tt>.
	 * By default locationType is undefined.
	 */
	
	/**
	 * @cfg {Boolean} autoLoad The autoload flag, <tt>true</tt> means load locations list 
	 * just after the component is created, defaults to true
	 */
	autoLoad : true,
	
	/**
	 * @cfg {String} groupField The grouping field, defaults to "group"
	 */
	groupField : 'group',
	
	/**
	 * @cfg {String} typeField The location type field, defaults to "type"
	 */
	typeField : 'type',
	
	/**
	 * @cfg {String} valueField
	 */
	valueField : 'value',
	
	/**
	 * @cfg {String} displayField
	 */
	displayField : 'text',
	
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
		var storeFields = [
			this.valueField, this.displayField, 
			this.groupField, this.typeField
		];
		
		var storeBaseParams = {};
		if (Ext.isDefined(this.locationType)) {
			storeBaseParams.type = this.locationType;
		}
		
        this.store = new Ext.data.JsonStore({
            url: this.url,
        	autoLoad: this.autoLoad,
            baseParams: storeBaseParams,
            root: 'data',
            idProperty: this.valueField,
            fields: storeFields,
			sortInfo: {
			    field: this.typeField ? this.typeField : this.groupField,
			    direction: 'ASC'
			}
        });
        
        afStudio.common.WidgetLocation.superclass.initComponent.call(this);
	}
});

Ext.reg('common.widgetlocation', afStudio.common.WidgetLocation);