/**
 * This class contains Validator node
 */
afStudio.wi.ValidatorNode = Ext.extend(afStudio.wi.CollectionNode, {

    addChildActionLabel : 'Add Parameter'
    
    ,childNodeId : 'i:param'
	
    ,constructor : function() {
        afStudio.wi.ValidatorNode.superclass.constructor.apply(this, arguments);
        this.addBehavior(new afStudio.wi.WithNamePropertyAsLabelBehavior);
    }
    
    ,getNodeConfig : function() {
        return {
            'text': 'Validator'
        };
    }
    
    ,createChild : function() {
        return new afStudio.wi.ParamNode();
    }    
    
    ,createProperties : function() {
        var properties = [
            new afStudio.wi.PropertyTypeString({id: 'name', label: 'Name'}).setRequired().create()
        ];
        this.addProperties(properties);
    }
});
