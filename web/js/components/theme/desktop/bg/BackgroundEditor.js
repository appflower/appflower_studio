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
     * @property wallpaper The background wallpapers container
     * @type {Ext.DataView}
     */
    /**
     * @property bgtools Background tools form panel
     * @type {Ext.FormPanel}
     */
    
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
        this.fetchBackgroundData(function(res){
            var d = res.data;
            
            this.wallpaper.store.loadData(d.list);
            this.selectWallpaper(d.active_image);
            this.bgtools.bgcolor.setValue(d.active_color);
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
			    '<div class="thumb-wrap" id="{image}">',
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
                    handler: this.uploadWallpaper                
                }]
            }]
        });
    },
    
    /**
     * Selects wallpaper image inside {@link #wallpaper} container
     * @param {String} img The image path bing selected
     */
    selectWallpaper : function(img) {
        this.wallpaper.select(img);
    },
    
    /**
     * Fetches background data.
     * @param {Function} clb The function being called when data was fetched 
     */
    fetchBackgroundData : function(clb) {
        if (!Ext.isFunction(clb)) {
            return;
        }
            
        this.wallpaper.el.mask('loading...', 'x-mask-loading');
        
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: {
                cmd: 'getWallpapers'
            },
            scope: this,
            showNoteOnSuccess: false,
            run: function(response) {
                Ext.util.Functions.createDelegate(clb, this, [response], false)();
                this.wallpaper.el.unmask();
            },
            error: function() {
                this.wallpaper.el.unmask();
            }
        });
    },    
    
    /**
     * Refreshes wallpapers {@link wallpaper}.
     */
    refreshWallpapers : function(clb) {
        this.fetchBackgroundData(function(res){
            var d = res.data;
            this.wallpaper.store.loadData(d.list);
            this.selectWallpaper(d.active_image);
            
            if (Ext.isFunction(clb)) {
                Ext.util.Functions.createDelegate(clb, this, [d], false)();
            }
        });
    },
    
    /**
     * Uploads wallpaper image.
     */
    uploadWallpaper : function() {
        var f = this.bgtools.getForm();
        
        if (!f.isValid()) {
            return;
        }
        
        f.submit({
            url: afStudioWSUrls.project,
            params: {
                cmd: 'uploadWallpaper'
            },
            scope: this,
            waitMsg: 'Uploading...',
            submitEmptyText: false,
            success: function(form, action) {
                var res = action.result;
                if (res.success) {
                    var file = this.bgtools.findByType('fileuploadfield', true);
                    //file.reset();
                    this.refreshWallpapers(function(){
                        this.selectWallpaper(res.data.path);
                    });
                }
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
    },
    //eo uploadWallpaper
    
    /**
     * Validates background and shows errors if any exists returning false otherwise returns true.
     * @protected
     * @return {Boolean}
     */
    validate : function() {
		var c = this.wallpaper.getSelectionCount(),
		    v = this.bgtools.bgcolor.getValue();
        
        if (c == 0 && Ext.isEmpty(v)) {
            afStudio.Msg.warning('Background Editor', 'Background image or/and color must be selected');
            return false;
        }
        
        return true;
    },
    
    /**
     * Saves background editor.
     */
    save : function() {
        if (this.validate() == false) {
            return;
        }

        var sel = this.wallpaper.getSelectedRecords(),
            color = this.bgtools.bgcolor.getValue(),
            params = {
                cmd: 'setWallpaper'
            };
        
        params.path = !Ext.isEmpty(sel) ? sel[0].get('image') : 'none';
        
        if (!Ext.isEmpty(color)) {
            params.color = color;            
        }
            
        afStudio.Logger.info('@params', params);            
        
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: params
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