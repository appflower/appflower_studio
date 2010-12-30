/**
 * 
 * @param {Object} 
 */
afStudio.widgetDesigner.CollectionNodeBuilder = Ext.extend(afStudio.widgetDesigner.ContainerNodeBuilder,{
    baseObject: afStudio.widgetDesigner.CollectionNode,
    getConstructor: function(config){
        var f = afStudio.widgetDesigner.CollectionNodeBuilder.superclass.getConstructor.apply(this,[config]);
        var p = f.prototype;

        if (config.addChildActionLabel) {
            p.addChildActionLabel = config.addChildActionLabel;
        }
        if (config.childNodeId) {
            p.childNodeId = config.childNodeId;
        }


        if (config.createChildConstructor) {
            p.createChild = function(){
                return new config.createChildConstructor;
            }
        }

        return f;
    }

});