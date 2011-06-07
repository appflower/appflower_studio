Ext.namespace('afStudio.wi');

/**
 * Abstract class.
 * BaseNode is common class for all other widget node types.
 * It can contain nested elements which are some specific NodeTypes but even childs are based on BaseNode.
 * It can also contain properties that reflects XML attributes
 *
 * This class is <b>abstract</b> class - you should not use it. Instead use CollectionNode or ContainerNode class.
 * 
 * @class afStudio.wi.BaseNode
 * @extends Ext.tree.TreeNode
 */
afStudio.wi.BaseNode = Ext.extend(Ext.data.Node, {
	constructor : function(config) {
		config = Ext.apply(config || this.getNodeConfig(), {
			editable: false
		});
	    afStudio.wi.BaseNode.superclass.constructor.call(this, config);
	    
	    this.createProperties();
	    this.addRequiredChilds();
	    this.behaviors = [];
        
        // new code
        this.attributes['label'] = config.text;
        
        
	}//eo constructor
	
    /**
     * Abstract template method.
     * Returns node configuration, something like: {text: 'sadads', iconCls: 'icon'}
     * @protected
     */
    ,getNodeConfig : Ext.emptyFn
	
    /**
     * Abstract template method. 
     * This method should initialize this.properties with records for GridProperty
     * @protected
     */
    ,createProperties : function() {
		return [];
	}

    /**
     * Template method.
     * If given node should have some childs when builded - this method should do this.
     * @protected
     */
    ,addRequiredChilds : Ext.emptyFn
	
    /**
     * Returns fields for properties grid
     *
     * @return array
     */
	,getProperties : function() {
        var properties = [];
        for(i in this.properties) {
            properties.push(this.properties[i]);
        }

        return properties;
	}//eo getProperties
	
	/**
	 * Returns property.
	 * @param {String} id The property ID
	 * @return {Ext.data.Record} property
	 */
    ,getProperty : function(id) {
        return this.properties[id];
    }//eo getProperty
    
    /**
     * Returns property's value.
     * @param {String} id The property ID.
     * @return {Mixed} value
     */
    ,getPropertyValue : function(id) {
    	return this.properties[id].get('value');
    }//eo getPropertyValue
    
    /**
     * Sets property's value.
     * @param {String} id The property ID which value being set.
     * @param {Mixed} value The value to set.
     */
    ,setProperty : function(id, value) {
    	this.getProperty(id).set('value', value);
    }//eo setProperty
    
    /**
     * Adds property to {@link #properties} properties array.
     * @param {PropertyBaseType} property
     */
    ,addProperty : function(property) {
        if (!this.properties) {
            this.properties = {};
        }

        property.WITreeNode = this;
        this.properties[property.id] = property;
    }//eo addProperty
    
    /**
     * Adds properties.
     * @param {Array} properties
     */
    ,addProperties : function(properties) {
        for (var i = 0; i < properties.length; i++) {
            this.addProperty(properties[i]);
        }
    }//eo addProperties
    
    /**
     * 
     * 
     * @protected
     * @param {Object} widgetData
     */
    ,configureFor : function(widgetData) {
        for (var id in widgetData) {
            this.configureForValue(id, widgetData[id]);
        }
        for (var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].configureFor(widgetData);
        }
    }//eo configureFor
    
    /**
     * @protected
     * @param {String} id The metadata key (i.e. i:datasource, i:fields, i:column, i:title, type)
     * @param {Mixed} value The key's value
     */
    ,configureForValue : function(id, value) {
        if (this.properties && this.properties[id]) {
            var property = this.getProperty(id);
            property.set('value', value);
            this.propertyChanged(property);
        } else {
            var child = this.findChild('id', id);
            if (child) {
                child.configureFor(value);
            } else {
                child = this.findChild('childNodeId', id);
                if (child) {
                    var tmpObj = {};
                    tmpObj[id] = value;
                    child.configureFor(tmpObj);
                }
            }
        }
    }//eo configureForValue

    /**
     * Reflects node behavior to changed property.
     * @protected
     * @param {PropertyBaseType} property The changed property
     */
    ,propertyChanged : function(property) {
        if (!property) {
            return;
        }
        
        for (var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].propertyChanged(property);
        }
    }//eo propertyChanged
    
    /**
     * Returns dumped node's object containing all node's properties and children data.
     * @protected
     * 
     * @param {Object} (optional) data
     * @return {Object} node's dumped object
     */
    ,dumpDataForWidgetDefinition : function(data) {
        if (!data) {
            data = {};
        }
        var childsData = this.dumpChildsData();
        var propertiesData = this.dumpPropertiesData();

        //TODO: properties are overwriting values that came from childs - this can be dangerous
        Ext.apply(childsData, propertiesData);

        for (var i = 0; i < this.behaviors.length; i++) {
            childsData = this.behaviors[i].dumpDataForWidgetDefinition(childsData);
        }

        if (this.id.substr(0, 6) == 'xnode-') {
            for (i in childsData) {
                data[i] = childsData[i];
            }
        } else {
            data[this.id] = childsData;
        }

        return data;
    }//eo dumpDataForWidgetDefinition
    
    /**
     * @protected
     * @return {Object}
     */
    ,dumpChildsData : function() {
        var data = {};
        this.eachChild(function(childNode) {        	
            data = childNode.dumpDataForWidgetDefinition(data);
        });
        return data;
    }//eo dumpChildsData
    
    /**
     * @protected
     * @return {Object}
     */
    ,dumpPropertiesData : function() {
        var data = {};

        for (i in this.properties) {
            var property = this.properties[i];
            var propertyValue = property.get('value');
            // for boolean values we want them to travel as 'true' and 'false' strings
            if (propertyValue === false) {
                propertyValue = 'false';
            } else if (propertyValue === true) {
                propertyValue = 'true';
            }
            
            if (!Ext.isEmpty(property.id) && propertyValue != '' && propertyValue != 'false') {
            	data[property.id] = propertyValue;	
            }
        }
        
        return data;
    }//eo dumpPropertiesData
    
    /**
     * Abstract method.
     * Not used for now anywhere.
     * @protected 
     */
    ,getPropertyRecordCfg : Ext.emptyFn
    
    /**
     * Adds behavior to given node.
     * @protected
     * @param {BaseBehavior} WITreeNodeBehavior The node behavior (subclass of {@link BaseBehavior})
     */
    ,addBehavior : function(WITreeNodeBehavior) {
        WITreeNodeBehavior.setNode(this);
        this.behaviors.push(WITreeNodeBehavior);
        this.addProperties(WITreeNodeBehavior.createBehaviorProperties());
    }//eo addBehavior
    /**
     * Returns human readable label for given node
     */
    ,getLabel : function() {
        return this.attributes.label;
    }//eo addBehavior
    ,isCollectionType: function() {
        return false;
    }
});