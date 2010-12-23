afStudio.widgetDesigner.ColumnNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
	getNodeConfig: function(){
        var node = {
            iconCls: 'icon-field',
            text: 'column name'
        }
        return node;
	},
    getProperties: function(){
        var properties = {
            'Editable': 'empty',
            'Filter': 'empty',
            'Label': 'empty',
            'Name': 'empty',
            'Resizable': 'empty',
            'Sortable': 'empty',
            'Style': 'empty',

            'Grouping': 'empty',
            'Cache': 'empty',
            'Icon Class': 'empty',
            'Tooltip': 'empty',
            'Condition': 'empty'
        };
        
        var properties = [
        	new afStudio.widgetDesigner.PropertyTypeString('Name', 'empty'),
        	new afStudio.widgetDesigner.PropertyTypeBoolean('Resizable', false),
        	new afStudio.widgetDesigner.PropertyTypeBoolean('Sortable', true)
        ]
        
        return this.prepareProperties(properties);
    }
});