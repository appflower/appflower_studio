Ext.ns('afStudio.theme.desktop');

/**
 * Desktop layout's shortcuts editor.
 *
 * @class afStudio.theme.desktop.ShortcutsEditor
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.ShortcutsEditor = Ext.extend(Ext.Panel, {

    /**
     * @property controller The shortcuts controller
     * @type {ShortcutController}
     */
    /**
     * @property errorWin The error window reference
     * @type {afStudio.view.ModelErrorWindow}
     */

    //private override
    anchor: '100% 100%',

    /**
     * @template
     */
    initComponent : function() {
        this.createRegions();

        Ext.apply(this, Ext.apply(this.initialConfig,
        {
            layout: 'border',
            items: [
                this.centerPanel,
                this.eastPanel
            ]
        }));

        afStudio.theme.desktop.ShortcutsEditor.superclass.initComponent.apply(this, arguments);
    },

    /**
     * @template
     */
    afterRender : function() {
        afStudio.theme.desktop.ShortcutsEditor.superclass.afterRender.call(this);

        (function(){
            afStudio.xhr.executeAction({
                url: afStudioWSUrls.project,
                params: {
                    cmd: 'getHelper',
                    key: 'links'
                },
                mask: {ctn: this, msg: 'shortcuts loading...'},
                scope: this,
                run: function(response) {

                    this.initShortCutsInspector(response.data);

                    this.initView();
                }
            });
        //short delay to show loading mask
        }).defer(50, this);
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
            layout: 'fit',
            items: []
        });
    },
    //eo createRegions

    /**
     * Instantiates shortcuts controller {@link afStudio.theme.desktop.shortcut.controller.ShortcutController}
     * and shows inspector palette {@link afStudio.view.InspectorPalette} associated with him.
     * @protected
     * @param {Object} definition The shortcuts definition object
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
     * Instantiates live shortcuts view.
     * Controller must be already instantiated and be ready.
     * @protected
     */
    initView : function() {
        var sc = new afStudio.theme.desktop.shortcut.view.ShortcutsView({
            controller: this.controller
        });

        this.centerPanel.add(sc);
        this.centerPanel.doLayout();
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
    }
});

/**
 * shortcut
 */
afStudio.theme.ShortcutsEditor = afStudio.theme.desktop.ShortcutsEditor;