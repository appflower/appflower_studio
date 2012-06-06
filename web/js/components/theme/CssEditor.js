Ext.ns('afStudio.theme');

/**
 * Css Editor
 * @class afStudio.theme.CssEditor
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.theme.CssEditor = Ext.extend(Ext.Panel, {

    //private override
    layout: 'border',

    /**
     * @template
     */
    initComponent: function() {
        this.createRegions();

        Ext.apply(this, Ext.apply(this.initialConfig,
            {
                border: false,
                items: [
                    this.westPanel,
                    this.centerPanel
                ]
            }
        ));

        afStudio.theme.CssEditor.superclass.initComponent.apply(this, arguments);

        this.mon(this.westPanel.getSelectionModel(), 'selectionchange', function(sm, n) {
            var d = this.getContainerWindow();

            n && n.isLeaf() ? d.enableSave() : d.disableSave();
        }, this);
    },

    /**
     * Creates required regions for this editor.
     * @protected
     */
    createRegions : function() {
        var me = this;

        this.westPanel = new Ext.ux.FileTreePanel({
            title: 'Files',
            iconCls: 'icon-models',
            region: 'west',
            split: true,
            collapsible: true,
            collapseMode: 'mini',
            url: afStudioWSUrls.getFiletreeUrl,
            loadMask: true,
            width: 220,
            minWidth: 200,
            rootText: 'CSS',
            rootPath: 'root/web/css',
            newfileText: 'file.css',
            maxFileSize: 524288 * 2 * 10,
            autoScroll: true,
            enableProgress: false,
            fileCt: this,
            fileOpenSingleClick: true
        });

        //Ace editor
        this.codeEditor = new Ext.ux.AceComponent();

        this.centerPanel = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            items: this.codeEditor
        })
    },

    /**
     * *activate* this designer container's event listener
     * @override
     */
    onTabActivate : function() {
        var ft = this.westPanel,
            ftSm = ft.getSelectionModel(),
            n = ftSm.getSelectedNode(),
            d = this.getContainerWindow();

        n && n.isLeaf() ? d.enableSave() : d.disableSave();
    },

    /**
     * Opens file inside {@link #codeEditor}.
     * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.
     * @param {String} name The file name
     * @param {String} path The file path
     * @author Nikolai Babinski
     */
    openFile : function(name, path) {
        //prevent loading already loaded file
        if (path != this.codeEditor.file) {
            this.codeEditor.loadFile(path);
        }
    },

    /**
     * Resets {@link #codeEditor} file property.
     * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.
     * @param {String} name The new file name
     * @param {String} newpath The new file path
     * @param {String} oldpath The old file path
     * @author Nikolai Babinski
     */
    renameFile : function(name, newpath, oldpath) {
        var ace = this.codeEditor;
        if (ace.file == oldpath) {
            ace.setFile(newpath);
        }
    },

    /**
     * Clears {@link #codeEditor} file associated with deleted file(s)/folder.
     * File tree {@link Ext.ux.FileTreePanel#fileCt} container's interface method.
     * @param {String} path The deleted file/folder path
     * @author Nikolai Babinski
     */
    deleteFile : function(path) {
        this.codeEditor.setCode('');
    },

    /**
     * Saves css file.
     */
    save : function() {
        var me = this,
            cp = this.codeEditor;

        afStudio.xhr.executeAction({
            url: afStudioWSUrls.getFilecontentUrl,
            params: {
                file: cp.file,
                code: cp.getCode()
            },
            scope: me,
            logMessage: String.format('CssEditor file [{0}] was saved', cp.file)
        });
    }
});

/**
 * @mixin afStudio.theme.Designerable
 */
Ext.applyIf(afStudio.theme.CssEditor.prototype, afStudio.theme.Designerable);

/**
 * @xtype afStudio.theme.cssEditor
 */
Ext.reg('afStudio.theme.cssEditor', afStudio.theme.CssEditor);