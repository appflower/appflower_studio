afStudio.widgetDesigner.DatasourceNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
    addRequiredChilds: function(){
        this.appendChild(new afStudio.widgetDesigner.MethodNode());
    },
    createProperties: function(){
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeChoice('type','Type')
                .setChoices({
                	'orm':'orm',
                	'file':'file',
          			'static': 'static'
				})
                .create()
        );
        this.addProperty(
            new afStudio.widgetDesigner.PropertyTypeString('class','Class')
                .create()
        );
    },
	getNodeConfig: function(data){
        var node = {
            text: 'Datasource',
            id: 'i:datasource'
        };
        return node;
	}
});