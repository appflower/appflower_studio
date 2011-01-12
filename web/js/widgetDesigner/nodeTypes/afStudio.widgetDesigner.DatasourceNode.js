/**
 * This node represents i:datasource node in edit type widget
 *
 * @todo this is almost copy&past from FieldNode - this should be refactored
 *
 **/
afStudio.widgetDesigner.DatasourceNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    constructor: function(){
        afStudio.widgetDesigner.DatasourceNode.superclass.constructor.apply(this, arguments);
    },

    getNodeConfig: function(){
        return {
            'text': 'Datasource',
            'id': 'i:datasource'
        };
    },
    createProperties: function(){
       var properties = [
            new afStudio.widgetDesigner.ValueType('valueType', 'Value Type').setValue('orm').create(),
            new afStudio.widgetDesigner.ValueSource('valueSource', 'Value Source').setValue('classAndMethod').create(),
       ];

       for (i=0; i<properties.length;i++){
           this.addProperty(properties[i]);
       }
    },
    dumpDataForWidgetDefinition: function(){
        var widgetData = afStudio.widgetDesigner.DatasourceNode.superclass.dumpDataForWidgetDefinition.apply(this, arguments);

        var valueNode = {};
        var valueType = this.properties['valueType'].get('value');
        valueNode['type'] = valueType;

        var valueSource = this.properties['valueSource'].get('value');

        switch (valueSource) {
            case 'source':
                    valueNode['i:source'] = {name: widgetData['name']};
                break;
            case 'classAndMethod':
                    valueNode['i:class'] = widgetData['i:class'];
                    valueNode['i:method'] = widgetData['i:method'];
                break;
            case 'item':
                    valueNode['i:source'] = {name: widgetData['name']};
                break;
            case 'static':
                    valueNode['i:source'] = {name: widgetData['name']};
                break;

        }
        return valueNode;
    },
    propertyChanged: function(property){
        afStudio.widgetDesigner.DatasourceNode.superclass.propertyChanged.apply(this, arguments);
        if (property && property.id == 'valueSource') {
            this.valueSourceChanged();
        }
    },
    valueSourceChanged: function(dataForNewNode){
        if (!dataForNewNode) {
            dataForNewNode = {};
        }
        if (this.childNodes.length > 0) {
            var childNode = this.childNodes[0];
            childNode.destroy();
        }

        switch (this.properties['valueSource'].get('value')) {
            case 'source':
                var newNode= new afStudio.widgetDesigner.FieldNodeValueSourceSource();
                if (dataForNewNode['i:source']) {
                    var nodeData = dataForNewNode['i:source'];
                }
                break;
            case 'classAndMethod':
                var newNode= new afStudio.widgetDesigner.FieldNodeValueSourceMethod();
                var nodeData = dataForNewNode;
                break;
            case 'item':
                var newNode= new afStudio.widgetDesigner.FieldNodeValueSourceItem();
                if (dataForNewNode['i:item']) {
                    var nodeData = dataForNewNode['i:item'];
                }
                break;
            case 'static':
                var newNode= new afStudio.widgetDesigner.FieldNodeValueSourceStatic();
                if (dataForNewNode['i:static']) {
                    var nodeData = dataForNewNode['i:static'];
                }
                break;

        }

        if (newNode) {
            if (nodeData) {
                newNode.configureFor(nodeData);
            }
            this.appendChild(newNode);
        }
    },
    dumpChildsData: function(){
        var data = {};
        if (this.childNodes.length > 0) {
            var childNode = this.childNodes[0];
        }
        if (childNode) {
            data = childNode.dumpDataForWidgetDefinition();
        }
        return data;
    },
    configureFor: function(widgetData){
        afStudio.widgetDesigner.DatasourceNode.superclass.configureFor.apply(this, [widgetData]);
        if (widgetData) {
            var iValueData = widgetData;
            this.configureForValue('valueType', iValueData['type']);
            if (iValueData['i:source']) {
                this.properties['valueSource'].set('value', 'source');
            } else if (iValueData['i:class']) {
                this.properties['valueSource'].set('value', 'classAndMethod');
            } else if (iValueData['i:item']) {
                this.properties['valueSource'].set('value', 'item');
            } else if (iValueData['i:static']) {
                this.properties['valueSource'].set('value', 'static');
            }
            this.valueSourceChanged(iValueData);
        }
    }
});
