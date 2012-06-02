Ext.ns('afStudio.theme.desktop');

/**
 * Desktop layout's background editor.
 * 
 * @class afStudio.theme.desktop.BackgroundEditor
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.BackgroundEditor = Ext.extend(Ext.Panel, {
    
    /**
     * @property wallpaper The background wallpapers container
     * @type {Ext.DataView}
     */
    /**
     * @property bgtools Background tools form panel
     * @type {Ext.FormPanel}
     */

    //private override
    anchor: '100% 100%',

    /**
     * @template
     */
    initComponent : function() {
        this.createContent();

        Ext.apply(this, Ext.apply(this.initialConfig,
        {
            layout: 'vbox',
            layoutConfig: {
                align: 'stretch',
                pack: 'start'
            },
            items: [
                this.wallpaper,
                this.bgtools
            ]
        }));

        afStudio.theme.desktop.BackgroundEditor.superclass.initComponent.apply(this, arguments);
    },

    /**
     * @template
     */
    afterRender : function() {
        afStudio.theme.desktop.BackgroundEditor.superclass.afterRender.call(this);

        (function(){
            this.fetchBackgroundData(function(res){
                var d = res.data;

                this.wallpaper.store.loadData(d.list);
                this.selectWallpaper(d.active_image);
                this.bgtools.bgcolor.setValue(d.active_color);
            });
        //short delay to show loading mask
        }).defer(50, this);
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
            },
            listeners: {
                //prevent deselection 
                containerclick : function(dv, e) {
                    return false;
                }
            }
        });
        
        this.bgtools = new Ext.FormPanel({
            fileUpload: true,
            padding: 5,
            frame: true,
            items: [
            {
                xtype: 'container',
                layout: 'column',
                items: [
                {
                    layout: 'form',
                    items: {
		                xtype: 'colorfield',
		                ref: '../../bgcolor',
                        msgTarget: 'qtip',
		                fieldLabel: 'Background color',
		                submitValue: false
                    }
                },{
                    xtype: 'checkbox',
                    ref: '../onlycolor',
                    boxLabel: 'only color',
                    style: 'margin-left: 10px;',
                    listeners: {
                        scope: this,
                        check: function(ch, checked) {
                            checked ? this.wallpaper.disable() : this.wallpaper.enable(); 
                        }
                    }
                }]
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
                        msg = Ext.decode(action.response.responseText).message;
                        afStudio.Msg.warning('File Upload', msg);
                    } catch(e) {
                        msg = action.response.responseText;
                        afStudio.Msg.error('File Upload', msg);
                    }
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
		    v = this.bgtools.bgcolor.getValue(),
            onlyColor = this.bgtools.onlycolor.getValue();
            
        if (onlyColor && Ext.isEmpty(v)) {
            afStudio.Msg.warning('Background Editor', 'Background color must be selected');
            return false;
        }
        
        if (c == 0 && Ext.isEmpty(v)) {
            afStudio.Msg.warning('Background Editor', 'Background image or color must be selected');
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
            onlyColor = this.bgtools.onlycolor.getValue(),
            params = {
                cmd: 'setWallpaper'
            };
        
        params.path = !Ext.isEmpty(sel) && !onlyColor ? sel[0].get('image') : 'none';
        
        if (!Ext.isEmpty(color)) {
            params.color = color;
        }
            
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: params,
            mask: {ctn: this, msg: 'saving...'}
        });
    }
});

/**
 * shortcut
 */
afStudio.theme.BackgroundEditor = afStudio.theme.desktop.BackgroundEditor;