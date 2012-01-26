/**
 * Main menu's model <u>root</u> node.
 * 
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.menu.model.MainRoot = Ext.extend(afStudio.theme.desktop.menu.model.Root, {
    properties : [
        {name: "type", type: 'string', required: true, readOnly: true},
        {name: "title", type: 'string'},
        {name: "iconCls", type: 'token'},
        {name: 'icon', type: 'absoluteUriType'}
    ]
});