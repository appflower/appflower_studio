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
     * should contain widget type
     */
    widgetType : null,
    
    /**
     * @property fieldsNode
     * @type 
     */
    fieldsNode : null,
    
    /**
     * @property datasourceNode
     * @type {afStudio.widgetDesigner.DatasourceNode}
     */
    datasourceNode : null,
    
    getFieldsNode : function() {
        return this.fieldsNode;
    },
    
    getDatasourceNode : function() {
        return this.datasourceNode;
    },
    
    setTitle : function(title) {
        this.getProperty('i:title').set('value', title);
    },
    
    /**
     * template method
     * @override
     * @return {Object} node configuration
     */
    getNodeConfig : function() {
        var config = {
			text: 'Abstract root Object node',
            iconCls: 'icon-obj',
            expanded: true
        };
        
        return config;
	},

    /**
     * template method
     * @override
     */
    createProperties : function() {
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:title', 'Title').create());
        this.addProperty(new afStudio.widgetDesigner.PropertyTypeString('i:description', 'Description').create());
    },
    
    /**
     * template method
     * @override
     */
	addRequiredChilds : function() {
        this.fieldsNode = this.buildFieldsNode();
        this.datasourceNode = new afStudio.widgetDesigner.DatasourceNode;
        this.appendChild(this.datasourceNode);
        this.appendChild(this.fieldsNode);
	},
	
	/**
	 * Abstract template method.
	 * Should be overridden in descendant classes.
	 * @protected
	 */
	buildFieldsNode : Ext.emptyFn,
    
    //private override 
    dumpDataForWidgetDefinition : function() {
        var data = {};
        
        afStudio.widgetDesigner.ObjectRootNode.superclass.dumpDataForWidgetDefinition.call(this, data);
        return data;
    }
    
});
