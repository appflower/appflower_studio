/**
 * Node that represents list or edit widgets fields
 * Widgets like list and edit contains many fields (i:field or i:column elements).
 * Responsibilities of this class is to manage informations from widget definition like:
 * i:grouping, i:set, i:ref - for edit type widget
 * It also keeps track of ordering of fields (list and edit widgets)
 * 
 * @class afStudio.wi.FieldsNode
 * @extends afStudio.wi.CollectionNode
 */ 
afStudio.wi.FieldsNode = Ext.extend(afStudio.wi.CollectionNode, {
    
	constructor : function(config) {
		/**
		 * Ordered array of children nodes.
		 * @property childIdsOrdered
		 * @type {Array}
		 */
	    this.childIdsOrdered = [];
	    
	    afStudio.wi.FieldsNode.superclass.constructor.apply(this, arguments);	    
	},//eo constructor    
    
    /**
     * @override
     */
    addChild : function() {
        var newNode = afStudio.wi.FieldsNode.superclass.addChild.apply(this, arguments);
        this.childIdsOrdered.push(newNode.id);

        return newNode;
    },
    
    //TODO: I violated DRY principle here, BaseNode::dumpChildsData() should be refactored
    // There is also custom implementation of dumpChildsData inisde CollectioNode class
    dumpChildsData : function() {
        var data = [],
        	childNodes = [],
        	ret = {};
        	
        for (var i = 0; i < this.childIdsOrdered.length; i++) {
        	//TODO error here thus is used if construction
        	//after the 2nd time of creation of new widget js error appeares due to
        	//childIdsOrdered array contains null elements.
        	var n = this.findChild('id', this.childIdsOrdered[i]);
        	if (n) {
            	childNodes.push(n);
        	}
        }
        for (var i = 0; i < childNodes.length; i++) {
            data.push(childNodes[i].dumpDataForWidgetDefinition());
        }
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