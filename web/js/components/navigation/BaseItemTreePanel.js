Ext.ns('afStudio.navigation');

afStudio.navigation.BaseTreeEditor = Ext.extend(Ext.tree.TreeEditor, {	
	 //prevent dbclick editing
	 beforeNodeClick : Ext.emptyFn
});

/**
 * BaseItemTreePanel the base navigation tree item class. 
 * 
 * @class afStudio.navigation.BaseItemTreePanel
 * @extends Ext.tree.TreePanel
 * @author Nikolai
 */
afStudio.navigation.BaseItemTreePanel = Ext.extend(Ext.tree.TreePanel, {
	
	/**
	 * @cfg {String} baseUrl required
	 */	
	
	/**
	 * @cfg {Boolean} animate (defaults to true)
	 */
    animate : true

    /**
     * @cfg {Boolean} autoScroll (defaults to true)   
     */
    ,autoScroll : true
    
    /**
     * @cfg {Object} leafNodeCfg (defaults to empty object)
     * Default leaf node configuration object.
     */
    ,leafNodeCfg : {}

    /**
     * @cfg {Object} branchNodeCfg (defaults to empty object)
     * Default branch node configuration object.
     */
    ,branchNodeCfg : {}
    
    /**
     * Returns node's attribute
     * @param {Ext.tree.TreeNode} node required
     * @param {String} attribute required
     * @param {Mixed} defaultValue optional
     * @return attribute / null
     */
    ,getNodeAttribute : function(node, attribute, defaultValue) {
    	return node.attributes[attribute] ? node.attributes[attribute] 
    			  : (defaultValue ? defaultValue : null);
    }//eo getNodeAttribute
    
    /**
     * Returns parent node attribute of passed in node
     * look at {@link #getNodeAttribute}
     * @return attribute / null 
     */
    ,getParentNodeAttribute : function(node, attribute, defaultValue) {
    	return this.getNodeAttribute(node.parentNode, attribute, defaultValue);
    }
    
    /**
	 * Selects node
	 * @param {Ext.tree.TreeNode} node The node to be selected
	 */
	,selectNode : function(node) {
		this.selectPath(node.getPath());
	}//eo selectNode
	
	/**
	 * Constructor
	 * @param {Object} config
	 */
	,constructor : function(config) {
		var _this = this;
		
		var rootNode = new Ext.tree.AsyncTreeNode({
			path:'root',
			text: _this.title || '', 
			draggable: false
		});
		
		Ext.apply(config, {
			
		    root: rootNode,
		    rootVisible: false,
			tools: [
			{
				id: 'refresh', 
				handler: _this.loadRootItem, 
				scope: this
			}]			
		});
		
		afStudio.navigation.BaseItemTreePanel.superclass.constructor.call(this, config);
	}//eo constructor
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {		
		//activate treeEditor
		this.treeEditor = new afStudio.navigation.BaseTreeEditor(this, {
			cancelOnEsc: true,
			completeOnEnter: true,
			ignoreNoChange: true
		});
		
		afStudio.navigation.BaseItemTreePanel.superclass.initComponent.apply(this, arguments);
	}//eo initComponent 
	
	/**
	 * Ext Template method
	 * Initializes events.
	 * @private
	 */
	,initEvents : function() {
		afStudio.navigation.BaseItemTreePanel.superclass.initEvents.apply(this, arguments);

		var _this = this;
	 
		//Loader
		_this.loader.on({
			 beforeload: function(loader,node,clb) {
			 	node.getOwnerTree().body.mask('Loading, please Wait...', 'x-mask-loading');
			 }
			 ,load: function(loader,node,resp) {
				node.getOwnerTree().body.unmask();
			 }
			 ,loadexception: function(loader,node,resp) {
				node.getOwnerTree().body.unmask();
			 }
		});
		
		//TreeEditor
		_this.treeEditor.on({
			beforecomplete: _this.onEditorBeforeComplete,
			complete: 		_this.onEditorComplete,
			canceledit: 	_this.onEditorCancelEdit,
			
			scope: _this
		});
		
		//Tree
		_this.on({
			contextmenu: _this.onNodeContextMenu,
			click: _this.onNodeClick,
			dblclick: _this.onNodeDblClick,
			
			scope: _this
	    });
	}//eo initEvents
	
	/**
	 * Loads this tree.
	 */
	,loadRootItem : function() {
		this.loader.load(this.root);		
	}//eo loadItem
	
	/**
	 * Abstract method called when tree's item was clicked.
	 * afStudio.navigation.BaseItemTreePanel <u>click</u> event listener 
	 * @protected
	 * 
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e The event object 
	 */
	,onNodeClick : Ext.emptyFn
	
	/**
	 * Abstract method called when tree's item was double clicked.
	 * afStudio.navigation.BaseItemTreePanel <u>dblclick</u> event listener
	 * @protected
	 * 
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e The event object
	 */
	,onNodeDblClick : Ext.emptyFn
	
	/**
	 * Abstract method called when tree's item contextmenu event was fired.
	 * afStudio.navigation.BaseItemTreePanel <u>contextmenu</u> event listener
	 * For moere detailed information look at {@link Ext.tree.TreePanel#contextmenu} 
	 * @protected
	 *  
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e The event object 
	 */
	,onNodeContextMenu : Ext.emptyFn
	
	/**
	 * This method has no default implementation and returns true, so you must provide an
     * implementation that does something to validate the node's name(text attribute)
     * and returns true if <tt>name</tt> is valid.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} node The node whose text attribute is validated
	 * @param {Mixed} name The node's text attribute to validate
	 * @return {Boolean} true if name is valid otherwise false.
	 */
	,isValidNodeName : function(node, name) {
		return true;
	}//eo isValidNodeName 
	
	/**
	 * Fires after a change has been made to the field, but before the change is reflected in the underlying field.
	 * BaseTreeEditor <u>beforecomplete</u> event listener.
	 * For more details look at {@link Ext.tree.TreeEditor#beforecomplete} event.
	 * By default this method uses {@link #isValidNodeName} function to check if <tt>newValue</tt> is valid for a node name. 
	 * @protected
	 * 
	 * @param {Editor} editor
	 * @param {Mixed} newValue The current field value
	 * @param {Mixed} oldValue The original field value
	 * @return {Boolean}
	 */
	,onEditorBeforeComplete : function(editor, newValue, oldValue) {
		var node = editor.editNode;	
		
		//validates model
		if (!this.isValidNodeName(node, newValue)) {			
			return false;
		}
	}//eo onEditorBeforeComplete
	
	/**
	 * Fires after editing is complete and any changed value has been written to the underlying field.
	 * BaseTreeEditor <u>complete</u> event listener.
	 * @protected
	 * 
	 * @param {Editor} editor
	 * @param {Mixed} value The current field value
	 * @param {Mixed} startValue The original field value
	 */
	,onEditorComplete : function(editor, value, startValue) {
		var node = editor.editNode;		
		
		//add
		if (this.getNodeAttribute(node, 'NEW_NODE')) {
			node.setText(value);			
			this.addNodeController(node);
		//rename	
		} else {
			if (value != startValue) {
				this.renameNodeController(node, value, startValue);
			}
		}
	}//eo onEditorComplete 
	
	/**
	 * Fires after editing has been canceled and the editor's value has been reset.
	 * BaseTreeEditor <u>canceledit</u> event listener.
	 * For more details look at {@link Ext.tree.TreePanel#canceledit} event.
	 * @protected
	 * 
	 * @param {Editor} editor
	 * @param {Mixed} value The user-entered field value that was discarded
	 * @param {Mixed} startValue The original field value that was set back into the editor after cancel
	 */
	,onEditorCancelEdit : function (editor, value, startValue) {
		var node = editor.editNode;
		
		if (this.getNodeAttribute(node, 'NEW_NODE')) {
			node.remove();
		}
	}//eo onEditorCancelEdit
	
	/**
	 * Abstract method called before tree's item was added but already named.
	 * Controls the creation process of specific node.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} node The node being added & named
	 */
	,addNodeController : Ext.emptyFn
	
	/**
	 * Abstract method called before tree's item was renamed.
	 * Controls the rename process of specific node.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} node The node being renamed
	 * @param {Mixed} value The current node's text attribute value
	 * @param {Mixed} startValue The original node's text attribute value
	 */
	,renameNodeController : Ext.emptyFn
	
	/**
	 * Adds a new <tt>leaf</tt> node to specified parent.
	 * After addition, starts editing node's text attribute.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} parentNode The parent node
	 * 
	 */
	,addLeafNode : function(parentNode) {
		var nodeCfg = this.leafNodeCfg;
		
		nodeCfg.NEW_NODE = true;
		this.addNode(parentNode, nodeCfg);
	}//eo addLeafNode
	
	/**
	 * Adds a new <tt>branch</tt> node to specified parent.
	 * After addition, starts editing node's text attribute.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} parentNode The parent node
	 */
	,addBranchNode : function(parentNode) {
		var nodeCfg = this.branchNodeCfg;
		
		nodeCfg.NEW_NODE = true;
		this.addNode(parentNode, nodeCfg);
	}//eo addBranchNode
	
	/**
	 * Adds node and starts its name editing.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} parentNode The parent node
	 * @param {Object} nodeCfg The node configuration object
	 */
	,addNode : function(parentNode, nodeCfg) {
		var te = this.treeEditor,
			newNode;
			
		newNode = parentNode.appendChild(
			new Ext.tree.TreeNode(nodeCfg)
		);
		this.selectNode(newNode);
		te.triggerEdit(newNode);
	}//eo addNode
});