/**
 * In WI Tree each node has its label that is visible in browser.
 * For some nodes we need to update that label automatically when some property changes
 * This behavior allows to define property name that when changed will be used to
 * update WI tree node label
 **/
Ext.namespace('afStudio.widgetDesigner');
afStudio.widgetDesigner.WithNamePropertyAsLabelBehavior = Ext.extend(afStudio.widgetDesigner.BaseBehavior, {
    /**
     * We need to detect when valueSource was changed
     */
    propertyChanged: function(node, property){
        if (property.id == 'name') {
            this.namePropertyChanged(node, property);
        }
    },
    namePropertyChanged: function(node, property){
        node.setText(property.get('value'));
    }
});
