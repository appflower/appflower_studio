/**
 * Abstract class.
 * This parent class for {@link afStudio.wi.EditNode} edit and {@link afStudio.wi.ListNode} list nodes.
 * Each of them has datasource node and fields node
 * Fields is collecion of "i:column" for list widget and collection of "i:field" for edit widget
 * 
 * @class afStudio.wi.ObjectRootNode
 * @extends afStudio.wi.BaseNode
 */ 
afStudio.wi.ObjectRootNode = Ext.extend(afStudio.wi.BaseNode, {
    /**
     * Contains one of widget's types: <u>list, edit, show, html</u> 
     * @property widgetType
     * @type {String}
     */
    
    /**
     * @property fieldsNode
     * @type {afStudio.wi.FieldsNode}
     */
    
    /**
     * @property datasourceNode
     * @type {afStudio.wi.DatasourceNode}
     */
    
    /**
     * Returns fields node.
     * @return {afStudio.wi.FieldsNode} fieldsNode
     */
    getFieldsNode : function() {
        return this.fieldsNode;
    }
    
    /**
     * Returns datasource node.
     * @return {afStudio.wi.DatasourceNode} datasourceNode
     */
    ,getDatasourceNode : function() {
        return this.datasourceNode;
    }
    
    /**
     * Sets title <b>i:title</b> property of this node.
     * @protected
     * @param {String} title
     */
    ,setTitle : function(title) {
        this.getProperty('i:title').set('value', title);
    }//eo setTitle 
    
    /**
     * template method
     * @override
     * @return {Object} node configuration
     */
    ,getNodeConfig : function() {
        var config = {
			text: 'Abstract root Object node',
            iconCls: 'icon-obj',
            expanded: true
        };
        
        return config;
	}//eo getNodeConfig

    /**
     * template method
     * @override
     */
    ,createProperties : function() {
        this.addProperty(new afStudio.wi.PropertyTypeString({id: 'i:title', label: 'Title'}).create());
        this.addProperty(new afStudio.wi.PropertyTypeString({id: 'i:description', label: 'Description'}).create());
    }//eo createProperties
    
    /**
     * template method
     * @protected
     * @override
     */
	,addRequiredChilds : function() {
        this.fieldsNode = this.buildFieldsNode();
        this.datasourceNode = new afStudio.wi.DatasourceNode();
        this.appendChild(this.datasourceNode);
        this.appendChild(this.fieldsNode);
	}//eo addRequiredChilds
	
	/**
	 * Abstract template method.
	 * Should be overridden in descendant classes.
	 * 
	 * @protected
	 */
	,buildFieldsNode : Ext.emptyFn
    ,createNewNodeFor: function(WDNode) {
        var newWDNode = WDNode.addChild();
        this.fireEvent('nodeCreated', newWDNode);
    }
    ,deleteNode: function(WDNode) {
        var parentWDNode = WDNode.parentNode;
        parentWDNode.deleteChild(WDNode);
        this.fireEvent('nodeDeleted', WDNode);
    }
});

Ext.apply(afStudio.wi.ObjectRootNode, Ext.util.Observable);
