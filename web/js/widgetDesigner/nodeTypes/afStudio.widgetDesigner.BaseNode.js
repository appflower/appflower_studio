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
     * This method should initialize this.properties with records for GridProperty
     */
    createProperties: function(){return []},
    properties: null,
    /**
     * Returns fields for properties grid
     */
	getProperties: function(){
        if (!this.properties) {
            this.properties = this.createProperties();
        }
        return this.properties;
	},
	
    /**
     * Returns node configuration, something like: {text: 'sadads', iconCls: 'icon'}
     */
    getNodeConfig: Ext.emptyFn,
    _initEvents: Ext.emptyFn,
    getPropertyRecordCfg: Ext.emptyFn
});
