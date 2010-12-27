afStudio.widgetDesigner.ListNode = Ext.extend(afStudio.widgetDesigner.ObjectRootNode, {
	constructor: function(){

		var node = {
			text: 'New list widget'
		};
        afStudio.widgetDesigner.ListNode.superclass.constructor.apply(this, [node]);

        this.appendChild(new afStudio.widgetDesigner.ActionsNode());
        this.appendChild(new afStudio.widgetDesigner.DatasourceNode());
        this.appendChild(new afStudio.widgetDesigner.FieldsNode());
	},
    getProperties: function(){
        var properties = [
        	new afStudio.widgetDesigner.PropertyTypeString({fieldLabel: 'Title'})
        ];

        return this.prepareProperties(properties);
    }

});
Ext.reg('afStudio.widgetDesigner.ListNode', afStudio.widgetDesigner.ListNode);