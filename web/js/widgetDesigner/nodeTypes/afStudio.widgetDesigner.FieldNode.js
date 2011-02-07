/**
 * This node represents i:field node in edit type widget
 */
afStudio.widgetDesigner.FieldNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    constructor: function(){
        afStudio.widgetDesigner.FieldNode.superclass.constructor.apply(this, arguments);
        var behavior = new afStudio.widgetDesigner.WithValueTypeBehavior;
        behavior.setValueTypeDataKey('i:value');
        this.addBehavior(behavior);
        this.addBehavior(new afStudio.widgetDesigner.WithNamePropertyAsLabelBehavior);
    },
    addRequiredChilds: function(){
        var validatorsNode = new afStudio.widgetDesigner.ValidatorsNode;
        this.appendChild(validatorsNode);
    },
    getNodeConfig: function(){
        return {
            'text': 'new field',
            'iconCls': 'icon-field'
        };
    },
    createProperties: function(){
       var properties = [
            new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create(),
            new afStudio.widgetDesigner.PropertyTypeString('label','Label').create(),
            new afStudio.widgetDesigner.FieldType().create(),
            new afStudio.widgetDesigner.PropertyTypeString('state','State').create(),
            new afStudio.widgetDesigner.PropertyTypeString('style','Style').create(),
       ];

       this.addProperties(properties);
    },
    setNameAndLabel: function(name, label) {
        this.properties['name'].set('value', name);
        this.properties['label'].set('value', label);
    }
});
