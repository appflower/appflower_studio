/**
 * 
 * @param {Object} 
 */
afStudio.widgetDesigner.ContainerNodeBuilder = function(){};
afStudio.widgetDesigner.ContainerNodeBuilder = Ext.extend(afStudio.widgetDesigner.ContainerNodeBuilder,{
    baseObject: afStudio.widgetDesigner.ContainerNode,
    getConstructor: function(config){
        var f = Ext.extend(this.baseObject, {});
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
    }

});
