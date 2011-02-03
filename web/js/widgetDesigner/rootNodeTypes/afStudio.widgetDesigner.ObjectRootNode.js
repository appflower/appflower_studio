/**
 * This is common object for edit and list widget types
 *
 * Each of them has datasource node and fields node
 * Fields is colleciont of "i:column" for list widget and collection of "i:field" for edit widget
 **/
afStudio.widgetDesigner.ObjectRootNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    /**
     * should contain widget type
     */
    widgetType: null,
    fieldsNode: null,
    datasourceNode: null,
	getNodeConfig: function(){
        var config = {
			text: 'Abstract root Object node',
            iconCls: 'icon-obj',
            expanded: true
        };
        return config;
	},
	addRequiredChilds: function(){
        this.fieldsNode = this.buildFieldsNode();
        this.datasourceNode = new afStudio.widgetDesigner.DatasourceNode;
        this.appendChild(this.datasourceNode);
        this.appendChild(this.fieldsNode);
	},
    getFieldsNode: function(){
        return this.fieldsNode;
    },
    getDatasourceNode: function(){
        return this.datasourceNode;
    },
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:title','Title').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:description','Description').create());
    },
    dumpDataForWidgetDefinition: function(){
        var data = {};
        afStudio.widgetDesigner.ObjectRootNode.superclass.dumpDataForWidgetDefinition.apply(this, [data]);
        return data;
    }
});
