Ext.ns('afStudio.theme.desktop');

/**
 * Desktop shortcuts editor.
 * 
 * @class afStudio.theme.desktop.ShortcutsEditor
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.ShortcutsEditor = Ext.extend(Ext.Window, { 

    /**
     * @property controller The shortcuts controller
     * @type {ShortcutController}
     */
    /**
     * @property errorWin The error window reference
     * @type {afStudio.view.ModelErrorWindow}
     */
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    initComponent : function() {
        this.createRegions();
        
        var config = {
            title: 'Shortcuts  Editor', 
            layout: 'border',
            width: 813,
            height: 550, 
            modal: true, 
            closable: true,
            draggable: true, 
            resizable: false,
            bodyBorder: false, 
            border: false,
            items: [
                this.centerPanel,
                this.eastPanel
            ],
            buttonAlign: 'center',
            buttons: [
            {
                text: 'Cancel',
                scope: this,
                handler: this.cancel
            }]
        };
                
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        
        afStudio.theme.desktop.ShortcutsEditor.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * Method that is called immediately before the <code>show</code> event is fired.
     * @override
     * @protected
     */
    onShow : function() {
        this.eastPanel.el.mask('loading...', 'x-mask-loading');
        
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: {
                cmd: 'getHelper',
                key: 'links'
            },
            scope: this,
            run: function(response) {
                this.initShortCutsInspector(response.data);
                this.eastPanel.el.unmask();
            },
            error: function() {
                this.eastPanel.el.unmask();
            }
        });
    },
    
    /**
     * Init editor's layout.
     * @private
     */
    createRegions : function() {
        this.eastPanel = new Ext.Panel({
            region: 'east',
            layout: 'fit',
            width: 350,
            minWidth: 300,
            split: true,
            activeTab: 0,
            bodyBorder: false,
            items: []
        });
        
        
        this.centerPanel = new Ext.Panel({
            region: 'center',
            items: [],
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
            }]
        });
        
        this.messageBox = new afStudio.layoutDesigner.view.ViewMessageBox({
            width: 300,
            viewContainer: this.centerPanel,
            viewMessage: '<p>Shortcuts Designer</p> <span style="font-size:10px;">under development</span>'
        });
        this.centerPanel.add(this.messageBox);
        
        this.centerPanel.on('afterlayout', function(){
            this.messageBox.onAfterRender();
        }, this);
    },
    //eo createRegions
    
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
afStudio.theme.ShortcutsEditor = afStudio.theme.desktop.ShortcutsEditor;