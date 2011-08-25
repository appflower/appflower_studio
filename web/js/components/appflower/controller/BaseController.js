//Base controller namespace
Ext.ns('afStudio.controller');

/**
 * Base Model controller class.
 * 
 * @dependency {afStudio.controller.error} errors 
 * @dependency {afStudio.model.Root} model 
 * @dependency {afStudio.definition.ViewDefinition} definition 
 * 
 * @class afStudio.controller.BaseController
 * @extends Ext.util.Observable
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.controller.BaseController = Ext.extend(Ext.util.Observable, {
	/**
	 * @cfg {String|Object} url
	 */
	/**
	 * @cfg {Object} viewDefinition
	 * (Optional) The view definiton object - meta-data for the Model.
	 */
	/**
	 * The Views to be associated with this controller.
	 * @cfg {Object} views:
	 * <ul>
	 * {
	 * 	<li><b>viewID</b>: {String} The view ID inside the views object, must be unique
	 * 		<ul>
	 * 		{
	 * 			<li><b>view</b>: {Function} The view constructor function</li>	
	 * 			<li><b>cfg</b>: {Object} (Optional) The view configuration object</li>	
	 * 		}</ul>
	 * 	</li>
	 * 	<li>[, ...]</li>
	 * }
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
     * The Model (model's root node) associated with this controller.
     * Read-only property.
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
    		if (Ext.isObject(config.url)) {
    			this.url = Ext.apply(Ext.isObject(this.url) ? this.url : {}, config.url);
    		} else {
    			this.url = config.url;
    		}
    	}
    	
    	if (config.viewDefinition) {
    		this.viewDefinition = new afStudio.definition.ViewDefinition({
    			data: config.viewDefinition
    		});
    	} else {
    		this.viewDefinition = new afStudio.definition.ViewDefinition();
    	}
    	
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
            
            /**
             * @event ready
             * Fires when controller is ready - model & views were instantiated and registered
             * @param {Object} controller
             */
            "ready",
            
            "beforeLoadViewDefinition",
            
            "loadViewDefinition",
            
            "beforeSaveViewDefinition",
            
            "saveViewDefinition"
        );
        
        if (config.listeners) {
        	this.listeners = config.listeners; 
        }
        
        afStudio.controller.BaseController.superclass.constructor.call(this);
    },
    //eo constructor
    
    /**
     * Launches controller.
     * @public
     */
    run : function() {
        if (!this.viewDefinition.getData()) {
        	this.loadViewDefinition();
        } else {
        	this.initController();
        }
    },
    
    /**
     * Initialises controller and all its resources.
     * <ul>
     * 	<li>1. Init Models</li>
     * 	<li>2. Init Views</li>
     * 	<li>3. Fires ready event</li>
     * </ul> 
     * @protected
     */
    initController : function() {
    	this.initModel();
    	this.initView();
    	
        this.ready = true;
        this.fireEvent("ready", this);
    },
    //eo initController
    
    /**
     * Returns controller's ready state. 
     * Controller is ready means that model, views were instantiated and registered.
     * @public
     * @return {Boolean} ready state
     */
    isReady : function() {
    	return this.ready;
    },

    /**
     * Returns view definition object.
     * @public
     * @return {Object}
     */
    getViewDefinition : function() {
    	return this.viewDefinition;
    },
    
    /**
     * Returns url by the action.
     * @public
     * @param {String} action
     * @param {Object} params The parameters being added to url path 
     * @return {String} url or null if url was not found
     */
    getUrl : function(action, params) {
    	var url = this.url;
    	url = Ext.isObject(url) ? url[action] : url;
    	
    	if (url) {
    		return params ? Ext.urlAppend(url, Ext.urlEncode(params)) : url;
    	} 
    	
    	return null;
    },
    
    /**
     * Returns registered view.
     * @param {String} id The view id
     * @return {Object} view
     */
    getView : function(id) {
    	return this.views[id];	
    },
    
    /**
     * Loads view definition and execute {@link #initController()}.
     * @protected
     */
    loadViewDefinition : function() {
    	var _me = this,
    		defUrl = this.getUrl('read');
    	
    	if (this.fireEvent('beforeLoadViewDefinition')) {
    		afStudio.xhr.executeAction({
    			url: defUrl,
    			mask: {region: 'center'},
    			showNoteOnSuccess: false,
    			scope: _me,
    			run: function(response, ops) {
				   	//setup viewDefinition object
    				this.viewDefinition.setData(response.data);
    				this.fireEvent('loadViewDefinition', this.viewDefinition);
    				this.initController();
    			}
    		});
    	}
    },
    //eo loadViewDefinition
    
    /**
     * Saves view model.
     * @public
     * @param {Object} (Optional) params The save parameters
     */
    saveView : function(params) {
    	this.saveViewDefinition(params);
    },
    
    /**
     * Saves view definiton.
     * @protected
     * @param {Object} (Optional) params The parameters
     */
    saveViewDefinition : function(params) {
    	var _me = this,
    		saveUrl = this.getUrl('save'),
			vd = this.viewDefinition.getData();
    	
		params = Ext.apply(params || {}, {
			data: Ext.util.JSON.encode(vd),
			createNewWidget: false 
		});
			
    	if (this.fireEvent('beforeSaveViewDefinition', vd)) {
    		afStudio.xhr.executeAction({
    			url: saveUrl,
    			params: params, 
    			mask: {msg: 'Processing...', region: 'center'},
    			scope: _me,
    			run: function(response, ops) {
    				this.fireEvent('saveViewDefinition', vd);
    			}
    		});
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
    	
    	this.initModelEvents();
    },
    //eo initModel
    
    /**
     * Instantiates view layer.
     * Template method.
     * @protected
     */
    initView : function() {
    	Ext.iterate(this.views, function(k, v, views) {
    		if (!Ext.isFunction(v.view)) {
    			throw new afStudio.controller.error.ControllerError('view-constructor');
    		}
    		this.registerView(k, v.view, v.cfg ? v.cfg : {});
    	}, this);
    },
    //eo initView
    
    /**
     * Init model events
     * @protected
     */
    initModelEvents : function() {
    	var _me = this;
    	
    	_me.on({
    		scope: _me,

    		/**
             * @bubbled
             */
    		modelNodeCreated : function(ctr, parent, node) {
    			console.log('@controller modelNodeCreated');
    			var canAdd = this.viewDefinition.canBeAdded(parent, node);
    			if (!canAdd) {
    				afStudio.Msg.warning('View Definition', 
    					String.format('You have already added "{0}" but did not modified it. <br /> It should be modefied before you can add a new one.', node.tag));
    			}
    			
    			return canAdd;
    		},
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
            beforeModelPropertyChanged: function(node, p, v) {
            	console.log('@controller beforeModelPropertyChanged', node, p, v);
            	this.viewDefinition.setEntityAttribute(node, p, v);
            	console.log('definition', this.viewDefinition.getData());
            }
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
     * Returns the model - root node for this controller.
     * @public
     * @return {Node} model
     */
    getRootNode : function() {
        return this.root;
    },

    /**
     * Registers a model. Sets up a model's root node.
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
    
    /**
     * Registers a view.
     * @public
     * @param {String} id The view's ID inside {@link #views} object
     * @param {Function} view The view constructor
     * @param {Object} cfg The view configuration object
     */
    registerView : function(id, view, cfg) {
    	var me = this;
    	cfg = Ext.apply(cfg || {}, {controller: me});
    	view = me.views[id] = new view(cfg);
    	
		view.relayEvents(me, [
			'modelNodeAppend', 'modelNodeInsert', 'modelNodeRemove', 'modelNodeMove',
			'modelNodeSelect', 'modelPropertyChanged'
		]);
    },

    /**
     * Runs model validation.
     * @return {Boolean|Array} true if valid otherwise array of errors
     */
    validateModel : function() {
    	return this.root.isValid();
    },
    
    /**
     * Returns a model node in this controller by its id.
     * @param {String} id
     * @public
     * @return {Node} node
     */
    getNodeById : function(id) {
        return this.nodeHash[id];
    },

    /**
     * Registers model node
     * @private
     * @param {Node} node
     */
    registerNode : function(node) {
        this.nodeHash[node.id] = node;
    },

    /**
     * Unregisters model node
     * @private
     * @param {Node} node
     */
    unregisterNode : function(node) {
        delete this.nodeHash[node.id];
    },

    /**
     * Returns controller as a string.
     * @override
     * @public
     * @return {String} controller
     */
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
    	console.log('@controller selectModelNode', node);
    	
    	node = Ext.isString(node) ? this.getNodeById(node) : node;
    	if (!node) {
    		return;
    	}
    	this.fireEvent('modelNodeSelect', node, view ? view : undefined);
    },
    //eo selectModelNode
    
    /**
     * Cleanup resources. Destroys all views, model.
     */
    destroy : function() {
    	Ext.iterate(this.views, function(k, v){
    		Ext.destroy(v);
    	});
    	this.views = null;
    	
		this.root = this.viewDefinition = this.nodeHash = null;
    }
});