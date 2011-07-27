//Base controller namespace
Ext.ns('afStudio.controller');

/**
 * Base Model controller class.
 * 
 * @dependency
 * Error: {@link afStudio.controller.error}
 * Model: {@link afStudio.model.Root}
 * Definition: {@link afStudio.definition.ViewDefinition}
 * 
 * @class afStudio.controller.BaseController
 * @extends Ext.util.Observable
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.controller.BaseController = Ext.extend(Ext.util.Observable, {

	/**
	 * TODO place real url! correct afStudioWSUrls.getGetWidgetUrl 
	 * 
	 * @cfg {String} url (defaults to 'URL_HERE')
	 */
	url : '/afsWidgetBuilder/getWidget',
	
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
	 * @cfg {Object} viewDefinition
	 * (Optional) The view definiton object - meta-data for the Model.
	 */
	/**
	 * The Views to be associated with this controller.
	 * @cfg {Object} views:
	 * <ul>
	 * 	<li><b>viewID</b>: {String} The view ID inside the views object
	 * 		<ul>
	 * 		{
	 * 			<li><b>view</b>: {Function} The view constructor function</li>	
	 * 			<li><b>cfg</b>: {Object} (Optional) The view configuration object</li>	
	 * 		}</ul>
	 * 	</li>
	 * </ul>
	 */
	
	/**
	 * Controller ID.
	 * @property id
	 * @type {String}
	 */
    /**
     * View definition object, holds the up-to-date definition of the view.
     * @property viewDefinition
     * @type {afStudio.definition.ViewDefinition}
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
    
    /**
     * @constructor
     * @param {Object} config Controller configuration object
     */
    constructor : function(config) {
    	config = config || {};

        this.id = config.id || this.id;
        if (!this.id) {
            this.id = Ext.id(null, 'view-controller-');
        }    	
    	
    	if (config.url) {
    		this.url = config.url;
    	}
    	
    	if (config.viewDefinition) {
    		this.viewDefinition = new afStudio.definition.ViewDefinition({
    			data: config.viewDefinition
    		});
    	} else {
    		this.viewDefinition = new afStudio.definition.ViewDefinition();
    	}
    	
    	if (!config.widget && !Ext.isObject(config.widget)) {
    		throw new afStudio.controller.error.ControllerError('widget-cfg-incorrect');
    	}
		this.widget = config.widget;
    	/**
    	 * @property views After views instantiation contains key/values pairs of attached to this controller views. 
    	 * @type {Object}
    	 */
		this.views = config.views || {};
		
	    /**
	     * The store of all registred in controller model nodes
	     * @property nodeHash
	     * @type {Object}
	     */    	
        this.nodeHash = {};
        
        this.addEvents(
            "beforeModelNodeAppend",

            /**
             * @event modelNodeAppend
             * Fires when a new model node is appended
             * @param {afStudio.controller.BaseController} ctr The controller to which the model is mapped
             * @param {Node} parent The parent node to which new node was append
             * @param {Node} node The newly appended node
             * @param {Number} index The index of the newly appended node in parent's childNodes array
             */
            "modelNodeAppend",
            
            "beforeModelNodeRemove",
            
            /**
             * @event modelNodeRemove
             * Fires when a model node is removed
             * @param {afStudio.controller.BaseController} ctr The this model's controller
             * @param {Node} parent The parent of a node being removed
             * @param {Node} node The removed node
             */            
            "modelNodeRemove",
            
            "beforeModelNodeMove",
            
            /**
             * @event modelNodeMove
             * Fires when a model node is moved to a new location in the model
             * @param {afStudio.controller.BaseController} ctr The model's controller
             * @param {Node} mode This moved node 
             * @param {Node} oldParent The old parent of this node
             * @param {Node} newParent The new parent of this node
             * @param {Number} index The index it was moved to
             */
            "modelNodeMove",

            "beforeModelNodeInsert",
            
            /**
             * @event modelNodeInsert
             * Fires when a new child node is inserted in the model.
             * @param {afStudio.controller.BaseController} ctr The model's controller
             * @param {Node} parent The parent node being injected
             * @param {Node} node The child node inserted
             * @param {Node} refNode The child node the node was inserted before 
             */
            "modelNodeInsert",
            
            "beforeModelPropertyChanged",
            
            /**
             * @event modelPropertyChanged
             * Fires when a model node's property was changed.
             * @param {Node} node The model node whose property was changed
             * @param {String} property The property's name
             * @param {Mixed} value The new property's value
             */
            "modelPropertyChanged",
            
            "beforeModelNodeCreated",
            
            "modelNodeCreated",
            
            /**
             * @event modelNodeSelect
             * Fires when a model node is selected
             * @param {Node} modelNode The selected model node
             * @param {Ext.Component} trigger The trigger component which initiates model node selection
             */
            "modelNodeSelect",
            
            "ready",
            
            "beforeLoadViewDefinition",
            
            "loadViewDefinition",
            
            "beforeSaveViewDefinition",
            
            "saveViewDefinition"
        );
        
        afStudio.controller.BaseController.superclass.constructor.call(this);

        if (!this.viewDefinition.getData()) {
        	this.loadViewDefinition();
        }
    },
    //eo constructor
    
    /**
     * Initialises controller and all its resources.
     * @protected
     */
    initController : function() {
    	this.initModel();
    	this.initView();
        this.initEvents();
    	
        this.ready = true;
        this.fireEvent("ready");
    },
    //eo initController
    
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
     * Loads view definition and execute {@link #initController()}.
     * @protected
     */
    loadViewDefinition : function() {
    	var _me = this,
    		viewUrl = Ext.urlAppend(this.url, Ext.urlEncode({uri: this.widget.uri}));
    	
    	if (this.fireEvent('beforeLoadViewDefinition')) {
    		afStudio.xhr.executeAction({
    			url: viewUrl,
    			mask: {region: 'center'},
    			showNoteOnSuccess: false,
    			scope: _me,
    			run: function(response, ops) {
				   	//set up viewDefinition object
    				this.viewDefinition.setData(response.data);
    				this.fireEvent('loadViewDefinition', this.viewDefinition);
    				this.initController();
    			}
    		});
    	}
    },
    //eo loadViewDefinition
    
    /**
     * Saves view definiton.
     */
    saveViewDefinition : function() {
    	var _me = this,
    		   vd = this.viewDefinition;
    		   
    	if (this.fireEvent('beforeSaveViewDefinition', vd)) {
    		//code
    		
    		this.fireEvent('saveViewDefinition');
    	}
    },
    //eo saveViewDefinition
    
    /**
     * Instantiates model layer.
     * Template method.
     * @protected
     */
    initModel : function() {
    	var vd = this.viewDefinition.getData();

		var root = new afStudio.model.Root({
    		definition: vd
    	});
    	
    	this.registerModel(root);
    },
    //eo initModel
    
    /**
     * Instantiates view layer.
     * Template method.
     * @protected
     */
    initView : function() {
    	var _me = this;
    
    	try {
	    	Ext.iterate(this.views, function(k, v, views) {
	    		if (!Ext.isFunction(v.view)) {
	    			throw new afStudio.controller.error.ControllerError('view-constructor');
	    		}
	    		views[k] = new v.view( Ext.apply(v.cfg ? v.cfg : {}, {controller: _me}) );
	    	});
    	} catch(e) {
			if (e instanceof afStudio.controller.error.ControllerError) {
				throw e;
			} else {
    			throw new afStudio.controller.error.ControllerError('init-view');
			}
    	}
    },
    //eo initView
    
    /**
     * Template method.
     * @protected
     */
    initEvents : function() {
    	var _me = this;
    	
    	_me.on({
    		scope: _me,
  			
            /**
             * @bubbled
             */
            modelNodeAppend: function(ctr, parent, node, index) {
				console.log('@controller modelNodeAppend', parent, node, index);
            	this.viewDefinition.addEntity(parent, node);
            	console.log('definition', this.viewDefinition.getData());
            },
            /**
             * @bubbled
             */
            modelNodeInsert: function(ctr, parent, node, refNode) {
				console.log('@controller modelNodeInsert', parent, node, refNode);
            	this.viewDefinition.insertBeforeEntity(parent, node, refNode);
            	console.log('definition', this.viewDefinition.getData());
            },
    		/**
    		 * @bubbled
    		 */
            modelNodeRemove: function(ctr, parent, node) {
            	console.log('@controller modelNodeRemove', parent, node);            	
            	this.viewDefinition.removeEntity(node);
            	console.log('definition', this.viewDefinition.getData());
            },
    		/**
    		 * @bubbled
    		 */
            modelPropertyChanged: function(node, p, v) {
            	console.log('@controller modelPropertyChanged', node, p, v);
            }
    	});
    	
    	//TODO improve - move to the separate method
    	//Relays controller's events to View layer
    	Ext.iterate(this.views, function(k, v) {
    		v.relayEvents(_me, [
    			'modelNodeAppend', 'modelNodeInsert', 'modelNodeRemove', 'modelNodeMove',
    			'modelNodeSelect', 'modelPropertyChanged'
    		]);
    	});
    },
    //eo initEvents
    
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
     * Registers a Model. Sets up a model's root node.
     * @protected
     * @param {Node} node
     * @return {Node} model's root node.
     */
    registerModel : function(node) {
        this.root = node;
        node.isRoot = true;
     	node.setOwnerTree(this);
        
        return node;
    },
    //eo registerModel
    
    registerView : function (view) {
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
    },
    
    /**
     * Fires event {@link #modelNodeSelect} which is relaed to view layer.
     * @public
     * @param {Node} node The model node being selected
     * @param {Ext.Component} (Optional) view The component which triggers selection
     */
    selectModelNode : function(node, view) {
    	node = Ext.isString(node) ? this.getNodeById(node) : node;
    	
    	if (!node) {
    		return;
    	}
    	
    	console.log('@controller selectModelNode', node);
    	
    	this.fireEvent('modelNodeSelect', node, view ? view : undefined);
    }
    //eo selectModelNode
});