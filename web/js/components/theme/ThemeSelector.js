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
                    console.log('theme selector selectionchange', selections);
//                    var btn = Ext.getCmp(this.id + '-customize-btn-ts');
//                    selections.length ? btn.enable() : btn.disable();
                },
                dblclick: function(dataview, index, node, e) {
//                    me.customizeThemeSelector(me.close);
                }
            }
        });

        Ext.apply(this,
            Ext.apply(this.initialConfig, {

                layout:'vbox',

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

    /**
     * Selects the specified theme.
     * @param {String} themeName The theme being selected name
     */
    selectTheme : function(themeName) {
        console.log('selectTheme', themeName);

        var recIdx = this.selector.store.find('name', themeName);
        this.selector.select(recIdx);

        //TODO add parameters and processors of the event
        this.fireEvent('themeSelection');
    }

});

/**
 * @xtype afStudio.theme.themeSelector
 */
Ext.reg('afStudio.theme.themeSelector', afStudio.theme.ThemeSelector);
