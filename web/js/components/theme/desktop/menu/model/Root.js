/**
 * Model <u>root</u> node.
 * 
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.menu.model.Root = Ext.extend(afStudio.theme.desktop.menu.model.Node, {
    
    /**
     * Root node tag property, value = "root".
     * @property tag
     * @type {String}
     */
    tag: 'root',
    
    properties : [
        {name: "type", type: 'string', required: true, readOnly: true}
    ],
    
    /**
     * Model Root node constructor.
     * @constructor
     * @param {Object} config
     */
    constructor : function(config) {
        
        afStudio.theme.desktop.menu.model.Root.superclass.constructor.call(this, config);
        
        //set modelType property to have compatibility with base Node class
        this.modelType = this.getModelType();
        
        this.initStructure(config.structureTpl);
        
        this.processStructure();
    },
    
    /**
     * Initialized Model Root node {@link #strTpl}.
     * Template method.
     * @override 
     * @protected
     * @param {Function|String} strc The model structure
     */
    initStructure : function(strc) {
        var mt = this.getModelType();
        
        if (strc) {
            strc = Ext.isFunction(strc) ? strc : afStudio.theme.desktop.menu.model.template[strc];
        } else if (mt) {
            var sTpl = mt.ucfirst() + 'Template';
            strc = afStudio.theme.desktop.menu.model.template[sTpl];
        }
        
        /**
         * Model Root node's structure template @type {Object}
         */
        this.strTpl = Ext.isFunction(strc) ? new strc() : undefined;
    },
    
    /**
     * Processes node structure based on {@link #strTpl}.
     * Template method.
     * @protected
     */
    processStructure : function() {
        if (!this.strTpl) {
            return;
        }
        
        this.suspendEvents();
        this.strTpl.processStructure(this);
        this.resumeEvents();
        
        //update nodeTypes
        this.nodeTypes = this.nodeTypes.concat(this.strTpl.structure);
    },
    
    /**
     * Retruns this root node.
     * @override
     * @return {Node}
     */
    getRootNode : function() {
        return this;
    },
    
    /**
     * Returns Model's type.
     * @override
     * @return {String} type if specified otherwise returns undefined
     */
    getModelType : function() {
        return this.getPropertyValue('type');
    },
    
    /**
     * Returns model node by its ID.
     * @param {String} nodeId The node ID value
     * @return {Node} The found child or null if none was found
     */
    getModelNode : function(nodeId) {
        return this.findChildById(nodeId, true);
    },
    
    /**
     * Returns direct(immediate) child model node of this model(root model node).
     * @param {String} nodeId The searching child node's ID
     * @return {Node} child model node
     */
    getImmediateModelNode : function(nodeId) {  
        return this.findChildById(nodeId, false, true);
    },
    
    /**
     * Validates model.
     * Returns true if the model is valid otherwise returns array of errors {@link afStudio.model.Node#validate}.
     * @return {Boolean|Array} 
     */
    isValid : function() {
        var errors = {
            children: []
        };
        
        this.eachChild(function(node){
            var e = node.validate();
            if (e !== true) {
                errors.children.push(e);
            }
        });
        
        return errors.children.length > 0 ? errors : true;
    }    
    
});