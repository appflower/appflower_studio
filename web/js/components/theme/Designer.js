Ext.ns('afStudio.theme');

/**
 * How to run prototype version
 * 1. run studio in debug mode
 * 2. execute the following code in the browser's console: var d = new afStudio.theme.Designer(); d.show();
 */

/**
 * afStudio.theme.Designer the container window of the *Theme Designer*.
 *
 * @class afStudio.theme.Designer
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.theme.Designer = Ext.extend(Ext.Window, {

    //private overrides
    title: 'Theme Designer',
    width: 1000,
    height: 600,

    /**
     * @cfg {String} iconCls The window's icon (defaults to "icon-theme")
     */
    iconCls : 'icon-theme',

    /**
     * Initializes component
     * @private
     * @return {Object} The configuration object
     */
    _beforeInitComponent : function() {

        return {
            layout: 'fit',
            closable: true,
            draggable: true,
            plain: true,
            modal: true,
            maximizable: true,
            bodyBorder: false,
            border: false,
            items: [
            {
                xtype: 'tabpanel',
                ref: 'tabs',
                activeTab: 0,
                items: [
                {
                    title: 'Theme Selector',
                    xtype: 'afStudio.theme.themeSelector',
                    ref: '../themeSelector'
                },{
                    title: 'Theme Designer',
                    xtype: 'afStudio.theme.editorsPanel',
                    ref: '../themeDesigner'
                },{
                    title: 'CSS Designer',
                    xtype: 'afStudio.theme.cssEditor'
                }]
            }],
            bbar: {
                items: [
                '->',
                {
                    text: 'Save',
                    ref: '../saveBtn'
                },{
                    xtype: 'tbspacer', width: 5
                },{
                    text: 'Save and Close',
                    ref: '../saveCloseBtn'
                },{
                    xtype: 'tbspacer', width: 5
                },{
                    text: 'Close',
                    ref: '../cancelBtn'
                }]
            }
        };

    },

    /**
     * @template
     */
    initComponent : function() {
        Ext.apply(this,
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );

        afStudio.theme.Designer.superclass.initComponent.apply(this, arguments);
    },

    /**
     * @template
     */
    initEvents : function() {
        afStudio.theme.Designer.superclass.initEvents.call(this);

        var me = this;

        this.delegateEvents();

        this.mon(this.saveBtn, 'click', me.onSave, me);
        this.mon(this.saveCloseBtn, 'click', me.onSaveAndClose, me);
        this.mon(this.cancelBtn, 'click', me.onCancel, me);
    },

    /**
     * Delegates/Relays events to/between components of this container.
     * @protected
     */
    delegateEvents : function() {
        var me = this,
            ts = me.themeSelector,
            td = me.themeDesigner;

        td.relayEvents(ts, ['themeSelection']);
    },

    /**
     * Returns current selected theme {@link afStudio.theme.ThemeSelector#selectedTheme}.
     * @return {String} theme
     */
    getCurrentTheme : function() {
        return this.themeSelector.selectedTheme ? this.themeSelector.selectedTheme : null;
    },

    /**
     * Initialises appearance.
     * Method that is called immediately before the <code>show</code> event is fired.
     * @override
     * @protected
     */
    onShow : function() {
        if (this.themeSelector) {
            //select the current used theme
            this.themeSelector.selectTheme(afTemplateConfig.template.current);
        }
    },

    /**
     * Save {@link #saveBtn} button *click* event listener.
     */
    onSave : function() {
        var at = this.tabs.getActiveTab();

        at.save();
    },

    /**
     * Save and Close {@link #saveCloseBtn} button *click* event listener.
     */
    onSaveAndClose : function() {
        this.onSave();
        this.close();
    },

    /**
     * Cancel {@link #cancelBtn} button *click* event listener.
     */
    onCancel : function() {
        this.close();
    }

});