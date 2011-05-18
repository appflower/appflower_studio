/**
 * This node represents <b>i:action</b> node in edit type widget
 * 
 * @class afStudio.wi.ActionNode
 * @extends afStudio.wi.ContainerNode
 */
afStudio.wi.ActionNode = Ext.extend(afStudio.wi.ContainerNode, {
	
	/**
	 * @cfg {String} deleteNodeActionLabel
	 * Delete node context menu's item. 
	 */
	deleteNodeActionLabel : 'Delete Action'
	
	/**
	 * ActionNode constructor.
	 * @constructor
	 */
    ,constructor : function() {
        afStudio.wi.ActionNode.superclass.constructor.apply(this, arguments);
        
        this.addBehavior(new afStudio.wi.WithNamePropertyAsLabelBehavior);
    }//eo constructor
    
    /**
     * template method
     * @override
     * @return {Object} this node configuration object
     */
    ,getNodeConfig : function() {
        return {
            text: 'newaction',
            metaField: 'i:action'
        };
    }//eo getNodeConfig
    
    /**
     * template method
     * @override
     */
    ,createContextMenu : function() {
        this.contextMenu = new Ext.menu.Menu({
            items: [
            {
                text: this.deleteNodeActionLabel,                
                iconCls: 'afs-icon-delete',
                handler: this.onContextDeleteChildItemClick,
                scope: this
            }]
        });
    }//eo createContextMenu    
    
    /**
     * @protected
     * @override
     * @param {Ext.tree.TreeNode} node
     * @param {Ext.EventObject} e
     */
    ,onContextMenuClick : function(node, e) {
        node.select();
        this.contextMenu._node = node;
        this.contextMenu.showAt(e.getXY());
    }//eo onContextMenuClick 
    
    /**
     * template method
     * @override
     */
    ,createProperties : function() {
       var properties = [
           new afStudio.wi.PropertyTypeString({id: 'name', label: 'Name', defaultValue: 'newaction', required: true}).create(),
           new afStudio.wi.PropertyTypeString({id: 'url', label: 'Url', required: true}).create(),
           new afStudio.wi.PropertyTypeString({id: 'text', label: 'Text'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'iconCls', label: 'Icon CSS class'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'icon', label: 'Icon URL'}).create(),
           new afStudio.wi.PropertyTypeBoolean({id: 'forceSelection', label: 'Force selection'}).create(),
           new afStudio.wi.PropertyTypeBoolean({id: 'post', label: 'Post'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'tooltip', label: 'Tooltip'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'confirmMsg', label: 'Confirm message'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'condition', label: 'Condition'}).create(),
           new afStudio.wi.PropertyTypeString({id: 'style', label: 'Style'}).create()
       ];

       this.addProperties(properties);
    }//eo createProperties
    
    /**
     * Context menu deleteChild <u>click</u> event listener.
     */
    ,onContextDeleteChildItemClick : function(item, e) {
    	item.parentMenu._node.remove();
    }
});