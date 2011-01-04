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
    this.createProperties();
    this.addRequiredChilds();
};
Ext.extend(N.BaseNode, Ext.tree.TreeNode, {
    /**
     * When concrete node sets here name of one of its properties then each time
     * that property changes - node text label is updated accordingly
     */
    updateNodeNameFromPropertyId: false,
    createContextMenu: Ext.emptyFn,
    containsIParams: false,
    /**
     * This method should initialize this.properties with records for GridProperty
     */
    createProperties: function(){return []},
    /**
     * Returns fields for properties grid
     *
     * @return array
     */
	getProperties: function(){
        var properties = [];
        for(i in this.properties) {
            properties.push(this.properties[i]);
        }

        return properties;
	},
    getProperty: function(id){
        return this.properties[id];
    },
    addProperty: function(property){
        if (!this.properties) {
            this.properties = {};
        }

        property.WITreeNode = this;
        this.properties[property.id] = property;
        if (property.get('oneOfIParam')){
            this.containsIParams = true;
        }
    },
    configureFor: function(widgetData){
        for(id in widgetData){
            var value = widgetData[id];
            this.configureForValue(id, value);
        }
    },
    configureForValue: function(id, value){
        if (this.properties && this.properties[id]) {
            var property = this.getProperty(id);
            property.set('value',value);
            this.propertyChanged(property);
        } else if (
                this.containsIParams &&
                id == 'i:params' &&
                value['i:param']
            ){
            if (!Ext.isArray(value['i:param'])) {
                var iParams = [value['i:param']];
            } else {
                var iParams = value['i:param'];
            }
            for(var i=0; i<iParams.length;i++) {
                this.configureForValue(iParams[i]['name'], iParams[i]['_content']);
            }
        } else {
            var child = this.findChild('id', id);
            if (child){
                child.configureFor(value);
            }
        }
    },
    propertyChanged: function(property) {
        if (this.updateNodeNameFromPropertyId){
            if (property.id == this.updateNodeNameFromPropertyId) {
                this.setText(property.get('value'));
            }
        }
    },
    dumpDataForWidgetDefinition: function(){

        var childsData = this.dumpChildsData();
        var propertiesData = this.dumpPropertiesData();

        //my array merge :)
        for(key in propertiesData) {
            childsData[key] = propertiesData[key];
        }

        return childsData;
    },
    dumpChildsData: function(){
        var data = {};
        this.eachChild(function(childNode){
            data[childNode.id] = childNode.dumpDataForWidgetDefinition();
        });
        return data;
    },
    dumpPropertiesData: function(){
        var data = {};
        var iParams = [];
        for(i in this.properties){
            var property = this.properties[i];
            if (property.get('oneOfIParam')) {
                iParams.push({name: property.id, '_content': property.get('value')});
            } else {
                data[property.id] = property.get('value');
            }
        }
        if (iParams.length > 0){
            data['i:params'] = {'i:param': iParams};
        }
        return data;
    },
	
    /**
     * Returns node configuration, something like: {text: 'sadads', iconCls: 'icon'}
     */
    getNodeConfig: Ext.emptyFn,
    _initEvents: function(){
        if (this.contextMenuHandler) {
            this.on('contextmenu', this.contextMenuHandler);
        }
    },
    getPropertyRecordCfg: Ext.emptyFn,
    /**
     * If given node should have some childs when builded - this method should do this
     */
    addRequiredChilds: Ext.emptyFn
});
