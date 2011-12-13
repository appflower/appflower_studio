/**
 * This file describes all needed data types used in Theme Designer, namespace {@link afStudio.theme}.
 * 
 * TODO data-types could be replaced after {@link afStudio.model.Property} property will be refactored to 
 * have possibility configure types namespace/object.
 */

afStudio.data.type.MenuItemType = Ext.extend(afStudio.data.type.String, {
    type : "menuItemType",
    
    restrictions : {
        enumeration : ['item', 'button']
    }
});