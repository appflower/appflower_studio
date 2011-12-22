Ext.namespace('afStudio.common');

/**
 * ModelsComboBox lists all available models.
 * 
 * @class afStudio.common.ModelsComboBox
 * @extends Ext.form.ComboBox
 * @author Nikolai Babinski
 */
afStudio.common.ModelsComboBox = Ext.extend(Ext.form.ComboBox, {
    /**
     * @cfg {String} url The models list url, defaults to {@link afStudioWSUrls.modelListUrl}
     */
    url : afStudioWSUrls.modelListUrl,
    
    /**
     * @cfg {Boolean} autoLoad The autoload flag, <tt>true</tt> means load models list 
     * just after the component is created, defaults to true
     */
    autoLoad : true,
    
    /**
     * @cfg {String} valueField
     */
    valueField : 'text',
    
    /**
     * @cfg {String} displayField
     */
    displayField : 'text',

    typeAhead : true,
    
    emptyText : 'Select model...',
    
    blankText : 'Model is required',
    
    msgTarget : 'qtip',
    
    mode : 'local',
    
    forceSelection : true,
    
    fieldLabel : 'Model',
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    initComponent : function() {
        var storeFields = [
            this.valueField, this.displayField 
        ];
        
        var storeBaseParams = {
            cmd: 'get'
        };
        
        this.store = new Ext.data.JsonStore({
            url: this.url,
            autoLoad: this.autoLoad,
            baseParams: storeBaseParams,
            idProperty: this.valueField,
            fields: storeFields,
            sortInfo: {
                field: this.displayField,
                direction: 'ASC'
            }
        });
        
        afStudio.common.ModelsComboBox.superclass.initComponent.apply(this, arguments);
    }
    
});

Ext.reg('common.modelscombo', afStudio.common.ModelsComboBox);