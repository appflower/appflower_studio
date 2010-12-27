Ext.namespace('afStudio.widgetDesigner');

N = afStudio.widgetDesigner;

/**
 * BaseNode is common class for all other WI node types
 * @param {Object} 
 */
N.BaseNode = function(config){
    if (!config) {
        config = this.getNodeConfig();
    }
    this.createContextMenu();
    afStudio.widgetDesigner.BaseNode.superclass.constructor.apply(this, [config]);
    this._initEvents();
};
Ext.extend(N.BaseNode, Ext.tree.TreeNode, {
    createContextMenu: Ext.emptyFn,
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
		for(var i = 0, l = props.length; i<l; i++){
            if (!props[i].value) {
                props[i].value = '';
            }
		}
		return props;
	},
	
    /**
     * Returns node configuration, something like: {text: 'sadads', iconCls: 'icon'}
     */
    getNodeConfig: Ext.emptyFn,
    _initEvents: Ext.emptyFn
});
