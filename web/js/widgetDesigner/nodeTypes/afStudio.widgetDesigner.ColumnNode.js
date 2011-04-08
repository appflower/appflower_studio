/**
 * This node represents i:column node in list type widget
 */
afStudio.widgetDesigner.ColumnNode = Ext.extend(afStudio.widgetDesigner.ContainerNode, {
	
	/**
	 * ColumnNode constructor.
	 * @constructor
	 */
    constructor : function() {
        afStudio.widgetDesigner.ColumnNode.superclass.constructor.apply(this, arguments);        
        this.initBehavior();
    }//eo constructor

    /**
     * @override
     * @return {Object} this node configuration object
     */
    ,getNodeConfig : function() {
        return {
            'text': 'new column',
            'iconCls': 'icon-field'
        };
    }//eo getNodeConfig
    
    /**
     * @override
     */
    ,createProperties : function() {
       var properties = [
            new afStudio.widgetDesigner.PropertyTypeString('name', 'Name').setRequired().create(),
            new afStudio.widgetDesigner.PropertyTypeBoolean('sortable', 'Sortable').create(),
            new afStudio.widgetDesigner.PropertyTypeBoolean('editable', 'Editable').create(),
            new afStudio.widgetDesigner.PropertyTypeBoolean('resizable', 'Resizable').create(),
            new afStudio.widgetDesigner.PropertyTypeString('style', 'Style').create(),
            new afStudio.widgetDesigner.PropertyTypeString('label', 'Label').setRequired().create(),
            new afStudio.widgetDesigner.PropertyTypeString('filter', 'Filter').create()
       ];

       this.addProperties(properties);
    }//eo createProperties
    
    /**
     * Sets name and value properties.
     * @protected
     * @param {String} name
     * @param {String} label
     */
    ,setNameAndLabel : function(name, label) {
        this.properties['name'].set('value', name);
        this.properties['label'].set('value', label);
    }//eo setNameAndLabel
    
    /**
     * @private
     */
    ,initBehavior : function() {
        var behavior = new afStudio.widgetDesigner.WithValueTypeBehavior;        
        behavior.setValueTypeDataKey('i:value');
        this.addBehavior(behavior);
        this.addBehavior(new afStudio.widgetDesigner.WithNamePropertyAsLabelBehavior);
    }//eo initBehavior
});
