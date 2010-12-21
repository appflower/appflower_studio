afStudio.widgetDesigner.DatasourceNode = function(data){
    this.loaded = false;
    this.loading = false;
    var config = this.getNodeConfig(data);

//    Ext.apply(this, this._initCmp());
//    afStudio.widgetDesigner.DatasourceNode.superclass.constructor.apply(this, arguments);

	afStudio.widgetDesigner.DatasourceNode.superclass.constructor.apply(this, [config]);
};

Ext.extend(afStudio.widgetDesigner.DatasourceNode, Ext.tree.AsyncTreeNode, {
	getNodeConfig: function(data){
		var node = {};
		if(ds = data['i:datasource']){
			var node = {
				expanded: true, text: 'Datasource',
				itemId: 'datasource', iconCls: 'icon-data'
			};
			
			if(method = ds['i:method']){
				node.children = [
					{text: method.name, itemId: 'method', leaf: true}
				]
			}
		}		
		
		return node;
//		{
//			text: 'This is a test tree node',
//			expanded: true,
//			iconCls: 'icon-plus',
//			children: [
//				{text:'Jack', iconCls:'user', leaf:true}
//			]
//		}
	}
});