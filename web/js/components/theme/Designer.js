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
    title : 'Theme Designer',
    width : 1007,
    height : 600,
    //TODO update width & height reflecting the browser size on showing window

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
                activeTab: 0,
                items: [
                {
                    title: 'Theme Selector',
                    xtype: 'afStudio.theme.themeSelector',
                    ref: '../themeSelector'
                },{
//                    xtype: ''
                    title: 'Theme Designer'
                },{
                    title: 'CSS Designer',
                    xtype: 'afStudio.theme.cssEditor'
                }]
            }]
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
    }
});