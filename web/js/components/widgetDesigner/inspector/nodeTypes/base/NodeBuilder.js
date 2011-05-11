/**
 * Thanks to this builder class you can create WI node types at runtime
 * It works similar to Ext.data.record.create() method which returns constructor function
 * Returned constructor can be used to create many instances of defined node type
 * 
 * @singleton
 */
afStudio.wi.NodeBuilder = {
	
	/**
	 * Extends base class instance and returns its new descendant.
	 * If base class wasn't specified is used {@link afStudio.wi.ContainerNode} as a base class.
	 * @param {Object} config The new class configuration object
	 * @param {Function} (optional) baseClass The base class being extended
	 * @return {Function} subclass of baseClass
	 */
    createContainerNode : function(config, baseClass) {
        if (!baseClass){
            baseClass = afStudio.wi.ContainerNode;
        }
        var f = Ext.extend(baseClass, {});
        var p = f.prototype;

        p.getNodeConfig = function() {
            var nodeConfig = {};
            if (config.id) {
               nodeConfig.id = config.id;
            }
            if (config.text) {
                nodeConfig.text = config.text;
            }
            if (config.iconCls) {
                nodeConfig.iconCls = config.iconCls;
            }
            if (config.metaField) {
            	nodeConfig.metaField = config.metaField            	
            }
            return nodeConfig;
        }

        if (config.createProperties) {
            p.createProperties = function() {
                var properties = config.createProperties.call(this);
                this.addProperties(properties);
            };
        }

        if (config.createRequiredChilds) {
            p.addRequiredChilds = function() {
                var childs = config.createRequiredChilds();
                for (var i = 0; i < childs.length; i++) {
                    this.appendChild(childs[i]);
                }
            };
        }
        
        return f;
    }//eo createContainerNode
    
    /**
     * Creates collection node function.
	 * Extends base class instance and returns its new descendant.
	 * If base class wasn't specified is used {@link afStudio.wi.CollectionNode} as a base class. 
	 * @param {Object} config The new class configuration object
	 * @param {Function} (optional) baseClass The base class being extended
	 * @return {Function} subclass of baseClass
     */
    ,createCollectionNode : function(config, baseClass) {
        var f = this.createContainerNode(config, (baseClass ? baseClass : afStudio.wi.CollectionNode));
        var p = f.prototype;

        if (config.addChildActionLabel) {
            p.addChildActionLabel = config.addChildActionLabel;
        }
        
        if (config.childNodeId) {
            p.childNodeId = config.childNodeId;
        }

        if (Ext.isDefined(config.dumpEvenWhenEmpty)) {
            p.dumpEvenWhenEmpty = config.dumpEvenWhenEmpty;
        }

        if (config.createChildConstructor) {
            p.createChild = function() {
                return new config.createChildConstructor;
            }
        }

        return f;
    }//eo createCollectionNode
};