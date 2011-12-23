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
     * @cfg {String} model The current model name.
     */
    
    /**
     * @cfg {String} fileTypeInvalidText The invalid import file type text,
     * defaults to "Invalid file type. Must be one of *.csv *.xls *.ods *.yml types."
     */
    fileTypeInvalidText : 'Invalid file type. Must be one of *.csv *.xls *.ods *.yml types.',

    YML_TYPE : 'yml',
    
    CSV_TYPE : 'csv',
    
    XLS_TYPE : 'xls',
    
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
        var me = this;
        
        if (!this.fileTypes) {
		    this.fileTypes = {
		        yml:  me.YML_TYPE,
		        yaml: me.YML_TYPE,
		        csv:  me.CSV_TYPE,
		        xlsx: me.XLS_TYPE,
		        xls:  me.XLS_TYPE,
		        ods:  me.XLS_TYPE    
		    };
        }
        
        return {
            fileUpload: true,
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
                xtype: 'checkbox',
                fieldLabel: 'Append',
                name: 'append'
            },{
                xtype: 'container',
                ref: 'extraFields',
                anchor: '100% 90%',
                style: 'margin-top: 10px;',
                layout: 'card',
                layoutConfig: {
                    deferredRender: true
                },
                defaults: {
                    layout: 'form',
                    border: false
                },
                items: [
                {
                    itemId: me.CSV_TYPE,
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
                        store: [["'", "'"], ['"', '"']],
                        mode: 'local',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: 'Enclosure',
                        value: '"',
                        hiddenName: 'enclosure',
                        name: 'enclosure'
                    },{
                        xtype: 'common.modelscombo',
                        allowBlank: false,
                        value: me.model,
                        model: 'model',
                        hiddenName: 'model'
                    }]
                },{
                    itemId: me.XLS_TYPE,
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
                        value: false,
                        name: 'worksheets_as_models'
                    },{
                        xtype: 'common.modelscombo',
                        allowBlank: false,
                        value: me.model,
                        model: 'model',
                        hiddenName: 'model'
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
                handler: this.importData
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
            ct = this.extraFields,
            msheet = ct.find('name', 'worksheets_as_models')[0];
        
        this.addEvents(
            /**
             * @event importfile Fires when file was successfully imported
             */
            'importfile'
        );
        
        //upload file
        f.on('fileselected', this.onFileSelected, this);
        
        //worksheets_as_models
        msheet.on('check', function(cb, checked){
            var m = cb.nextSibling();
            
            if (checked) {
                m.setDisabled(true);
                m.hide();
            } else {
                m.setDisabled(false);
                m.show();
            }
        });
        
        afStudio.models.UploadForm.superclass.afterRender.call(this);
    },

    /**
     * Importing file {@link #importFile} <u>fileselected</u> event handler.
     * @param {Ext.ux.form.FileUploadField} fileCmp The file-upload component
     * @param {String} file The selected file's name
     */
    onFileSelected : function(fileCmp, file) {
        var ext = this.getFileExtension(file);
        
        if (ext == null || !this.fileTypes[ext]) {
            afStudio.Msg.warning('Import File', this.fileTypeInvalidText);
            fileCmp.reset();
            return;
        }
        
        this.showExtraFields(this.fileTypes[ext]);
    },
    
    /**
     * Returns file extension by file name.
     * If file has no extension returns null. 
     * @protected
     * @param {String} file The file name
     * @return {String} file extension
     */
    getFileExtension : function(file) {
        if (!Ext.isString(file)) {
            return null;
        }
        var ext = /\.(\w+)$/.exec(file);
        
        return ext ? ext[1] : null;
    }, 
    
    /**
     * Shows additional parameters required for import.
     * @param {String} type The file type
     */
    showExtraFields : function(type) {
        var flsBlock = this.extraFields.getComponent(type),
            l = this.extraFields.layout;
        
        if (flsBlock) {
            if (l.activeItem) {
                this.switchFieldsBlock(l.activeItem, false);
            }
            this.extraFields.layout.setActiveItem(type);
            this.switchFieldsBlock(l.activeItem);
        } else {
            if (l.activeItem) {
                this.switchFieldsBlock(l.activeItem, false);
	            l.activeItem.hide();
	            l.activeItem = null;
            }
        }
    },
    
    /**
     * Turns on/off fields from specified container.
     * Fields are disabled/enabled and reset based on "on" parameter.
     * @protected
     * @param {Ext.Container} block The fields block being switched
     * @param {Boolean} on The switch turn on/off, default is true
     */
    switchFieldsBlock : function(block, on) {
        on = !Ext.isDefined(on) ? true : on;
        
        var fls = block.findByType('field');
        
        Ext.each(fls, function(f){
            f.setDisabled(!on);
            f.reset();
        });
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
        var form = this.getForm();
        
        form.submit({
            url: this.url,
            params: {
                cmd: 'importData'
            },
            scope: this,
            waitMsg: 'Importing...',
            success: function(form, action) {
                var res = action.result;
                if (res.success) {
                     this.fireEvent('importfile');
                }
            },
            failure: function(form, action) {
                var msgTitle = 'Import File';
                
                if (action.failureType === Ext.form.Action.CONNECT_FAILURE) {
                    afStudio.Msg.error(msgTitle, 
                        String.format('Status: {0}: {1}', action.response.status, action.response.statusText));
                }
                if (action.failureType === Ext.form.Action.SERVER_INVALID) {
                    var res = Ext.util.Format.stripTags(action.response.responseText),
                        msg;
                    try {
                        msg = Ext.decode(res).message;
                        afStudio.Msg.warning(msgTitle, msg);
                    } catch(e) {
                        msg = action.response.responseText;
                        afStudio.Msg.error(msgTitle, msg);
                    }
                }
            }
        });
    }
    //eo importData
});

Ext.reg('import.uploadfile', afStudio.models.UploadForm);