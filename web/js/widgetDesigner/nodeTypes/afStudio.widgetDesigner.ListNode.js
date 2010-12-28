afStudio.widgetDesigner.ListNode = Ext.extend(afStudio.widgetDesigner.ObjectRootNode, {
	constructor: function(){

		var node = {
			text: 'New list widget'
		};
        afStudio.widgetDesigner.ListNode.superclass.constructor.apply(this, [node]);

        this.appendChild(new afStudio.widgetDesigner.ActionsNode());
        this.appendChild(new afStudio.widgetDesigner.DatasourceNode());
        this.appendChild(new afStudio.widgetDesigner.FieldsNode());
        this.appendChild(new afStudio.widgetDesigner.ColumnNode());
	},
    getProperties: function(){
        var properties = [
        	new afStudio.widgetDesigner.PropertyTypeString({fieldLabel: 'Title'})
        ];

        return this.prepareProperties(properties);
    },
    configureFor: function(widgetDefinition){
        console.log('going to populate widget tree with data from real widget');
        console.log(widgetDefinition);
    }

});
Ext.reg('afStudio.widgetDesigner.ListNode', afStudio.widgetDesigner.ListNode);