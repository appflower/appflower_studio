Ext.namespace('afStudio.widgetDesigner');

/**
 * Abstract class.
 * BaseNode is common class for all other WI node types.
 * It can contain nested elements which are some specific NodeTypes but even childs are based on BaseNode.
 * It can also contain parameters which are accessed through Properties Grid displayed under WI tree.
 *
 * This class is <b>abstract</b> class - you should not use it. Instead use CollectionNode or ContainerNode class.
 * 
 * @class afStudio.widgetDesigner.BaseNode
 * @extends Ext.tree.TreeNode
 */
afStudio.widgetDesigner.BaseNode = Ext.extend(Ext.tree.TreeNode, {
	/**
	 * Read-only. Contains reference to this node context-menu.
	 * To set up this property use {@link #createContextMenu} method.
	 * @property contextMenu
	 * @type {Ext.menu.Menu}
	 */
	
	/**
	 * BaseNode constructor.
	 * @param {Object} config The base node configuration object
	 */
	constructor : function(config) {
		config = config || this.getNodeConfig();
	    this.createContextMenu();
	    
	    afStudio.widgetDesigner.BaseNode.superclass.constructor.call(this, config);
	    
	    this._initEvents();
	    this.createProperties();
	    this.addRequiredChilds();
	    this.behaviors = [];
	},
	
    /**
     * Abstract template method.
     * Returns node configuration, something like: {text: 'sadads', iconCls: 'icon'}
     * @protected
     */
    getNodeConfig : Ext.emptyFn,
	
    /**
     * Abstract template method.
     *  
     * This method should create an instance of Ext.menu.Menu class and place it in {@link #contextMenu} property.
     * If defined - context menu will be displayed when given node is clicked with right mouse button.
     * @protected
     */
    createContextMenu : Ext.emptyFn,
    
    /**
     * Template method.
     * @protected
     */
    _initEvents : function() {
        if (Ext.isFunction(this.onContextMenuClick)) {
            this.on('contextmenu', this.onContextMenuClick);
        }
    },
    
    /**
     * Abstract event listener.
     * Handles this node <u>contextmenu</u> event.
     * @protected
     */
    onContextMenuClick : Ext.emptyFn,
    
    /**
     * Abstract template method. 
     * This method should initialize this.properties with records for GridProperty
     * @protected
     */
    createProperties : function() {
		return [];
	},

    /**
     * Template method.
     * If given node should have some childs when builded - this method should do this.
     * @protected
     */
    addRequiredChilds : Ext.emptyFn,
	
    /**
     * Returns fields for properties grid
     *
     * @return array
     */
	getProperties : function() {
        var properties = [];
        for(i in this.properties) {
            properties.push(this.properties[i]);
        }

        return properties;
	},
	
    getProperty : function(id) {
        return this.properties[id];
    },
    
    addProperty : function(property) {
        if (!this.properties) {
            this.properties = {};
        }

        property.WITreeNode = this;
        this.properties[property.id] = property;
    },
    
    addProperties : function(properties) {
        for (var i = 0; i < properties.length; i++) {
            this.addProperty(properties[i]);
        }
    },
    
    /**
     * @protected
     * @param {} widgetData
     */
    configureFor : function(widgetData) {
        for (var id in widgetData) {
            var value = widgetData[id];
            this.configureForValue(id, value);
        }
        for (var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].configureFor(widgetData);
        }
    },
    
    /**
     * @protected
     * @param {String} id
     * @param {Mixed} value
     */
    configureForValue : function(id, value) {
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
    },

    propertyChanged : function(property) {
        if (!property) {
            return;
        }

        for (var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].propertyChanged(property);
        }
    },
    
    dumpDataForWidgetDefinition : function(data) {
        if (!data) {
            data = {};
        }
        var childsData = this.dumpChildsData();
        var propertiesData = this.dumpPropertiesData();

        //my array merge :)
        //TODO: properties are overwriting values that came from childs - this can be dangerous
        for (key in propertiesData) {
            if (propertiesData[key] != '') {
                childsData[key] = propertiesData[key];
            }
        }

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
    },
    
    dumpChildsData : function() {
        var data = {};
        this.eachChild(function(childNode){
            data = childNode.dumpDataForWidgetDefinition(data);
        });
        return data;
    },
    
    dumpPropertiesData : function() {
        var data = {};

        for(i in this.properties){
            var property = this.properties[i];
            var propertyValue = property.get('value');
            // for boolean values we want them to travel as 'true' and 'false' strings
            if (propertyValue === false) {
                propertyValue = 'false';
            } else if (propertyValue === true){
                propertyValue = 'true';
            }
            
            data[property.id] = propertyValue;
        }
        
        return data;
    },
    
    getPropertyRecordCfg : Ext.emptyFn,
    
    /**
     * Adds behavior to given node
     * @protected
     */
    addBehavior : function(WITreeNodeBehavior) {
        WITreeNodeBehavior.setNode(this);
        this.behaviors.push(WITreeNodeBehavior);
        this.addProperties(WITreeNodeBehavior.createBehaviorProperties());
    }
});