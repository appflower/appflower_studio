/**
 * This node represents i:field node in edit type widget
 * @class afStudio.wi.FieldNode
 * @extends afStudio.wi.ContainerNode
 */ 
afStudio.wi.FieldNode = Ext.extend(afStudio.wi.ContainerNode, {
	
	/**
	 * FieldNode constructor. 
	 * @constructor
	 */
    constructor : function() {
        afStudio.wi.FieldNode.superclass.constructor.apply(this, arguments);
        
        var behavior = new afStudio.wi.WithValueTypeBehavior;
        behavior.setValueTypeDataKey('i:value');
        this.addBehavior(behavior);
        this.addBehavior(new afStudio.wi.WithNamePropertyAsLabelBehavior);
    }//eo constructor

    /**
     * template method
     * @override
     * @return {Object} this node configuration object
     */
    ,getNodeConfig : function() {
        return {
            'text': 'new field',
            'iconCls': 'icon-field'
        };
    }//eo getNodeConfig
    
    /**
     * template method
     * @override
     */    
    ,createProperties: function(){
       var properties = [
            new afStudio.wi.PropertyTypeString('name','Name').setRequired().create(),
            new afStudio.wi.PropertyTypeString('label','Label').create(),
            new afStudio.wi.FieldType().create(),
            new afStudio.wi.PropertyTypeString('state','State').create(),
            new afStudio.wi.PropertyTypeString('style','Style').create()
       ];

       this.addProperties(properties);
    }//eo createProperties
    
    /**
     * template method
     * @override
     */
    ,addRequiredChilds: function(){
        this.validatorsNode = new afStudio.wi.ValidatorsNode;
        this.appendChild(this.validatorsNode);
    }//eo addRequiredChilds    
    
    ,setNameAndLabel : function(name, label) {
        this.properties['name'].set('value', name);
        this.properties['label'].set('value', label);
    }
    
    ,setTypeAndValidatorFromModelType : function(fieldData) {
        this.setTypeFromModelType(fieldData.type);
        if (fieldData.required) {
            var validator = this.validatorsNode.addChild();
            validator.getProperty('name').set('value', 'immValidatorRequired');
        }
    }
    
    ,setTypeFromModelType : function(modelType) {
        var type = '';
        
        if (modelType.substr(0, 7) == 'varchar') {
            modelType = 'varchar';
        }
        
        switch (modelType) {
            case 'integer':
            	type = 'input';
            break;
            case 'varchar':
            	type = 'input';
            break;
            case 'longvarchar':
            	type = 'textarea';
            break;
            case 'timestamp':
            	type = 'input';
            break;
            case 'boolean':
            	type = 'checkbox';
            break;
            default: break; // something new ?
        }

        this.properties['type'].set('value', type);
    }//eo setTypeFromModelType
});
