/**
 * This node represents i:field node in edit type widget
 * @class afStudio.wi.FieldNode
 * @extends afStudio.wi.ContainerNode
 */ 
afStudio.wi.FieldNode = Ext.extend(afStudio.wi.ContainerNode, {
	
	/**
	 * @cfg {String} deleteNodeText
	 * Delete node context menu's item text. 
	 */	
	deleteNodeText : 'Delete Field'
	
	/**
	 * FieldNode constructor. 
	 * @constructor
	 */
    ,constructor : function() {
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
            'iconCls': 'icon-field',
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
                text: this.deleteNodeText,                
                iconCls: 'afs-icon-delete',
                handler: this.onContextDeleteChildItemClick,
                scope: this
            }]
        });
    }//eo createContextMenu    
    
    /**
     * template method
     * @override
     */    
    ,createProperties: function() {
       var properties = [
            new afStudio.wi.PropertyTypeString({id: 'name', label: 'Name'}).setRequired().create(),
            new afStudio.wi.PropertyTypeString({id: 'label', label: 'Label'}).create(),
            new afStudio.wi.FieldType().create(),
            new afStudio.wi.PropertyTypeString({id: 'state', label: 'State'}).create(),
            new afStudio.wi.PropertyTypeString({id: 'style', label: 'Style'}).create()
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
     * Context menu deleteChild <u>click</u> event listener.
     */
    ,onContextDeleteChildItemClick : function(item, e) {
    	item.parentMenu._node.remove();
    }//eo onContextDeleteChildItemClick
});
