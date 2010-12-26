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
        	new afStudio.widgetDesigner.PropertyTypeString({fieldLabel: 'Name', value: 'empty', required: true}),
        	new afStudio.widgetDesigner.PropertyTypeBoolean({fieldLabel: 'Resizable', value: false, required: true}),
        	new afStudio.widgetDesigner.PropertyTypeBoolean({fieldLabel: 'Sortable', value: true, required: false})
        ]
        
        return this.prepareProperties(properties);
    }
});