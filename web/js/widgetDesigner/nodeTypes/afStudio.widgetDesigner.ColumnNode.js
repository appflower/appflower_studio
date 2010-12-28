afStudio.widgetDesigner.ColumnNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
	getNodeConfig: function(){
        var node = {
            iconCls: 'icon-field',
            text: 'column name'
        }
        return node;
	},
    createProperties: function(){
        var properties = [
        	new afStudio.widgetDesigner.PropertyRecord({
                    name: 'Name', value: '', required: 'Mandatory'
                }, 'Name'
            ),
        	new afStudio.widgetDesigner.PropertyRecord({
                    name: 'Style', value: '', required: 'Optional'
                }, 'Style'
            )
        ];
        return properties;
    }
});