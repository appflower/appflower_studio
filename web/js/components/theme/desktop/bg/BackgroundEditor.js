Ext.ns('afStudio.theme.desktop');

/**
 * Desktop background editor.
 * 
 * @class afStudio.theme.desktop.BackgroundEditor
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.BackgroundEditor = Ext.extend(Ext.Window, { 
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    initComponent : function() {
        this.createContent();
        
        var config = {
            title: 'Background Editor', 
            layout: 'vbox',
            layoutConfig: {
                align: 'stretch',
                pack: 'start'                
            },
            width: 813,
            height: 550,
            modal: true,
            closable: true,
            draggable: true, 
            resizable: false,
            items: [
                this.wallpaper,
                this.bgtools
            ],
            tbar: [
            {
                text: 'Save', 
                iconCls: 'icon-save',
                scope: this,
                handler: this.save
            },'->',{
                text: 'Theme', 
                iconCls: 'icon-run-run',
                scope: this,
                handler: this.tdshortcut
            }],
            buttonAlign: 'center',
            buttons: [
            {
                text: 'Cancel',
                scope: this,
                handler: this.cancel
            }]
        };
                
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        
        afStudio.theme.desktop.BackgroundEditor.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * Method that is called immediately before the <code>show</code> event is fired.
     * @override
     * @protected
     */
    onShow : function() {
        this.bwrap.mask('loading...', 'x-mask-loading');
        
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: {
                cmd: 'getWallpapers'
            },
            scope: this,
            showNoteOnSuccess: false,
            run: function(response) {
//                console.log('response', response);
                
                this.wallpaper.store.loadData(response.data.list);
                
//                this.initShortCutsInspector(response.data);
                this.bwrap.unmask();
            },
            error: function() {
                this.bwrap.unmask();
            }
        });
    },
    
    /**
     * Init editor's layout.
     * @private
     */
    createContent : function() {
        var store = new Ext.data.JsonStore({
            fields: ['id', 'name', 'image'],
            data: []
        });        
        
        var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			    '<div class="thumb-wrap" id="{name}">',
			    '<div class="thumb"><img src="{image}" title="{name}"></div>',
			    '<span class="x-editable">{shortName}</span></div>',
			'</tpl>'
        );
        
        this.wallpaper = new Ext.DataView({
            store: store,
            tpl: tpl,
            flex: 1,
            autoScroll: true,
            singleSelect: true,
            cls: 'desktop-bg',
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No images to display',            
            
            prepareData: function(data) {
                data.shortName = Ext.util.Format.ellipsis(data.name, 15);
                return data;
            }
        });
        
        
        this.bgtools = new Ext.FormPanel({
            fileUpload: true,
            padding: 5,
            frame: true,
            items: [
            {
                xtype: 'colorfield',
                ref: 'bgcolor',
                fieldLabel: 'Background color',
                submitValue: false
            },{
                xtype: 'container',
                layout: 'column',
                items: [
                {
                    layout: 'form',
                    items: {
	                    xtype: 'fileuploadfield',
	                    fieldLabel: 'Upload image',
                        emptyText: 'Select an image',
                        allowBlank: false,
                        msgTarget: 'qtip',
	                    width: 400,
	                    name: 'wallpaper'
                    }                        
                },{
                    xtype: 'button',
                    text: 'Upload',
                    style: 'margin-left: 10px;',
                    scope: this,
                    handler: function() {
                        var f = this.bgtools.getForm();
                        
                        if (f.isValid()) {
                            f.submit({
	                            url: afStudioWSUrls.project,
                                params: {
                                    cms: 'uploadWallpaper'
                                },
	                            waitMsg: 'Uploading...',
                                submitEmptyText: false,
	                            success: function(form, action) {
                                    console.log(action);
	                            },
				                failure: function(form, action) {
				                    if (action.failureType === Ext.form.Action.CONNECT_FAILURE) {
                                        afStudio.Msg.error('File Upload', 
                                            String.format('Status: {0}: {1}', action.response.status, action.response.statusText));
				                    }
				                    if (action.failureType === Ext.form.Action.SERVER_INVALID) {
                                        var msg;
                                        try {
                                            msg = Ext.decode(action.response).message;
                                        } catch(e) {
                                            msg = action.response.responseText;
                                        }
                                        afStudio.Msg.error('File Upload', msg);
				                    }
				                }
                            });
                        }
                    }                        
                }]
            }]
        });
    },
    
    /**
     * Init main menu.
     * @protected
     * @param {Object} definition The main menu definition object
     */
    initShortCutsInspector : function(definition) {
        var def = {
            attributes: {
                type: 'shortcut'
            }
        };
        def.children = definition;

        this.controller = new afStudio.theme.desktop.shortcut.controller.ShortcutController({
            viewDefinition: def,
            listeners: {
                scope: this,
                
                ready: function(ctr) {
                    var ip = new afStudio.view.InspectorPalette({
                        controller: ctr
                    });
                    this.eastPanel.add(ip);
                    this.eastPanel.doLayout();
                }
            }
        });
        
        this.controller.run();
        
        afStudio.Logger.info('@shortcut controller', this.controller);
    },
    
    /**
     * Validates menu model and shows errors if any exists returning false otherwise returns true.
     * @protected
     * @return {Boolean}
     */
    validate : function() {
        var valid = this.controller.validateModel(),
            errors = [];
        
        if (valid !== true) {
            if (!this.errorWin) {
                this.errorWin = new afStudio.view.ModelErrorWindow({
                    title: 'Desktop Shortcuts'
                });
            }
            this.errorWin.modelErrors = {children: valid.children};
            this.errorWin.show();
            
            return false;
        }
        
        return true;
    },
    
    /**
     * Saves menu.
     */
    save : function() {
        if (this.validate() == false) {
            return;
        }
        
        var def = this.controller.root.fetchNodeDefinition();
        
        afStudio.Logger.info('@shortcut definition', def, Ext.encode(def.children));            
        
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: {
                cmd: 'saveHelper',
                key: 'links',
                content: Ext.encode(def.children)
            }
        });
    },
    
    /**
     * Closes active window.
     */
    cancel : function() {
        this.close();
    },
    
    /**
     * Template Designer shortcut 
     */
    tdshortcut : function() {
        this.close();
        (new afStudio.theme.ThemeDesigner()).show();
    }
});

/**
 * shortcut
 */
afStudio.theme.BackgroundEditor = afStudio.theme.desktop.BackgroundEditor;