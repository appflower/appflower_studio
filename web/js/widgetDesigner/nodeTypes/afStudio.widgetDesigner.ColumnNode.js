/**
 * This node represents i:column node in list type widget
 */
afStudio.widgetDesigner.ColumnNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    constructor: function(){
        afStudio.widgetDesigner.ColumnNode.superclass.constructor.apply(this, arguments);
        var behavior = new afStudio.widgetDesigner.WithValueTypeBehavior;
        behavior.setValueTypeDataKey('i:value');
        this.addBehavior(behavior);
    },
    updateNodeNameFromPropertyId: 'name',

    getNodeConfig: function(){
        return {
            'text': 'new column',
            'iconCls': 'icon-field'
        };
    },
    createProperties: function(){
       var properties = [
            new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create(),
            new afStudio.widgetDesigner.PropertyTypeBoolean('sortable','Sortable').create(),
            new afStudio.widgetDesigner.PropertyTypeBoolean('editable','Editable').create(),
            new afStudio.widgetDesigner.PropertyTypeBoolean('resizable','Resizable').create(),
            new afStudio.widgetDesigner.PropertyTypeString('style','Style').create(),
            new afStudio.widgetDesigner.PropertyTypeString('label','Label').setRequired().create(),
            new afStudio.widgetDesigner.PropertyTypeString('filter','Filter').create(),
       ];

       this.addProperties(properties);
    },
    setNameAndLabel: function(name, label) {
        this.properties['name'].set('value', name);
        this.properties['label'].set('value', label);
    }
});
