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
            text: 'newcolumn',
            iconCls: 'icon-field',
            metaField: 'i:column'
        };
    }//eo getNodeConfig
    
    /**
     * template method
     * @override
     */
    ,createProperties : function() {    	
		var properties = [
       		new afStudio.wi.PropertyTypeString({id: 'label', label: 'Label', value: 'NewColumn', required: true}).create(),
            new afStudio.wi.PropertyTypeString({id: 'name', label: 'Name', value: 'newcolumn', required: true}).create(),
            new afStudio.wi.PropertyTypeBoolean({id: 'qtip', label: 'Qtip', defaultValue: false}).create(),
            new afStudio.wi.PropertyBaseType({id: 'width', label: 'Width', type: 'posint'}).create(), 
            new afStudio.wi.PropertyTypeBoolean({id: 'sortable', label: 'Sortable'}).create(),
            new afStudio.wi.PropertyTypeBoolean({id: 'editable', label: 'Editable'}).create(),
            new afStudio.wi.PropertyTypeBoolean({id: 'resizable', label: 'Resizable'}).create(),
            new afStudio.wi.PropertyTypeBoolean({id: 'groupField', label: 'GroupField'}).create(),
            new afStudio.wi.AlignType().create(),
            new afStudio.wi.PropertyTypeBoolean({id: 'hidden', label: 'Hidden'}).create(),            
            new afStudio.wi.PropertyTypeBoolean({id: 'hideable', label: 'Hideable', defaultValue: true}).create(),
            new afStudio.wi.PropertyTypeString({id: 'style', label: 'Style'}).create(),            
            new afStudio.wi.PropertyTypeString({id: 'filter', label: 'Filter'}).create()
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
