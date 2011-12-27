Ext.namespace('afStudio.common');

/**
 * ModelsTree lists all available models.
 * 
 * @class afStudio.common.ModelsTree
 * @extends Ext.tree.TreePanel
 * @author Nikolai Babinski
 */
afStudio.common.ModelsTree = Ext.extend(Ext.tree.TreePanel, {
	
	/**
	 * @cfg {String} url The ModelsTree URL (defaults to "/appFlowerStudio/models") 
	 */
	url : afStudioWSUrls.modelListUrl,
	
    /**
     * Initializes component
     * @private
     * @return {Object} The config object
     */
    _beforeInitComponent : function() {
        var me = this;
        
        var rootNode = new Ext.tree.AsyncTreeNode({
            path:'root',
            text: 'ModelRoot', 
            draggable: false
        });     

        var modelTools =  [{
            id: 'refresh', 
            handler: Ext.util.Functions.createDelegate(me.refreshModels, me)
        }];
        
        var modelLoader = new Ext.tree.TreeLoader({
            url: this.modelsUrl || this.url,
            baseParams: {
                cmd: 'get'
            }
        });
        
        var modelSorter = new Ext.tree.TreeSorter(this, {
            dir: "asc"
        });
        
        return {
            title: 'Models',            
            iconCls: 'icon-databases',
            loader: modelLoader,
            treeSorter: modelSorter,
            autoScroll: true,
            root: rootNode,
            rootVisible: false,
            tools: modelTools
        };
    },
    
    /**
     * Ext template method.
     * @private
     * @override
     */ 
    initComponent: function() {        
        Ext.apply(this, 
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );
        afStudio.common.ModelsTree.superclass.initComponent.apply(this, arguments);
        this._afterInitComponent();
    },
    
    /**
     * @private
     */
    _afterInitComponent : function() {
        var me = this;
        
        me.addEvents(
            /**
             * @event modelsload Fires when the models tree was loaded
             */
            'modelsload'
        );
    },
    
    /**
     * Render template method.
     * @override
     * @private
     */
    onRender : function() {
        var me = this;
        
        afStudio.common.ModelsTree.superclass.onRender.apply(this, arguments);
        
        me.on({
            scope: me,
            
            dblclick: me.onModelDbClick
        }); 
        
        //Loader events 
        me.loader.on({
            scope: me,
            
            beforeload: me.onLoaderBeforeLoad,
            load: me.onLoaderLoad,
            loadexception: me.onLoaderLoadException
        });             
        
        //prevent default browser context menu to appear 
        me.el.on('contextmenu', function() {return false;}, null, {stopEvent: true});

        me.root.expand();
    },
    
	/**
	 * Masks ModelsTree
	 * @param {String} (optional) message The message to use in the mask
	 */
	maskModelsTree : function(message) {
		this.body.mask(message ? message : 'loading...', 'x-mask-loading');
	},
	
	/**
	 * Unmasks ModelsTree
	 */
	unmaskModelsTree : function() {
		this.body.unmask();
	},	
	
	/**
	 * Selects Model's node
	 * @param {Ext.tree.TreeNode} node The Model's node to select
	 */
	selectModel : function(node) {		
		this.selectPath(node.getPath());
	},
	
    /**
     * Returns model node by name.
     * @param {String} name The model name
     * @return {Node} The found child or null if none was found
     */
	findModelByName : function(name) {
		return this.getRootNode().findChild('text', name);
	},
	
	/**
	 * Reloads models tree.
	 * @param {Function} (optional) callback The callback function to be run after reloading
	 */
	reloadModels : function(callback) {		
		if (Ext.isFunction(callback)) {
			 this.getRootNode().reload(callback);
		} else {
			this.getRootNode().reload();
		}
	},
	
	/**
	 * Hadles "refresh" tools click
	 * look at {@link Ext.Panel#tools}
	 * @param {Ext.EventObject} e
	 * @param {Ext.Element} toolEl
	 * @param {Ext.Panel} p
	 * @param {Object} tc
	 */
	refreshModels : function(e, toolEl, p, tc) {
		this.reloadModels();
	},
	
	/**
	 * Returns <u>schema</u> attribute from a model node.
	 * @param {Node} node The model node
	 * @return {String} schema attribute or undefined if it was not found
	 */
	getSchema: function(node) {
		return node.attributes.schema || undefined;
	},
	
    /**
     * Returns model name.
     * @param {Node} node The model
     * @return {String} model name
     */
    getModel: function(node) {
		return node.text;
	},
	
	/**
	 * ModelsTree <u>click</u> event listener
     * @protected
	 * @param {Ext.tree.TreeNode} node
	 * @param {Ext.EventObject} e
	 */
	onModelClick : function(node, e) {
	},
	
	/**
	 * ModelsTree <u>dbclick</u> event listener
	 * @param {Ext.Node} node The Model dbclicked node
	 * @param {Ext.EventObject} e
	 * @protected
	 */
	onModelDbClick : Ext.emptyFn,
	
	/**
	 * ModelsTree's Loader <u>beforeload</u> event listener
	 * look at {@link Ext.tree.TreeLoader#beforeload}.
     * @protected
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node
	 * @param {Function} callback
	 */
	onLoaderBeforeLoad : function(loader, node, callback) {		
		this.maskModelsTree();				
	},
	
	/**
	 * ModelsTree's Loader <u>load</u> event listener
	 * look at {@link Ext.tree.TreeLoader#load}.
     * @protected
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node
	 * @param {XHR} response
	 */
	onLoaderLoad : function(loader, node, response) {
		this.unmaskModelsTree();
		this.fireEvent('modelsload', loader, response);
	},
	
	/**
	 * ModelsTree's Loader <u>loadexception</u> event listener
	 * look at {@link Ext.tree.TreeLoader#loadexception}.
     * @protected
	 * @param {Ext.tree.TreeLoader} loader
	 * @param {Ext.tree.TreeNode} node
	 * @param {XHR} response
	 */
	onLoaderLoadException : function(loader, node, response) {
		this.unmaskModelsTree();
	}
}); 

// register xtype
Ext.reg('afStudio.common.modelsTree', afStudio.common.ModelsTree);