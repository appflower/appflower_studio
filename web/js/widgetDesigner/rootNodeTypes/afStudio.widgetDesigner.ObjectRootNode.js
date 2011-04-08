/**
 * Abstract class.
 * This parent class for {@link afStudio.widgetDesigner.EditNode} edit and {@link afStudio.widgetDesigner.ListNode} list nodes.
 * Each of them has datasource node and fields node
 * Fields is collecion of "i:column" for list widget and collection of "i:field" for edit widget
 * 
 * @class afStudio.widgetDesigner.ObjectRootNode
 * @extends afStudio.widgetDesigner.BaseNode
 */ 
afStudio.widgetDesigner.ObjectRootNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    /**
     * Contains one of widget's types: <u>list, edit, show, html</u> 
     * @property widgetType
     * @type {String}
     */
    
    /**
     * @property fieldsNode
     * @type {afStudio.widgetDesigner.FieldsNode}
     */
    
    /**
     * @property datasourceNode
     * @type {afStudio.widgetDesigner.DatasourceNode}
     */
    
    /**
     * Returns fields node.
     * @return {afStudio.widgetDesigner.FieldsNode} fieldsNode
     */
    getFieldsNode : function() {
        return this.fieldsNode;
    }
    
    /**
     * Returns datasource node.
     * @return {afStudio.widgetDesigner.DatasourceNode} datasourceNode
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
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:title', 'Title').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:description', 'Description').create());
    }//eo createProperties
    
    /**
     * template method
     * @protected
     * @override
     */
	,addRequiredChilds : function() {
        this.fieldsNode = this.buildFieldsNode();
        this.datasourceNode = new afStudio.widgetDesigner.DatasourceNode();
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
     
	/**
	 * @protected
	 * @override
	 * @return {Object}
	 */
    ,dumpDataForWidgetDefinition : function() {
        var data = {};
        
        afStudio.widgetDesigner.ObjectRootNode.superclass.dumpDataForWidgetDefinition.call(this, data);
        return data;
    }//eo dumpDataForWidgetDefinition
    
});
