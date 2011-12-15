Ext.ns('afStudio.theme.desktop.shortcut.model.template');


/**
 * Shortcuts structural template.
 * 
 * @class afStudio.theme.desktop.shortcut.model.template.ShortcutTemplate
 * @extends afStudio.model.template.BaseTemplate
 */
afStudio.theme.desktop.shortcut.model.template.ShortcutTemplate = Ext.extend(afStudio.model.template.BaseTemplate, {
    constructor : function() {
        var ns = afStudio.theme.desktop.shortcut.model;
        
        ns.template.ShortcutTemplate.superclass.constructor.call(this);
        
        this.extendStructure([
            {name: ns.Nodes.LINK, hasMany: true}
        ]);
    }
});