Ext.ns('afStudio.theme');

/**
 * The Theme Designer container contains and manages editors appropriated for selected(current) theme.
 *
 * @class afStudio.theme.EditorsPanel
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.theme.EditorsPanel = Ext.extend(Ext.Panel, {

    layout: 'border',

    /**
     * @property {String} theme The current selected theme.
     * @readonly
     */

    /**
     * @property {Ext.menu.Menu} editorsMenu
     * Theme editors menu.
     */

    /**
     * @template
     */
    initComponent : function() {

        this.editorsMenu = new Ext.menu.Menu({
            floating: false,
            plain: true
        });

        Ext.apply(this,
            Ext.apply(this.initialConfig, {

                items: [
                {
                    region: 'west',
                    width: 150,
                    minWidth: 150,
                    maxWidth: 250,
                    collapseMode: 'mini',
                    split: true,
                    items: [this.editorsMenu]

                },{
                    xtype: 'container',
                    region: 'center'
                }]
            })
        );

        afStudio.theme.EditorsPanel.superclass.initComponent.apply(this, arguments);

    },

    /**
     * @template
     */
    afterRender : function() {
        //gets the current theme
        this.theme = this.refOwner.getCurrentTheme();
        //updates editors
        this.refreshEditors(this.theme);

        afStudio.theme.EditorsPanel.superclass.afterRender.call(this);
    },

    /**
     * @template
     */
    initEvents : function() {
        afStudio.theme.EditorsPanel.superclass.initEvents.call(this);

        var me = this;

        me.on(
        {
            scope: me,

            /**
             * @relayed {@link afStudio.theme.ThemeSelector#themeSelection}
             */
            themeSelection: me.onThemeSelection,

            activate : me.onTabActivate
        });

        me.mon(me.editorsMenu, 'itemclick', me.onEditorsMenuItemClick, me);
    },

    /**
     * Selects editor's menu item.
     * @private
     */
    selectEditor : function(itm) {
        var m = itm.parentMenu;
        m.items.each(function(i, idx){
            i.el.removeClass('x-menu-item-active');
        });
        itm.el.addClass('x-menu-item-active');
    },

    /**
     * Refreshes theme's editors according to the passing in theme argument.
     * @private
     * @param {String} theme The theme whose editors being refreshed
     */
    refreshEditors : function(theme) {
        var eds = afStudio.theme.EditorsPanel[theme],
            em = this.editorsMenu,
            menuItems = [];

        if (!Ext.isDefined(eds)) {
           throw new afStudio.error.ApsError(String.format('afStudio.theme.EditorsPanel: editors not defined for the theme "{0}"', theme));
        }

        Ext.iterate(eds, function(ed, itm) {
            menuItems.push(itm);
        }, this);


        afStudio.Logger.info('@afStudio.theme.EditorsPanel#refreshEditors', menuItems);

        em.removeAll();
        em.add(menuItems);
        em.doLayout();
    },

    /**
     * *themeSelection* event listener.
     * @relayed
     * @param {String} theme The selected theme
     */
    onThemeSelection : function(theme) {
        afStudio.Logger.info('@afStudio.theme.EditorsPanel:onThemeSelection', theme);
        this.theme = theme;
        this.refreshEditors(theme);
    },

    /**
     * *activate* listener.
     */
    onTabActivate : function() {
        //refresh the editors menu (west area)
        //to update editors list
        this.editorsMenu.doLayout();
    },

    /**
     * {@link #editorsMenu} *itemclick* event listener.
     * Details {@link Ext.menu.Menu#itemclick}
     */
    onEditorsMenuItemClick : function(itm, e) {
        this.selectEditor(itm);

        //console.log('item method', itm.method);
    }
});

/**
 * @static {Object} viewport
 * Viewport theme editors.
 */
afStudio.theme.EditorsPanel.viewport = {
   menuToolbar: {
       text: 'Menu Toolbar',
       iconCls: 'icon-studio',
       method: 'menuToolbar'
   },

    westPanel: {
        text: 'West Panel',
        iconCls: 'icon-studio',
        method: 'westPanel'
    },

    southPanel: {
        text: 'South Panel',
        iconCls: 'icon-studio',
        method: 'southPanel'
    },

    eastPanel: {
        text: 'East Panel',
        iconCls: 'icon-studio',
        method: 'eastPanel'
    }
};

/**
 * @static {Object} desktop
 * Desktop theme editors.
 */
afStudio.theme.EditorsPanel.desktop = {
    startMenu: {
        text: 'Start Menu',
        iconCls: 'icon-studio',
        method: 'startMenu'
    },

    shortcuts: {
        text: 'Shortcuts',
        iconCls: 'icon-studio',
        method: 'shortcuts'
    },

    background: {
        text: 'Background',
        iconCls: 'icon-studio',
        method: 'background'
    }
};

/**
 * @xtype afStudio.theme.editorsPanel
 */
Ext.reg('afStudio.theme.editorsPanel', afStudio.theme.EditorsPanel);
