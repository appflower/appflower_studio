/**
 * This node represents i:column node in list type widget
 * @class afStudio.wi.ColumnNode
 * @extends afStudio.wi.ContainerNode
 */
afStudio.wi.ColumnNode = Ext.extend(afStudio.wi.ContainerNode, {
	
	/**
	 * ColumnNode constructor.
	 * @constructor
	 */
    constructor : function() {
        afStudio.wi.ColumnNode.superclass.constructor.apply(this, arguments);
        this.initBehavior();
    }//eo constructor

    /**
     * template method
     * @override
     * @return {Object} this node configuration object
     */
    ,getNodeConfig : function() {
        return {
            'text': 'new column',
            'iconCls': 'icon-field',
            'metaField': 'i:column'
        };
    }//eo getNodeConfig
    
    /**
     * template method
     * @override
     */
    ,createProperties : function() {
       var properties = [
            new afStudio.wi.PropertyTypeString('name', 'Name').setRequired().create(),
            new afStudio.wi.PropertyTypeBoolean('sortable', 'Sortable').create(),
            new afStudio.wi.PropertyTypeBoolean('editable', 'Editable').create(),
            new afStudio.wi.PropertyTypeBoolean('resizable', 'Resizable').create(),
            new afStudio.wi.PropertyTypeString('style', 'Style').create(),
            new afStudio.wi.PropertyTypeString('label', 'Label').setRequired().create(),
            new afStudio.wi.PropertyTypeString('filter', 'Filter').create()
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
        var behavior = new afStudio.wi.WithValueTypeBehavior;
        behavior.setValueTypeDataKey('i:value');
        this.addBehavior(behavior);
        this.addBehavior(new afStudio.wi.WithNamePropertyAsLabelBehavior);
    }//eo initBehavior
});
