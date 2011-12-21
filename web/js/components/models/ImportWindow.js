Ext.ns('afStudio.models');

/**
 * Import window.
 * 
 * @class afStudio.models.ImportWindow
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.models.ImportWindow = Ext.extend(Ext.Window, {
    
    /**
     * @cfg {String} model The model name
     */

    /**
     * Initializes component.
     * @private
     * @return {Object} The configuration object
     */
    _beforeInitComponent : function() {
        
        this.importTab = this.createWindowItems();
        
        return {
            title: 'Import',
            iconCls: 'icon-model-import',
            closeAction: 'hide',
            modal: true,
            frame: true,
            width: 600,
            height: 400,
            resizable: false,
            
            layout: 'fit',
            
            items: [
                this.importTab
            ],
            buttons: [
            {
                text: 'Cancel',
                iconCls: 'afs-icon-cancel',
                scope: this,
                handler: this.cancelCreation
            }]          
        }
    },
    
    /**
     * Template method
     * @override
     * @private
     */
    initComponent : function() {
        Ext.apply(this, 
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );
        
        afStudio.models.ImportWindow.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * Method that is called immediately before the <code>show</code> event is fired.
     * @override
     * @protected
     */
    onShow : function() {
        var t = this.importTab;

        t.fixtures.reloadFixtures();
    },
    
    /**
     * @protected
     * @return {Object} this window inner components
     */
    createWindowItems : function() {
      
        var tp = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            defaults: {
                xtype: 'form',    
                monitorValid: true,
                anchor: '100%',
                padding: 5
            },
            items: [
            {
                title: 'Load Fixtures',
                layout: 'fit',
                items: [
                {
                    xtype: 'import.fixtures',
                    ref: '../fixtures',
                    
                    border: false
                }]
            },{
                title: 'Upload File',
                items: [
                {
                    xtype: 'fileuploadfield',
                    fieldLabel: 'Import file',
                    emptyText: 'select import file...',
                    allowBlank: false,
                    msgTarget: 'qtip',
                    width: 400,
                    name: 'file'
                }],
                buttons: [
                {
                    text: 'Import',
                    iconCls: 'icon-accept',
                    formBind: true
                }]
            }]
        });
        
        return tp;
    },
    
    /**
     * Closes this window.
     */
    closeWindow : function() {
        (this.closeAction == 'hide') ? this.hide() : this.close();
    },
    
    /**
     * "Cancel" button handler.
     */
    cancelCreation : function() {
        this.closeWindow();
    }
});