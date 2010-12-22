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
     * Returns node configuration, something like: {text: 'sadads', iconCls: 'icon'}
     */
    getNodeConfig: function(){

    }
});
