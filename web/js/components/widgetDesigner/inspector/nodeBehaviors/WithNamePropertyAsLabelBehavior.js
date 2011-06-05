Ext.namespace('afStudio.wi');

/**
 * In WI Tree each node has its label that is visible in browser.
 * For some nodes we need to update that label automatically when some property changes
 * This behavior allows to define property name that when changed will be used to
 * update WI tree node label
 * 
 * @class afStudio.wi.WithNamePropertyAsLabelBehavior
 * @extends afStudio.wi.BaseBehavior
 */
afStudio.wi.WithNamePropertyAsLabelBehavior = Ext.extend(afStudio.wi.BaseBehavior, {
	
    /**
     * We need to detect when valueSource was changed
     * @override
     */
    propertyChanged : function(property) {
        if (property.id == 'name') {
            this.namePropertyChanged(property);
        }
    }//eo propertyChanged
    
    ,namePropertyChanged : function(property) {
//        this.node.setText(property.get('value'));
    }//eo namePropertyChanged
});
