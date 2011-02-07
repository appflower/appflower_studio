/**
 * This class contains Validators node
 */
afStudio.widgetDesigner.ValidatorsNode = Ext.extend(afStudio.widgetDesigner.CollectionNode, {
    getNodeConfig: function(){
        return {
            'text': 'Validators',
            'childNodeId': 'i:validator'
        };
    },
    createChild: function() {
        return new afStudio.widgetDesigner.ValidatorNode();
    },
    addChildActionLabel: 'Add Validator',
    childNodeId: 'i:validator',
    dumpDataForWidgetDefinition: function(){

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
    },
    dumpChildsData: function(){
        var data = [];
        this.eachChild(function(childNode){
            data.push(childNode.dumpDataForWidgetDefinition());
        });

        var ret = {};

        if (data.length == 0 && !this.dumpEvenWhenEmpty) {
            return ret;
        }

        ret[this.childNodeId] = data;
        return ret;
    }
});
