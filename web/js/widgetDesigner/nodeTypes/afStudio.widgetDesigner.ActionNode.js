/**
 * This node represents i:action node in edit type widget
 **/
afStudio.widgetDesigner.ActionNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    constructor: function(){
        afStudio.widgetDesigner.ActionNode.superclass.constructor.apply(this, arguments);
        this.addBehavior(new afStudio.widgetDesigner.WithNamePropertyAsLabelBehavior);
    },
    getNodeConfig: function(){
        return {
            'text': 'new action'
        };
    },
    createProperties: function(){
       var properties = [
           new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create(),
           new afStudio.widgetDesigner.PropertyTypeString('url','Url').setRequired().create(),
           new afStudio.widgetDesigner.PropertyTypeString('iconCls','Icon CSS class').create(),
           new afStudio.widgetDesigner.PropertyTypeString('icon','Icon URL').create(),
           new afStudio.widgetDesigner.PropertyTypeBoolean('forceSelection','Force selection').create(),
           new afStudio.widgetDesigner.PropertyTypeBoolean('post','Post').create(),
           new afStudio.widgetDesigner.PropertyTypeString('tooltip','Tooltip').create(),
           new afStudio.widgetDesigner.PropertyTypeString('confirmMsg','Confirm message').create(),
           new afStudio.widgetDesigner.PropertyTypeString('condition','Condition').create()
       ];

       this.addProperties(properties);
    }
});
