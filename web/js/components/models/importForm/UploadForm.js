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
     * @cfg {String} 
     */
    
    /**
     * Uploading import file. 
     * @property importFile
     * @type {Ext.ux.form.FileUploadField}
     */
    /**
     * Container of additional fields required for import process. 
     * @property extraFields 
     * @type {Ext.Container}
     */
    
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
                ref: 'importFile',
                fieldLabel: 'Import file',
                emptyText: 'Select import file...',
                allowBlank: false,
                blankText: 'File is required',
                width: 400,
                name: 'file'
            },{
                xtype: 'displayfield',
                submitValue: false,
                html: 'Supported files: CSV, XLS, ODS, YML'
            },{
                xtype: 'container',
                ref: 'extraFields',
                anchor: '100% 90%',
                style: 'margin-top: 10px;',
                layout: 'card',
                //TODO implement switching
                activeItem: 1,
                defaults: {
                    layout: 'form',
                    border: false
                },
                items: [
                {
                    //CSV
                    items: [
                    {
                        xtype: 'checkbox',
                        fieldLabel: 'Use headers',
                        name: 'has_headers'
                    },{
                        xtype: 'combo',
                        store: [[',', ','], [';', ';'], [':', ':'], ['|', '|'], ['\t', 'horizontal tab (\\t)']],
                        mode: 'local',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: 'Delimeter',
                        value: ',',
                        hiddenName: 'delimeter',
                        name: 'delimeter'
                    },{
                        xtype: 'combo',
                        store: [[',', ','], ['', 'empty string ("")']],
                        mode: 'local',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: 'Enclosure',
                        value: '',
                        hiddenName: 'enclosure',
                        name: 'enclosure'
                    },{
                        xtype: 'common.modelscombo',
                        allowBlank: false
                    }]
                },{
                    //XLS and ODS
                    items: [
                    {
		                xtype: 'label',
		                html: '<u>Supported spreadsheets</u>: <i>MS Excel 2007 (xlsx), MS Excel 5, 95, 2000 (xls), OpeOffice Cals (ods)</i>'
                    },{
                        xtype: 'checkbox',
                        fieldLabel: 'Use headers',
                        name: 'has_headers'
                    },{
                        xtype: 'checkbox',
                        fieldLabel: 'Import raw values',
                        value: false,
                        name: 'raw'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Import selected worksheets',
                        width: 345,
                        name: 'worksheet',
                        plugins: [Ext.ux.plugins.HelpText], 
                        helpType: "comment",
                        helpText: 'All worksheets will be imported unless is not specified the list separated<br /> by commas, i.e. sheetA, sheetB'
                    },{
                        xtype: 'checkbox',
                        fieldLabel: 'Use worksheets as models',
                        name: 'worksheets_as_models'
                    },{
                        xtype: 'common.modelscombo'
                    }]
                }]
            }],
            buttons: [
            {
                text: 'Import',
                itemId: 'import',
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
        var f = this.importFile,
            ct = this.extraFields;
        
        console.log(f, ct);
        
        this.addEvents(
            /**
             * @event importfile Fires when file was successfully imported
             */
            'importfile'
        );
        
        f.on('fileselected', this.onFileSelected, this);
        
        afStudio.models.UploadForm.superclass.afterRender.call(this);
    },

    /**
     * Importing file {@link #importFile} <u>fileselected</u> event handler.
     * @param {Ext.ux.form.FileUploadField} fileCmp The file-upload component
     * @param {String} file The selected file's name
     */
    onFileSelected : function(fileCmp, file) {
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
     * Uploads and imports data file.
     * @protected
     */
    importData : function() {
    }
    
});

Ext.reg('import.uploadfile', afStudio.models.UploadForm);