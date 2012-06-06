Ext.ns('afStudio.theme');

/**
 * The Theme Selector.
 *
 * @class afStudio.theme.ThemeSelector
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.theme.ThemeSelector = Ext.extend(Ext.Panel, {

    /**
     * @property {String} selectedTheme The current selected theme
     * @readonly
     */

    /**
     * @template
     */
    initComponent : function() {
        //theme is not defined yet
        this.selectedTheme = null;

        var store = new Ext.data.ArrayStore({
            fields: ['id', 'name', 'img'],
            sortInfo: {
                field: 'name', direction: 'ASC'
            },
            data: [
                ['desktoptemplate', 'Desktop', 'template_desktop.png'],
                ['viewporttemplate', 'Viewport', 'template_viewport.png']
            ]
        });

        this.selector = new Ext.DataView({
            itemSelector: 'div.thumb-wrap-large',
            singleSelect: true,
            store: store,
            tpl: new Ext.XTemplate(
                '<div class="theme-selector-wrap">',
                    '<tpl for=".">',
                        '<div class="{id} thumb-wrap-large">',
                            '<div class="thumb"><img src="appFlowerStudioPlugin/images/{img}"></div>',
                            '<span>{name}</span>',
                        '</div>',
                    '</tpl>',
                    '<div class="x-clear"/>',
                '</div>'
            )
        });

        Ext.apply(this,
            Ext.apply(this.initialConfig, {

                layout: 'vbox',

                layoutConfig: {
                    align: 'stretch',
                    pack: 'center'
                },

                items: [
                    this.selector
                ]
            })
        );

        afStudio.theme.ThemeSelector.superclass.initComponent.apply(this, arguments);
    },
    //eo initComponent

    /**
     * @template
     */
    initEvents : function() {
        afStudio.theme.ThemeSelector.superclass.initEvents.call(this);

        this.addEvents(
            /**
             * @event themeSelection
             * Fires when a theme was selected
             * @param {String} theme The selected theme
             */
            'themeSelection'
        );

        this.mon(this.selector, 'selectionchange', this.onSelectionChange, this);
        this.mon(this.selector, 'dblclick', this.onSelectorDblclick, this);
    },

    /**
     * Selects the specified theme.
     * @param {String} themeName The theme being selected name
     */
    selectTheme : function(themeName) {
        afStudio.Logger.info('@afStudio.theme.ThemeSelector#selectTheme', themeName);

        var recIdx = this.selector.store.find('name', themeName);
        this.selector.select(recIdx);
    },

    /**
     * Theme {@link #selector} *selectionchange* event listener.
     * @param dataview
     * @param selections
     */
    onSelectionChange : function(dataview, selections) {
        afStudio.Logger.info('@afStudio.theme.ThemeSelector.selector#selectionchange', selections);

        if (selections[0]) {
            var rec = dataview.getRecord(selections[0]),
                theme = rec.get('name').toLowerCase();

            if (this.selectedTheme != theme) {
                this.selectedTheme = theme;
                this.fireEvent('themeSelection', theme);
            }
        }
    },

    /**
     * Theme {@link #selector} *dblclick* event listener.
     * Details {@link Ext.DataView#dblclick}.
     */
    onSelectorDblclick : function(dataview, index, node, e) {
        afStudio.Logger.info('@afStudio.theme.ThemeSelector.selector#dblclick');
        var d = this.getContainerWindow();
        d.tabs.setActiveTab(d.themeDesigner);
    },

    /**
     * Saves selected theme.
     */
    save : function() {
        var me = this;

        if (this.selector.getSelectionCount()) {
            var templateName = this.selector.getSelectedRecords()[0].get('name');

            afStudio.Logger.info('@afStudio.theme.ThemeSelector#save', templateName);

            afStudio.xhr.executeAction({
                url: afStudioWSUrls.templateSelectorUrl,
                params: {
                    cmd: 'update',
                    template: templateName
                },
                run: function(response, options) {
                    afTemplateConfig.template.current = templateName.toLowerCase();
                }
            });
        }
    }
});

/**
 * @mixin afStudio.theme.Designerable
 */
Ext.applyIf(afStudio.theme.ThemeSelector.prototype, afStudio.theme.Designerable);


/**
 * @xtype afStudio.theme.themeSelector
 */
Ext.reg('afStudio.theme.themeSelector', afStudio.theme.ThemeSelector);
