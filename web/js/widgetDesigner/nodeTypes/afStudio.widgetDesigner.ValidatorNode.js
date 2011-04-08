/**
 * This class contains Validator node
 */
afStudio.widgetDesigner.ValidatorNode = Ext.extend(afStudio.widgetDesigner.CollectionNode, {

    addChildActionLabel : 'Add Parameter'
    
    ,childNodeId : 'i:param'
	
    ,constructor : function() {
        afStudio.widgetDesigner.ValidatorNode.superclass.constructor.apply(this, arguments);
        this.addBehavior(new afStudio.widgetDesigner.WithNamePropertyAsLabelBehavior);
    }
    
    ,getNodeConfig : function() {
        return {
            'text': 'Validator'
        };
    }
    
    ,createChild : function() {
        return new afStudio.widgetDesigner.ParamNode();
    }    
    
    ,createProperties : function() {
        var properties = [
            new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create(),
        ];
        this.addProperties(properties);
    }
});
