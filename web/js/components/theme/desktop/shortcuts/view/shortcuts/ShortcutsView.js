Ext.ns('afStudio.theme.desktop.shortcut.view');

/**
 * Shortcuts data view.
 * 
 * @class afStudio.theme.desktop.shortcut.view.ShortcutsView
 * @extends Ext.DataView
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.shortcut.view.ShortcutsView = Ext.extend(Ext.DataView, {

    /**
     * @property controller The controller 
     * @type {ShortcutController}
     */
    controller : null,    
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    initComponent : function() {
        Ext.apply(this, 
            Ext.apply(this.initialConfig,
            {
/*                
<dl id="x-shortcuts">
        <dt id="desktop-win-shortcut">
            <a href="javascript:return false;" onclick="afApp.widgetPopup(&quot;#&quot;); return false;">
                <img src="/images/desktop/User-icon.png">
                <div>Shortcut</div>
            </a>
        </dt>
</dl>                
*/
                itemSelector: 'dt.shortcut',
                
                tpl: new Ext.XTemplate(
                    '<dl id="x-shortcuts">',
                        '<tpl for=".">',
                        '<dt class="shortcut {iconCls}">',
                            '<a href="javascript: void 0;">',
                                '<img src="{icon}" title="{name}" />',
                                '<div style="color:#000;">{title}</div>',
                            '</a>',
                        '</dt>',
                        '</tpl>',
                        '<div class="x-clean" />',
                    '</dl>'
				),
                
                store: new afStudio.theme.desktop.shortcut.view.ShortcutsStore({
                    controller: this.controller
                })
            })
        );
        
        //registers view inside the controller
        this.controller.registerView('shortcutStore', this.store);
        
        afStudio.theme.desktop.shortcut.view.ShortcutsView.superclass.initComponent.call(this);        
    },

    //TODO remove this method after development
    afterRender : function() {
        afStudio.theme.desktop.shortcut.view.ShortcutsView.superclass.afterRender.call(this);
        
        this.store.data.dumpMapper();
    },
    
    /**
     * Prepares data for each data-view node.
     * Details {@link Ext.DataView#prepareData}
     * @override
     * @protected
     * @param {Array|Object} data The raw data object that was used to create the Record.
     * @param {Number} recordIndex the index number of the Record being prepared for rendering.
     * @param {Record} record The Record being prepared for rendering.
     * @return {Array|Object} The formatted data in a format expected by the internal {@link #tpl template}'s overwrite() method.
     * (either an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'}))
     */
    prepareData : function(data, recordIndex, record) {
        return data;
    }
});
