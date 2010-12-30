afStudio.widgetDesigner.MethodNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
	getNodeConfig: function(){
        var node = {
            leaf: true,
            text: 'method',
            id: 'i:method'
        };
        return node;
	},
    addParam: function(){
        var newNode = new afStudio.widgetDesigner.ParamNode;
        this.appendChild(newNode);
        if (this.rendered) {
            this.expand();
        }
        return newNode;
    },
    configureForValue: function(id, value){
        if (id == 'i:param') {
            if (!Ext.isArray(value)) {
                value = [value];
            }
            for(var i=0;i<value.length;i++){
                var newNode = this.addParam();
                newNode.configureFor(value[i]);
            }
        } else {
            afStudio.widgetDesigner.MethodNode.superclass.configureForValue.apply(this, arguments);
        }
    },
    createProperties: function(){
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('name','Name').setRequired().create());
    }
});
