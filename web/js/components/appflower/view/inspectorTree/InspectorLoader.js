Ext.ns('afStudio.view.inspector');

/**
 * Inspector tree Loader.
 * 
 * @dependency
 * Model: {@link afStudio.model.Node}
 * Inspector nodes: {@link afStudio.view.inspector.TreeNode}
 * Errors: {@link afStudio.view.inspector.error}
 * 
 * @class afStudio.view.inspector.InspectorLoader
 * @extends Ext.util.Observable
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.InspectorLoader = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {Object} baseAttrs (optional) An object containing attributes to be added to all nodes
     * created by this loader. If the attributes set by processing model have an attribute in this object,
     * they take priority.
     */	
	/**
     * @cfg {Boolean} clearOnLoad (optional) Default to true. Remove previously existing
     * child nodes before loading.
     */
    clearOnLoad : true,
    /**
     * @cfg {Object} uiProviders (optional) An object containing properties which
     * specify custom {@link Ext.tree.TreeNodeUI} implementations. If the optional
     * <i>uiProvider</i> attribute of a returned child node is a string rather
     * than a reference to a TreeNodeUI implementation, then that string value
     * is used as a property name in the uiProviders object.
     */
    uiProviders : {},

    constructor : function(config) {
    	Ext.apply(this, config);

	    this.addEvents(
	        /**
	         * @event beforeload
	         * Fires before a model request is made to process the Json text which specifies a node's children.
	         * @param {Object} This TreeLoader object.
	         * @param {Object} node The {@link afStudio.view.inspector.TreeNode} being loaded.
	         */
	        "beforeload",
	        /**
	         * @event load
	         * Fires when the node has been successfuly loaded.
	         * @param {Object} This TreeLoader object.
	         * @param {Object} node The {@link afStudio.view.inspector.TreeNode} being loaded.
	         */
	        "load"
	    );
    
		afStudio.view.inspector.InspectorLoader.superclass.constructor.call(this);
    },
	//eo constructor
    
    /**
     * Loads an {@link Ext.tree.TreeNode} from the model node associated with it.
     * This is called automatically when a node is expanded, but may be used to reload
     * a node (or append new children if the {@link #clearOnLoad} option is false.)
     * @public
     * 
     * @param {afStudio.view.inspector.TreeNode} node The node being loaded.
     * @param {Function} callback Function to call after the node is loaded.
     * Function is passed the TreeNode which was requested to be loaded.
     * @param {Object} scope The scope (<code>this</code> reference) in which the callback is executed.
     * Defaults to the loaded TreeNode.
     */
    load : function(node, callback, scope) {
        if (this.clearOnLoad) {
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
        }
        this.processData(node, callback, scope || node);
        this.runCallback(callback, scope || node, [node]);
    },
    //eo load

    /**
     * Returns required model node's properties.
     * @protected
     * @param {afStudio.model.Node} m The model node
     * @return {Object} properties
     */
    getModelProperties : function(m) {
    	return Ext.copyTo({}, m.getPropertiesHash(), 'name, text');	
    },
    
    /**
     * Processes model node asscociated with a tree node.
     * @protected
     * @param {afStudio.view.inspector.TreeNode} node The tree's node which modelNode is processed
     */
	processData : function(node) {
        if (this.fireEvent("beforeload", this, node) !== false) {    	
        	var mn = node.modelNode;
        	
        	if (mn instanceof afStudio.model.Node) {
            	node.beginUpdate();
            	
				Ext.each(mn.childNodes, function(m) {
					var leaf = m.nodeTypes.length > 0 ? false : true;
//						expanded = m.childNodes.length < 1 ? true : false;
					
	        		var attr = Ext.apply(
	        			{
	        				modelNode: m,
	        				leaf: leaf
	        			}, this.getModelProperties(m));
	        			
//	        		if (expanded) {
//	        			attr.expanded = true;
//	        		}
	        		
	        		var n = this.createNode(attr);
	        		
	                if (n) {
	                    node.appendChild(n);
	                }
	        	}, this);
	        	
	            node.endUpdate();
	            
	         	this.fireEvent("load", this, node);
        	} else {
		        throw new afStudio.view.inspector.error.LoaderError('incorrect-model');    		
        	}
        }
	},
    //eo processData

    /**
    * <p>Override this function for custom TreeNode node implementation, or to
    * modify the attributes at creation time.</p>
    * 
    * @public
    * @param attr {Object} The attributes from which to create the new node.
    */
    createNode : function(attr) {
        if (this.baseAttrs) {
            Ext.applyIf(attr, this.baseAttrs);
        }
        if (this.applyLoader !== false && !attr.loader) {
            attr.loader = this;
        }
        if (Ext.isString(attr.uiProvider)) {
           attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
        }
        
        var nodeType = attr.modelNode.tag ? this.resolveNodeType(attr.modelNode.tag) : null;
        if (nodeType) {
            return new nodeType(attr);
        } else {
            return attr.leaf ?
						new afStudio.view.inspector.TreeNode(attr) :
                        new afStudio.view.inspector.ContainerNode(attr);
        }
    },
    //eo createNode

    /**
     * Returns node's constructor function by its type.
     * @protected
     * @param {String} type The node type
     * @return {Function} node constructor or null if it was not found
     */
    resolveNodeType : function(type) {
    	var nCls = String(type).trim(),
    		nodeNs = [afStudio.view.inspector.TreePanel.nodeTypes];
    	
    	if (/^i:(\w+)/i.test(nCls)) {
			nCls = nCls.replace(/^i:(\w+)/i, function(s, m1) {
			    return m1.ucfirst(); 
			});
    	}
    	
    	Ext.iterate(nodeNs, function(ns) {
    		if (Ext.isFunction(ns[nCls])) {
    			nCls = ns[nCls];
    			return false;
    		}
    	});
    	
    	return Ext.isFunction(nCls) ? nCls : null;    	
    },
    //eo resolveNodeType
    
	/**
	 * Runs callback function with specific arguments and context.
	 * @private
	 * @param {Function} cb The function being run
	 * @param {Object} scope The scope (<code>this</code> reference) inside a callback 
	 * @param {Array} args The array of arguments passed to a callback
	 */
    runCallback : function(cb, scope, args) {
        if (Ext.isFunction(cb)) {
            cb.apply(scope, args);
        }
    },
    
	/**
	 * @private
	 */
    destroy : function() {
        this.purgeListeners();
    }    
});