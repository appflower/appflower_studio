/**
 * Thanks to this builder class you can create WI node types at runtime
 * It works similar to Ext.data.record.create() method which returns constructor function
 * Returned constructor can be used to create many instances of defined node type
 */
afStudio.widgetDesigner.NodeBuilder = {
    createContainerNode: function(config, baseClass){
        if (!baseClass){
            baseClass = afStudio.widgetDesigner.ContainerNode;
        }
        var f = Ext.extend(baseClass, {});
        var p = f.prototype;

        p.getNodeConfig = function(){
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
            return nodeConfig;
        }

        if (config.updateNodeNameFromPropertyId) {
            p.updateNodeNameFromPropertyId = config.updateNodeNameFromPropertyId;
        }

        if (config.createProperties) {
            p.createProperties = function(){
                var properties = config.createProperties();
                for(var i=0; i<properties.length;i++){
                    this.addProperty(properties[i]);
                }
            };
        }

        if (config.createRequiredChilds) {
            p.addRequiredChilds = function(){
                var childs = config.createRequiredChilds();
                for(var i=0; i<childs.length;i++){
                    this.appendChild(childs[i]);
                }
            };
        }


        return f;
    },
    createCollectionNode: function(config){
        var f = this.createContainerNode(config, afStudio.widgetDesigner.CollectionNode);
        var p = f.prototype;

        if (config.addChildActionLabel) {
            p.addChildActionLabel = config.addChildActionLabel;
        }
        if (config.childNodeId) {
            p.childNodeId = config.childNodeId;
        }

        if (config.dumpEvenWhenEmpty != undefined) {
            p.dumpEvenWhenEmpty = config.dumpEvenWhenEmpty;
        }


        if (config.createChildConstructor) {
            p.createChild = function(){
                return new config.createChildConstructor;
            }
        }

        return f;
    }

};