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
     * @property {Ext.Container} themeEditor
     * The current theme editor container.
     */
    /**
     * @property {String} theme
     * @readonly
     * The current theme for which editors is shown and can be tuned.
     */
    /**
     * @property {Ext.menu.Item} currentEditorMenuItem
     * The currently selected editor's menu item
     */

    /**
     * @template
     */
    initComponent : function() {

        this.editorsMenu = new Ext.menu.Menu({
            floating: false,
            plain: true
        });

        this.themeEditor = new Ext.Container({
            border: false,
            layout: 'anchor'
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
                    region: 'center',
                    layout: 'fit',
                    items: [this.themeEditor]
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
        //updates theme
        this.updateTheme(this.theme);

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
     * Returns theme's editors afStudio.theme.EditorsPanel.viewport/afStudio.theme.EditorsPanel.desktop
     * @param theme
     * @return {Object} theme editors
     */
    getThemeEditors : function(theme) {
        return afStudio.theme.EditorsPanel[theme];
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
        var eds = this.getThemeEditors(theme),
            em = this.editorsMenu,
            menuItems = [];

        if (!Ext.isDefined(eds)) {
           throw new afStudio.error.ApsError(String.format('afStudio.theme.EditorsPanel: editors not defined for the theme "{0}"', theme));
        }

        Ext.iterate(eds, function(ed, itm) {
            menuItems.push(itm);
        }, this);


        afStudio.Logger.info('@afStudio.theme.EditorsPanel#refreshEditors', menuItems);

        em.removeAll(true);
        em.add(menuItems);
        em.doLayout();
    },

    /**
     * Updates theme editors and place the message-box placeholder in the {@link #themeEditor}.
     * This method sets the theme property {@link #theme} and sets the container's initiate state.
     * @protected
     */
    updateTheme : function(theme) {
        this.theme = theme;

        this.refreshEditors(theme);

        //shows the no-theme-selected placeholder message-box
        var messageBox = new afStudio.layoutDesigner.view.ViewMessageBox({
            viewContainer: this.themeEditor,
            viewMessage: '<p>Select theme editor</p> <span style="font-size:10px;"> Theme editors placed in the left(west) collapsible panel.</span>'
        });
        this.themeEditor.removeAll(true);
        this.themeEditor.add(messageBox);

        //layouts the message-box only when the theme designer tab is active
        this.on('activate', function(){this.themeEditor.doLayout();}, this, {single: true});
    },

    /**
     * *themeSelection* event listener.
     * @relayed
     * @param {String} theme The selected theme
     */
    onThemeSelection : function(theme) {
        afStudio.Logger.info('@afStudio.theme.EditorsPanel:onThemeSelection', theme);
        this.updateTheme(theme);
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
        if (this.currentEditorMenuItem == itm) {
            return;
        }
        this.currentEditorMenuItem = itm;
        this.selectEditor(itm);
        this.runEditor(itm.method);
    },

    /**
     * Shows theme editor.
     * Showing here means:
     *  1. remove all components from the {@link #themeEditor} container
     *  2. add new editor
     *  3. render it and refresh the container
     * @protected
     */
    showEditor : function(edt) {
        var te = this.themeEditor;

        te.removeAll(true);
        te.add(edt);
        te.doLayout();
    },

    /**
     * Runs an editor by its init method.
     * @protected
     * @param {String} mtd The method being run to show editor
     */
    runEditor : function(mtd) {
        if (Ext.isEmpty(mtd)) {
           throw new afStudio.error.ApsError("afStudio.theme.EditorsPanel#runEditor error, the editor method is empty");
        }

        var edMtd = 'run' + mtd.ucfirst();
        if (!Ext.isFunction(this[edMtd])) {
            throw new afStudio.error.ApsError(String.format("afStudio.theme.EditorsPanel#runEditor error, method {0} is undefined", edMtd));
        }

        this[edMtd]();
    },

    /**
     * @protected
     */
    runStartMenu : function() {
        var ed = new afStudio.theme.desktop.StartMenuEditor();
        this.showEditor(ed);
    },

    /**
     * @protected
     */
    runShortcuts : function() {
        var ed = new afStudio.theme.desktop.ShortcutsEditor();
        this.showEditor(ed);
    },

    /**
     * @protected
     */
    runBackground : function() {

    },

    /**
     * Saves current theme editor.
     */
    save : function() {
        var editor = this.themeEditor.items.first();

        //all theme editors must implement *save* method
        editor.save();
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
