/**
 * This node represents <b>i:action</b> node in edit type widget
 * 
 * @class afStudio.wi.ActionNode
 * @extends afStudio.wi.ContainerNode
 */
afStudio.wi.ActionNode = Ext.extend(afStudio.wi.ContainerNode, {
	
    /**
     * template method
     * @override
     * @return {Object} this node configuration object
     */
    getNodeConfig : function() {
        return {
            text: 'newaction',
            metaField: 'i:action'
        };
    }//eo getNodeConfig
    
    /**
     * template method
     * @override
     */
    ,createProperties : function() {
       var properties = [
           new afStudio.wi.PropertyTypeString({id: 'name', label: 'Name', defaultValue: 'newaction', required: true}).create(),
           new afStudio.wi.PropertyTypeString({id: 'url', label: 'Url', required: true}).create(),
           new afStudio.wi.PropertyTypeString({id: 'text', label: 'Text'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'iconCls', label: 'Icon CSS class'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'icon', label: 'Icon URL'}).create(),
           new afStudio.wi.PropertyTypeBoolean({id: 'forceSelection', label: 'Force selection'}).create(),
           new afStudio.wi.PropertyTypeBoolean({id: 'post', label: 'Post'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'tooltip', label: 'Tooltip'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'confirmMsg', label: 'Confirm message'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'condition', label: 'Condition'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'style', label: 'Style'}).create()
       ];

       this.addProperties(properties);
    }//eo createProperties
    ,getLabel : function() {
        return this.getPropertyValue('name');
    }//eo addBehavior
    
});