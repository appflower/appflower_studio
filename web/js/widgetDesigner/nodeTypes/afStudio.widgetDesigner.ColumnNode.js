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
        	new afStudio.widgetDesigner.PropertyTypeString('name', 'Name').setValue('Test name'),
			new afStudio.widgetDesigner.PropertyTypeString('style', 'Style').setValue('Test style var').setRequired(),
        	new afStudio.widgetDesigner.PropertyTypeBoolean('is_resizable', 'Resizable').setRequired(),
        	new afStudio.widgetDesigner.PropertyTypeBoolean('is_sortable', 'Sortable').setRequired().setValue(true)
        ]
        
        return this.prepareProperties(properties);
    }
});