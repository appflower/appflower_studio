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
     * @cfg {String} editorFieldInvalid (defaults to 'The value in this node is invalid')
     * Text message is shown when node editor's value is invalid. 
     */
    ,editorFieldInvalid : 'The value in this node is invalid! <br /> accepts only alphanumeric symbols and "_", begins from "_" or alpha.'
    
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
     * @property treeEditor
     * Tree editor.
     * 
     * @type {afStudio.navigation.BaseTreeEditor}
     */
    
    /**
     * @property treeSorter
     * Tree sorter.
     * 
     * @type {Ext.tree.TreeSorter}
     */
    
    /**
     * @property treeKeyMap
     * Defines item's key map.
     * 
     * @type {Ext.KeyMap}
     */
    
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
				handler: _this.loadRootNode, 
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
		var _this = this;
		
		//activate treeSorter
		this.treeSorter = new Ext.tree.TreeSorter(this, {
		    folderSort: true,
		    dir: "asc"
		});
		
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
			 scope: _this,
			 
			 beforeload:    _this.onLoaderBeforeLoad,
			 load:          _this.onLoaderLoad,
			 loadexception: _this.onLoaderLoadException
		});
		
		//TreeEditor
		_this.treeEditor.on({
			scope: _this,
			
			beforecomplete: _this.onEditorBeforeComplete,
			complete:       _this.onEditorComplete,
			canceledit:     _this.onEditorCancelEdit
		});
		
		//Tree
		_this.on({
			scope: _this,
			
			contextmenu: _this.onNodeContextMenu,
			click:       _this.onNodeClick,
			dblclick:    _this.onNodeDblClick
	    });
	    
	    
		_this.treeKeyMap = new Ext.KeyMap(this.el, [
			{
			    key: Ext.EventObject.ENTER,
			    fn: function() {
			    	var tsm = this.getSelectionModel(),
			    		node = tsm.getSelectedNode();
			    	
			    	if (node.isLeaf()) {
			    		this.runNode(node);
			    	} else if (node.isExpandable() && !node.isExpanded()) {
			    		node.expand();
			    	}
			    },
			    scope: this
    		}
//    		{
//			    key: Ext.EventObject.R,
//			    ctrl: true,
//			    stopEvent: true,
//			    fn: function() {
//			    	var tsm = this.getSelectionModel();
//			    	var node = tsm.getSelectedNode();
//			    	
//			    	if (node.isLeaf()) {
//			    		this.treeEditor.triggerEdit(node);
//			    	}
//			    },
//			    scope: this    			
//    		}
		]);
	}//eo initEvents
	
	/**
	 * Masking this item tree's body element
	 * @protected
	 */
	,maskItemTree : function() {
		this.body.mask('Loading, please Wait...');
	}//eo maskItemTree
	
	/**
	 * Unmasking this item tree's body element
	 * @protected
	 */
	,unmaskItemTree : function() {
		this.body.unmask();
	}//eo unmaskItemTree
	
    /**
     * Returns node's attribute.
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
     * Returns parent node attribute of passed in node.
     * look at {@link #getNodeAttribute}
     * @return attribute / null 
     */
    ,getParentNodeAttribute : function(node, attribute, defaultValue) {
    	return this.getNodeAttribute(node.parentNode, attribute, defaultValue);
    }
    
	/**
	 * Expands all parent nodes.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} (Required) node The node being expanded and all his parents
	 */
	,expandParentNodes : function(node) {
		if (!Ext.isEmpty(node.parentNode)) {
			this.expandParentNodes(node.parentNode);
		}
		node.expand();
	}//eo expandParentNodes
    
    
    /**
	 * Selects node by its path (using node.getPath()).
	 * @param {Ext.tree.TreeNode} node The node to be selected
	 */
	,selectNode : function(node) {
		this.selectPath(node.getPath());
	}//eo selectNode	
	
	/**
	 * Selects child node by its <tt>text</tt> attribute.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} (Required) parent The parent of selecting child node 
	 * @param {String} (Required) childText The searching in child node's text attribute
	 * @return {Ext.tree.TreeNode} childNode The found and selected child node otherwise undefined 
	 */
	,selectChildNodeByText : function(parent, childText) {
		var _this = this,
			  tsm = this.getSelectionModel();
	
		this.expandParentNodes(parent);
		
		var childNode;
		if (parent && !parent.isLeaf()) {
			childNode = parent.findChild('text', childText, false);
			tsm.select(childNode);
		}
		
		return childNode;
	}//eo selectChildNodeByText	
	
	/**
	 * Loads this tree's root node.
	 * @protected
	 */
	,loadRootNode : function() {
		this.loader.load(this.root);		
	}//eo loadRootNode
	
	/**
	 * Reloads tree's root node.
	 * For more details look at {@link  Ext.tree.AsyncTreeNode#reload} method. 
	 * @protected
	 * 
	 * @param {Function} callback The callback function to be executed after reload.
	 */
	,reloadRootNode : function(callback) {
		var _this = this,
			rootNode = this.getRootNode();
		
		Ext.isFunction(callback) ? rootNode.reload(callback, _this) : rootNode.reload();
	}//eo reloadRootNode
	
	/**
	 * Reloads tree and selects child node finding it by its <tt>text</tt> attribute.
	 * During selecting the child node expands all his parent nodes.
	 * Nodes searching is based on <tt>text</tt> attributes, it must be unique within the tree.  
	 * @protected
	 * 
	 * @param {String} (Required) parentTextAttr The parend node's <tt>text</tt> attribute.
	 * @param {String} (Required) childTextAttr The child node's <tt>text</tt> attribute.
	 * @param {Function} (Optional) callback The callback function, accepts refreshed childNode.
	 * 					 Callback function accepts just refreshed <tt>childNode</tt>.
	 */
	,refreshNode : function(parentTextAttr, childTextAttr, callback) {
		var _this = this;
		
    	this.reloadRootNode(function() {
    		var root = this.getRootNode(),
    			parentNode = root.findChild('text', parentTextAttr, true),    		
    			childNode = this.selectChildNodeByText(parentNode, childTextAttr);
    		
    		if (Ext.isFunction(callback)) {
    			Ext.util.Functions.createDelegate(callback, _this, [childNode])();
    		}
    	});		
	}//eo refreshNode
	
	/**
	 * This {@link Ext.tree.TreeLoader} loader <u>beforeload</u> event listener.
	 * Fires before a network request is made to retrieve the Json text which specifies a node's children.
	 * For more details look at {@link Ext.tree.TreeLoader#beforeload} event. 
	 * @protected
	 * 
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node The node being loaded
	 * @param {Function} callback
	 */
	,onLoaderBeforeLoad : function(loader, node, callback) {
		this.maskItemTree();
	}//eo onLoaderBeforeLoad
	
	/**
	 * This {@link Ext.tree.TreeLoader} loader <u>load</u> event listener.
	 * Fires when the node has been successfuly loaded.
	 * For more details look at {@link Ext.tree.TreeLoader#load} event.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node The node being loaded
	 * @param {XMLHttpRequest} xhr
	 */
	,onLoaderLoad : function(loader, node, xhr) {
		this.unmaskItemTree();
	}//eo onLoaderLoad
	
	/**
	 * This {@link Ext.tree.TreeLoader} loader <u>loadexception</u> event listener.
	 * Fires if the network request failed.
	 * For more details look at {@link Ext.tree.TreeLoader#loadexception} event.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node The node was tried to load
	 * @param {XMLHttpRequest} xhr
	 */
	,onLoaderLoadException : function(loader, node, xhr) {
		//xhr.status
		//xhr.statusText
		this.unmaskItemTree();
	}//eo onLoaderLoadException
	
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
	 * @param {Mixed} name The node's text attribute to validate
	 * @return {Boolean} true if name is valid otherwise false.
	 */
	,isValidNodeName : function(node, name) {
		return /^[^\d]\w*$/im.test(name) ? true : false;
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
		
		if (!this.isValidNodeName(node, newValue)) {
			editor.field.markInvalid(this.editorFieldInvalid);
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
	 * Abstract method called when running actions associated with a node.
	 * @protected
	 * 
	 * @param {Ext.tree.TreeNode} node The node being run
	 */
	,runNode : Ext.emptyFn
	
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
		
		parentNode.expand();
		
		newNode = parentNode.appendChild(
			new Ext.tree.TreeNode(Ext.apply({}, nodeCfg))
		);
		
		this.selectNode(newNode);
		te.triggerEdit(newNode);
	}//eo addNode
	
	/**
	 * Runs action 
	 * @protected
	 * 
	 * @param {Object} action:<ul>  
	 *   <li><b>url</b>: {String} (Required) The action URL.</li>
	 *   
	 * 	 <li><b>run</b>: {Function} (Required) The action function to be run on success
	 * 					  accepts result (response) object. Function accepts response parameter.</li>
	 *  
	 *   <li><b>error</b>: {Function} (Optional) The error callback function</li>
	 *   
	 *   <li><b>params</b>: {Object} (Optional) request parameters</li>
	 *   
	 *   <li><b>loadingMessage</b>: {String} (Optional) mask loading message</li>
	 *    
	 *   <li><b>scope</b>: {Object} (Optional) the {@link #run} function execution context</li>  
	 * </ul>
	 */
	,executeAction : function(action) {
		afStudio.vp.mask({
			msg: action.loadingMessage ? action.loadingMessage : 'Loading...', 
			region: 'center'
		});
		
		Ext.Ajax.request({
		   url: action.url,
		   
		   params: action.params,
		   
		   success: function(xhr, opt) {
		   	
			   afStudio.vp.unmask('center');
			   var response = Ext.decode(xhr.responseText);
			   
			   if (response.success) {
			   	   Ext.util.Functions.createDelegate(
				       action.run, 
		   		       action.scope ? action.scope : this, 
		   			   [response], 
		   			   false
			   	   )();			       				   	
			   } else {
			   	   Ext.Msg.alert('Error', response.content);
			   	   
			   	   if (Ext.isFunction(action.error)) {
				   	   Ext.util.Functions.createDelegate(
					       action.error, 
			   		       action.scope ? action.scope : this, 
			   			   [response],
			   			   false
				   	   )();
			   	   }
			   }
		   },
		   
		   failure: function(xhr, opt) {
		   	   afStudio.vp.unmask('center');
		       Ext.Msg.alert('Error', String.format('Status code: {0}, message: {1}', xhr.status, xhr.statusText));
		   }
		});
	}//eo executeAction
});