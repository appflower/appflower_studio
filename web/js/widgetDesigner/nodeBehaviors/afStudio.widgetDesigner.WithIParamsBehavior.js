/**
 * Some nodes can have parameters defined like below
 * <i:params>
 *   <i:param name="param_name">VALUE</i:param>
 * </i:params>
 *
 * Concrete example here would be list type widget and its maxperpage parameter
 *
 **/
Ext.namespace('afStudio.widgetDesigner');
afStudio.widgetDesigner.WithIParamsBehavior = Ext.extend(afStudio.widgetDesigner.BaseBehavior, {
    setProperties: function(properties) {
        this.properties = properties;
    },
    /**
     * Adding custom properties
     */
    createBehaviorProperties: function() {
        return this.properties;
    },
    /**
     * Reading data from widget definition
     */
    configureFor: function(widgetData) {
        if (widgetData['i:params']) {
            var iParams = widgetData['i:params'];
            delete widgetData['i:params'];

            if (!iParams['i:param']) {
                return;
            }

            if (Ext.isArray(iParams['i:param'])) {
                iParams = iParams['i:param'];
            } else {
                iParams = [iParams['i:param']];
            }

            var iParamsByName = {};
            for (var i = 0; i < iParams.length; i++) {
                iParamsByName[iParams[i]['name']] = iParams[i]['_content'];
            }

            for (var i = 0; i < this.properties.length; i++) {
                var currentProperty = this.properties[i];
                var propertyName = currentProperty.id;
                if (iParamsByName[propertyName]) {
                    currentProperty.set('value', iParamsByName[propertyName]);
                }
            }
        }
    },
    /**
     * now we must build data that is send back to server 
     */
    dumpDataForWidgetDefinition: function(nodeWidgetData)
    {
        var iParams = [];

        for (var i = 0; i < this.properties.length; i++) {
            var currentProperty = this.properties[i];
            var propertyName = currentProperty.id;
            if (nodeWidgetData[propertyName]) {
                iParams.push({
                    'name': propertyName,
                    '_content': currentProperty.get('value')
                });
            }
            delete nodeWidgetData[propertyName];
        }

        nodeWidgetData['i:params'] = {
            'i:param': iParams
        };

        return nodeWidgetData;
    }
});
