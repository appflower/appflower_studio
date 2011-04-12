/**
 * This class contains Validators node
 * @class afStudio.wi.ValidatorsNode
 * @extends afStudio.wi.CollectionNode
 */
afStudio.wi.ValidatorsNode = Ext.extend(afStudio.wi.CollectionNode, {

    addChildActionLabel : 'Add Validator'
    
    ,childNodeId : 'i:validator'	
	
	,getNodeConfig : function() {
        return {
            'text': 'Validators',
            'childNodeId': 'i:validator'
        };
    }//eo getNodeConfig
    
    ,createChild : function() {
        return new afStudio.wi.ValidatorNode();
    }//eo createChild
    
    ,dumpDataForWidgetDefinition : function() {
        var childsData = this.dumpChildsData();
        var propertiesData = this.dumpPropertiesData();

        //my array merge :)
        for(key in propertiesData) {
            if (propertiesData[key] != '') {
                childsData[key] = propertiesData[key];
            }
        }

        for(i=0;i<this.behaviors.length;i++) {
            childsData = this.behaviors[i].dumpDataForWidgetDefinition(this, childsData);
        }

        return childsData;
    }//eo dumpDataForWidgetDefinition
});
