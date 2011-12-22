Ext.ns('afStudio.models');

/**
 * Upload import form.
 * 
 * @class afStudio.models.UploadForm
 * @extends Ext.FormPanel
 * @author Nikolai Babinski
 */
afStudio.models.UploadForm = Ext.extend(Ext.FormPanel, {

    /**
     * @cfg {String} url The base import url
     */
    url : afStudioWSUrls.modelListUrl,
    
    /**
     * Initializes component.
     * @private
     * @return {Object} The configuration object
     */
    _beforeInitComponent : function() {

        return {
            monitorValid: true,
            items: [
            {
                xtype: 'fileuploadfield',
                fieldLabel: 'Import file',
                emptyText: 'Select import file...',
                allowBlank: false,
                blankText: 'File is required',
                width: 400,
                name: 'file'
            }],
            buttons: [
            {
                text: 'Import',
                iconCls: 'icon-accept',
                formBind: true,
                scope: this,
                handler: ''
            }]
        };
    },
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    initComponent : function() {
        Ext.apply(this, 
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );
        
        afStudio.models.UploadForm.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    afterRender : function() {
//        var fSm = this.fixturesGrid.getSelectionModel(),
//            fStore = this.fixturesGrid.getStore();
//        
//        this.addEvents(
//            /**
//             * @event importfixtures Fires when fixtures were successfully imported
//             * @param {Array} fixtures The fixtures which were imported
//             */
//            'importfixtures'
//        );
//        
//        fSm.on('selectionchange', function(){
//            var importBtn = this.getImportButton();
//            fSm.hasSelection() ? importBtn.enable() : importBtn.disable();
//        }, this);
//        
//        if (this.autoLoadFixtures === true) {
//            fStore.load();
//        }
        
        afStudio.models.UploadForm.superclass.afterRender.call(this);
    },

    /**
     * Returns import button.
     * @return {Ext.Button} import button
     */
    getImportButton : function() {
        var fbar = this.getFooterToolbar();

        return fbar.getComponent('import');  
    },
    
    /**
     * Imports fixtures files.
     * @protected
     */
    importFixtures : function() {
        var fSm = this.fixturesGrid.getSelectionModel(),
            recs = fSm.getSelections(),
            append = this.appendChbox.getValue(),
            files = [];
        
        afStudio.xhr.executeAction({
            url: this.url,
            params: {
                cmd: 'importData',
                append: append
            },
            //mask: "Importing...",
            scope: this,
            run: function(response, opts) {
                
                this.fireEvent('importfixtures', opts.params.remote_files);
            }
        });
    }
    
});

Ext.reg('import.uploadfile', afStudio.models.UploadForm);