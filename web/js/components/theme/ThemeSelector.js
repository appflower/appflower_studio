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
     * @template
     */
    initComponent : function() {
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
            ),
            listeners: {
                scope: this,

                selectionchange: function(dataview, selections) {
                    afStudio.Logger.info('theme selector selectionchange', selections);
                    //TODO add logic to enable / disable save, save & close, close buttons
                },

                dblclick: function(dataview, index, node, e) {
                }
            }
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
     * Selects the specified theme.
     * @param {String} themeName The theme being selected name
     */
    selectTheme : function(themeName) {
        afStudio.Logger.info('select theme', themeName);

        var recIdx = this.selector.store.find('name', themeName);
        this.selector.select(recIdx);

        //TODO add parameters and processors of the event
        this.fireEvent('themeSelection');
    },

    /**
     * Saves selected theme.
     */
    save : function() {
        var me = this;

        if (this.selector.getSelectionCount()) {
            var templateName = this.selector.getSelectedRecords()[0].get('name');

            afStudio.Logger.info('save theme', templateName);

            afStudio.xhr.executeAction({
                url: afStudioWSUrls.templateSelectorUrl,
                params: {
                    cmd: 'update',
                    template: templateName
                },
                run: function(response, options) {
                    afTemplateConfig.template.current = templateName.toLowerCase();

                    //Update theme designer tab
//                    me.updateDataviewEditors();
                }
            });
        }
    }

});

/**
 * @xtype afStudio.theme.themeSelector
 */
Ext.reg('afStudio.theme.themeSelector', afStudio.theme.ThemeSelector);
