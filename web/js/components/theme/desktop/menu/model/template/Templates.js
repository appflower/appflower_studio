Ext.ns('afStudio.theme.desktop.menu.model.template');

afStudio.theme.desktop.menu.model.template.MainTemplate = Ext.extend(afStudio.model.template.BaseTemplate, {
    constructor : function() {
        afStudio.theme.desktop.menu.model.template.MainTemplate.superclass.constructor.call(this);
        
        this.extendStructure([
            {name: 'item', required: true, hasMany: true}
        ]);
    }
});

afStudio.theme.desktop.menu.model.template.ToolsTemplate = Ext.extend(afStudio.model.template.BaseTemplate, {
    constructor : function() {
        afStudio.theme.desktop.menu.model.template.ToolsTemplate.superclass.constructor.call(this);
        
        this.extendStructure([
            {name: 'tool', hasMany: true}
        ]);
    }
});