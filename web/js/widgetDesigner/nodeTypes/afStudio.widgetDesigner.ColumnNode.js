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
            new afStudio.widgetDesigner.PropertyBaseType('i:name','Name').setRequired().create(),
//            new afStudio.widgetDesigner.PropertyBaseType('i:style','Style').create(),
//            new afStudio.widgetDesigner.PropertyTypeBoolean('i:somebool','true or false').create(),
            new afStudio.widgetDesigner.PropertyTypeChoice('i:datasourceType','Type').setChoices(
          		{
          			'static': 'Static method implementation',
                	'orm':'Implementation based on Criteria object' 
				}
			).create()
        ];
        return properties;
    }
});