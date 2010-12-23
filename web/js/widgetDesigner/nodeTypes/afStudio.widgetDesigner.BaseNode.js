Ext.namespace('afStudio.widgetDesigner');

N = afStudio.widgetDesigner;

/**
 * BaseNode is common class for all other WI node types
 */
N.BaseNode = function(){
    var config = this.getNodeConfig();
    this.createContextMenu();
    afStudio.widgetDesigner.BaseNode.superclass.constructor.apply(this, [config]);
};
Ext.extend(N.BaseNode, Ext.tree.TreeNode, {
    createContextMenu: function(){
    },
    /**
     * Returns fields for properties grid
     */
	getProperties: function(){
        return {};
	},
	
	/**
	 * Function prepareProperties
	 * Prepares node properties before inserting in PropertyGrid
	 * @param {Array} array of node properties
	 * @return {Object} object with properties which optimized for PropertyGrid
	 */
	prepareProperties: function(props){
		var properties = {};
		for(var i = 0, l = props.length; i<l; i++){
			var p = props[i];
			properties[p.fieldLabel] = p.value;
		}
		return properties;
	},
	
    /**
     * Returns node configuration, something like: {text: 'sadads', iconCls: 'icon'}
     */
    getNodeConfig: function(){

    }
});
