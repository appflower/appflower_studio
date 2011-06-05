/**
 * Abstract class that represents elements like i:actions or i:fields
 * Those can contain many childrens with the same name
 * 
 * @class afStudio.wi.CollectionNode
 * @extends afStudio.wi.BaseNode
 */ 
afStudio.wi.CollectionNode = Ext.extend(afStudio.wi.BaseNode, {
    /**
     * Dump empty node or not.
     * @property dumpEvenWhenEmpty 
     * @type Boolean
     */
    dumpEvenWhenEmpty : true
    
    /**
     * @override
     * @protected
     * @param {String} id
     * @param {Mixed} value
     */
    ,configureForValue : function(id, value) {
        if (id == this.childNodeId) {
            if (!Ext.isArray(value)) {
                value = [value];
            }
            for (var i = 0; i < value.length; i++) {
                var newNode = this.addChild();
                newNode.configureFor(value[i]);
            }
        } else {
            afStudio.wi.CollectionNode.superclass.configureForValue.apply(this, arguments);
        }
    }//eo configureForValue
    
    /**
     * Adds a child node. 
     * @protected
     * 
     * @return {Ext.tree.TreeNode} created new child node
     */
    ,addChild : function() {
        var newNode = this.createChild();
        this.appendChild(newNode);
        return newNode;
    }//eo addChild    
    
    /**
     * @override
     * @return {}
     */
    ,dumpChildsData : function() {
        var data = [],
        	 ret = {};
        	 
        this.eachChild(function(childNode) {
            data.push(childNode.dumpDataForWidgetDefinition());
        });
        if (data.length == 0 && !this.dumpEvenWhenEmpty) {
            return ret;
        }
        ret[this.childNodeId] = data;
        
        return ret;
    }//eo dumpChildsData
    
    /**
     * Abstract method.
     * This method should create and return new child node.
     * @protected
     * 
     * @return {Ext.tree.TreeNode}
     */
    ,createChild : Ext.emptyFn    
});
