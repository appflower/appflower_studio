Ext.ns('afStudio.theme.desktop.menu.model.template');

afStudio.theme.desktop.menu.model.template.MainTemplate = Ext.extend(afStudio.model.template.BaseTemplate, {
    constructor : function() {
        var ns = afStudio.theme.desktop.menu.model;
        
        ns.template.MainTemplate.superclass.constructor.call(this);
        
        this.extendStructure([
            {name: ns.Nodes.ITEM, hasMany: true, unique: 'name'},
            {name: ns.Nodes.BUTTON, hasMany: true, unique: 'name'}
        ]);
    }
});

/**
 * Tools menu structural template.
 * 
 * @class afStudio.theme.desktop.menu.model.template.ToolsTemplate
 * @extends afStudio.model.template.BaseTemplate
 */
afStudio.theme.desktop.menu.model.template.ToolsTemplate = Ext.extend(afStudio.model.template.BaseTemplate, {
    constructor : function() {
        var ns = afStudio.theme.desktop.menu.model;
        
        ns.template.ToolsTemplate.superclass.constructor.call(this);
        
        this.extendStructure([
            {name: ns.Nodes.TOOL, hasMany: true, unique: 'name'}
        ]);
    }
});