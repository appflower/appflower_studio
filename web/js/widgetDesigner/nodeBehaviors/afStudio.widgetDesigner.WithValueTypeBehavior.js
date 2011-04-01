/**
 * This is behavior class for nodes that should containt ValueType element
 * So node WithValueTypeBehavior contains valueType and valueSource properties and based on their values
 * there is child node created that allows to make further configuration of i:value node
 * This node also needs custom code that sets its initial values from XML and
 * also custom code that dumps its data back to JSON so they can be written back to XML
 **/
Ext.namespace('afStudio.widgetDesigner');
afStudio.widgetDesigner.WithValueTypeBehavior = Ext.extend(afStudio.widgetDesigner.BaseBehavior, {
    setValueTypeDataKey: function(key) {
        this.key = key;
    },
    /**
     * Adding custom properties
     */
    createBehaviorProperties: function() {
        return [
            new afStudio.widgetDesigner.ValueType().create(),
            new afStudio.widgetDesigner.ValueSource().create()
        ];
    },
    getValueTypeData: function(widgetData) {
        if (this.key) {
            if (widgetData[this.key]) {
                return widgetData[this.key];
            } else {
                return {};
            }
        } else {
            return widgetData;
        }
    },
    mergeInValueTypeData: function(widgetData, valueTypeData) {
        if (this.key) {
            widgetData[this.key] = valueTypeData;
        } else {
            for (i in valueTypeData) {
                widgetData[i] = valueTypeData[i];
            }
        }
        return widgetData;
    },
    /**
     * Reading data from widget definition
     */
    configureFor: function(widgetData) {
        if (widgetData) {
            var valueTypeData = this.getValueTypeData(widgetData);
            this.node.getProperty('valueType').set('value', valueTypeData['type']);
            var valueSourceProperty = this.node.getProperty('valueSource');
            if (valueTypeData['i:source']) {
                valueSourceProperty.set('value', 'source');
            } else if (valueTypeData['i:class']) {
                valueSourceProperty.set('value', 'classAndMethod');
            } else if (valueTypeData['i:item']) {
                valueSourceProperty.set('value', 'item');
            } else if (valueTypeData['i:static']) {
                valueSourceProperty.set('value', 'static');
            }
            this.valueSourceChanged(valueTypeData);
        }
    },
    /**
     * When valueSource is changed we are injecting ValueSource child
     */
    valueSourceChanged: function(dataForNewNode){
        if (!dataForNewNode) {
            dataForNewNode = {};
        }
        if (this.node.rendered) {
            var childsCount = this.node.childNodes.length;
            if (childsCount > 0) {
                for (i = (childsCount-1); i >= 0; i--) {
                    var childNode = this.node.childNodes[i];
                    if (childNode.text == 'Value Source') {
                        childNode.destroy();
                    }
                }
            }
        }

        switch (this.node.getProperty('valueSource').get('value')) {
            case 'source':
                var newNode= new afStudio.widgetDesigner.FieldNodeValueSourceSource();
                if (dataForNewNode['i:source']) {
                    var nodeData = dataForNewNode['i:source'];
                    nodeData['sourceName'] = nodeData['name'];
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
            this.node.appendChild(newNode);
        }
    },
    /**
     * We need to detect when valueSource was changed
     */
    propertyChanged: function(property){
        if (property.id == 'valueSource') {
            this.valueSourceChanged();
        }
    },
    /**
     * now we must build data that is send back to server 
     */
    dumpDataForWidgetDefinition: function(nodeWidgetData){
        
        if (nodeWidgetData['valueType']) {
            delete nodeWidgetData.valueType;
        }

        if (nodeWidgetData['valueSource']) {
            delete nodeWidgetData.valueSource;
        }

        var valueType = this.node.getProperty('valueType').get('value');
        var valueSource = this.node.getProperty('valueSource').get('value');

        var valueNode = {};
        
        if (valueType) {
            valueNode['type'] = valueType;
        } else {
            valueNode['type'] = 'orm';
        }

        if (valueNode['type'] == 'orm') {
            switch (valueSource) {
                case 'source':
                        valueNode['i:source'] = {name: nodeWidgetData['sourceName']};
                        delete nodeWidgetData['sourceName'];
                        nodeWidgetData = this.mergeInValueTypeData(nodeWidgetData, valueNode);
                    break;
                case 'classAndMethod':
                        valueNode['i:class'] = nodeWidgetData['i:class'];
                        if (nodeWidgetData['i:method'] && nodeWidgetData['i:method'] != '') {
                            valueNode['i:method'] = {
                                name: nodeWidgetData['i:method'],
                                'i:param': nodeWidgetData['i:param']
                            }
                            delete nodeWidgetData['i:param'];
                            delete nodeWidgetData['i:class'];
                            delete nodeWidgetData['i:method'];
                        }
                        nodeWidgetData = this.mergeInValueTypeData(nodeWidgetData, valueNode);
                    break;
                case 'item':
                        valueNode['i:source'] = {name: nodeWidgetData['name']};
                        nodeWidgetData = this.mergeInValueTypeData(nodeWidgetData, valueNode);
                    break;
                case 'static':
                        valueNode['i:source'] = {name: nodeWidgetData['name']};
                        nodeWidgetData = this.mergeInValueTypeData(nodeWidgetData, valueNode);
                    break;

            }
        }

        return nodeWidgetData;
    }
});
