//Base controller namespace
Ext.ns('afStudio.controller');

/**
 * Base Model controller class.
 * 
 * @class afStudio.controller.BaseController
 * @extends Ext.util.Observable
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.controller.BaseController = Ext.extend(Ext.util.Observable, {

	/**
	 * TODO place real url! 
	 * @cfg {String} url (defaults to 'URL_HERE')
	 */
	url : '/afsWidgetBuilder/getWidget',
//	afStudioWSUrls.getGetWidgetUrl
	
	/**
	 * @cfg {Object} widget
	 * <ul>
	 * 	<li><b>uri</b>: The view URI.</li>
	 * 	<li><b>placeType</b>: The type of the place where a view is located ("apps"/"plugin").</li>
	 * 	<li><b>place</b>: The place name.</li>
	 * 	<li><b>actionPath</b>: View's actions class path</li>
	 * 	<li><b>securityPath</b>: View's security file path</li>
	 * </ul>
	 * (Required) The widget meta information.
	 */
	/**
	 * @cfg {afStudio.model.Node} root
	 * (Optional) The model. Root is the container(top) model node.
	 * Only one configuration option should be passed: root or viewDefinitoon.
	 */
	/**
	 * @cfg {Object} viewDefinition
	 * (Optional) The view definiton object - meta-data for the Model.
	 * Only one configuration option should be passed: root or viewDefinitoon.
	 */
	
	/**
	 * @cfg {Array} views
	 * The array of views to be associated with this controller.
	 */
	views : [],
	
	/**
	 * Controller ID.
	 * @property id
	 * @type {String}
	 */
	
    /**
     * View definition object, holds the up-to-date definition of the view.
     * @property viewDefinition
     * @type {Object}
     */
    viewDefinition : null,
    
    /**
     * The token used to separate paths in node ids (defaults to '/').
     * @property pathSeparator
     * @type {String}
     */
    pathSeparator: "/",
        
    /**
     * The root node for this controller
     * @property root
     * @type {Node}
     */
    root : null,
    
    /**
     * The flag contains the controller's state.
     * @property ready
     * @type {Boolean}
     */
    ready : false,
    
    constructor : function(config) {
    	config = config || {};
    	
        this.id = config.id || this.id;
        if (!this.id) {
            this.id = Ext.id(null, 'view-controller-');
        }    	
    	
    	if (config.url) {
    		this.url = config.url;
    	}
    	
    	if (!config.widget && !Ext.isObject(config.widget)) {
    		throw new afStudio.controller.error.ControllerError('widget-cfg-incorrect');
    	}
		this.widget = config.widget;    	
    	
		this.views = config.views || [];
		
	    /**
	     * The store of all registred in controller model nodes
	     * @property nodeHash
	     * @type {Object}
	     */    	
        this.nodeHash = {};

        if (config.root) {
            this.setRootNode(config.root);
        }
        
        this.addEvents(
            "beforeModelNodeAppend",

            "modelNodeAppend",
            
            "beforeModelNodeRemove",
            
            "modelNodeRemove",
            
            "beforeModelNodeMove",
            
            "modelNodeMove",

            "beforeModelNodeInsert",
            
            "modelNodeInsert",
            
            "beforeModelPropertyChanged",
            
            "modelPropertyChanged",
            
            "beforeModelNodeCreated",
            
            "modelNodeCreated",
            
            "ready",
            
            "beforeLoadViewDefinition",
            
            "loadViewDefinition",
            
            "beforeSaveViewDefinition",
            
            "saveViewDefinition"
        );
        
        afStudio.controller.BaseController.superclass.constructor.call(this);
        
        //the model is not defined yet
        if (!this.root) {
        	this.initModel(config.viewDefinition);
        }
        
        //initViews
        
        //fireEvent("ready")
    },
    //eo constructor

    /**
     * Returns controller's state.
     * @return {Boolean} ready state
     */
    isReady : function() {
    	return this.ready;
    },

    /**
     * Returns view definition object.
     * @return {Object}
     */
    getViewDefinition : function() {
    	return this.viewDefinition;
    },
    
    /**
     * Loads view definiton.
     */
    loadViewDefinition : function() {
    	if (this.fireEvent('beforeLoadViewDefinition')) {
    		//code
    		
    		afStudio.xhr.executeAction({
    			url: this.url + '?uri=pages/StudioList',
    			scope: this,
    			run: function(response, ops) {
    				console.log('run', this);
    				console.log('run', response, ops);
    			},
    			error: function() {
    				console.log('error', this);
    			}
    		});
    		
    		this.fireEvent('loadViewDefinition');
    	}
    },
    
    /**
     * Saves view definiton.
     */
    saveViewDefinition : function() {
    	var _self = this,
    		   vd = this.viewDefinition;
    		   
    	if (this.fireEvent('beforeSaveViewDefinition', vd)) {
    		//code
    		
    		this.fireEvent('saveViewDefinition');
    	}
    },
    
    /**
     * Template method.
     * @protected
     * @param {Object} vd The view definition object
     */
    initModel : function(vd) {
    	var _self = this;
    	
    	if (vd) {
    		this.root.applyNodeDefinition(vd, true);
    	} else {
    		this.loadViewDefinition();
    	}
    },
    //eo initModel
    
    registerView : function (view) {
    	
    },
    
    /**
     * @private
     */
    proxyNodeEvent : function() {
        return this.fireEvent.apply(this, arguments);
    },

    /**
     * Returns the root node for this controller.
     * @return {Node}
     */
    getRootNode : function() {
        return this.root;
    },

    /**
     * Sets the root node for this model controller.
     * @param {Node} node
     * @return {Node}
     */
    setRootNode : function(node) {
        this.root = node;
        node.isRoot = true;
     	node.setOwnerTree(this);
        
        return node;
    },

    /**
     * Gets a model node in this controller by its id.
     * @param {String} id
     * @return {Node}
     */
    getNodeById : function(id) {
        return this.nodeHash[id];
    },

    /**
     * @private
     * @param {Node} node
     */
    registerNode : function(node) {
        this.nodeHash[node.id] = node;
    },

    /**
     * @private
     * @param {Node} node
     */
    unregisterNode : function(node) {
        delete this.nodeHash[node.id];
    },

    toString : function() {
        return "[BaseController" + (this.id ? " " + this.id : "") + "]";
    }
});
