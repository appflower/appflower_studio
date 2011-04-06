
/**
 * Node that represents list or edit widgets fields
 * Widgets like list and edit contains many fields (i:field or i:column elements).
 * Responsibilities of this class is to manage informations from widget definition like:
 * i:grouping, i:set, i:ref - for edit type widget
 * It also keeps track of ordering of fields (list and edit widgets)
 * 
 * @class afStudio.widgetDesigner.FieldsNode
 * @extends afStudio.widgetDesigner.CollectionNode
 */ 
afStudio.widgetDesigner.FieldsNode = Ext.extend(afStudio.widgetDesigner.CollectionNode, {
    
	/**
	 * Ordered array of children nodes.
	 * @property childIdsOrdered
	 * @type {Array}
	 */
    childIdsOrdered : [],
    
    /**
     * @override
     */
    addChild : function() {
        var newNode = afStudio.widgetDesigner.FieldsNode.superclass.addChild.apply(this, arguments);
        this.childIdsOrdered.push(newNode.id);

        return newNode;
    },
    
    //TODO: I violated DRY principle here, BaseNode::dumpChildsData() should be refactored
    // There is also custom implementation of dumpChildsData inisde CollectioNode class
    dumpChildsData : function() {
        var data = [];
        var childNodes = [];
        for (var i=0; i < this.childIdsOrdered.length; i++) {
            childNodes.push(this.findChild('id', this.childIdsOrdered[i]));
        }
        for (var i=0; i < childNodes.length; i++) {
            data.push(childNodes[i].dumpDataForWidgetDefinition());
        }

        var ret = {};

        if (data.length == 0 && !this.dumpEvenWhenEmpty) {
            return ret;
        }

        ret[this.childNodeId] = data;
        return ret;
    },
    
    setChildsOrder : function(childIdsOrdered) {
        this.childIdsOrdered = childIdsOrdered;
    }
});

// Use code below to try out ordering of fields
// first load up some widget into WI
// then use code below to find out of node ids
// finally call setChildsOrder() to set new order of fields
// after saving widget - physical order of fields in XML should be just like given to setChildsOrder()

/**
var wd = afStudio.getWidgetsTreePanel().widgetDefinition;
var fieldsNode = wd.rootNode.getFieldsNode();
fieldsNode.eachChild(function(node){
    console.log("'"+node.id+"',");
});

fieldsNode.setChildsOrder([
'xnode-186',
'xnode-189',
'xnode-195',
'xnode-198',
'xnode-184',
'xnode-181',
'xnode-192',
'xnode-181',
]);

 *
 *  */