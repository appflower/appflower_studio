/**
 * Abstract class that represents elements like i:actions or i:fields
 * Those can contain many childrens with the same name
 *
 */
afStudio.widgetDesigner.CollectionNode = Ext.extend(afStudio.widgetDesigner.BaseNode, {
    addChildActionLabel: 'Add child',
    childNodeId: 'i:child',
    createContextMenu: function(){
        this.contextMenu = new Ext.menu.Menu({
            items: [
                {
                    text: this.addChildActionLabel,
                    handler: this.addChild,
                    scope: this,
                    iconCls: 'icon-add'
                }
            ]
        });
    },
    contextMenuHandler: function(node, e){
        node.select();
        this.contextMenu.showAt(e.getXY());
    },
    addChild: function(){
        var newNode = this.createChild();
        this.appendChild(newNode);
        if (this.rendered) {
            this.expand();
        }
        return newNode;
    },
    configureForValue: function(id, value){
        if (id == this.childNodeId) {
            if (!Ext.isArray(value)) {
                value = [value];
            }
            for(var i=0;i<value.length;i++){
                var newNode = this.addChild();
                newNode.configureFor(value[i]);
            }
        } else {
            afStudio.widgetDesigner.CollectionNode.superclass.configureForValue.apply(this, arguments);
        }
    },
    dumpChildsData: function(){
        var data = [];
        this.eachChild(function(childNode){
            data.push(childNode.dumpDataForWidgetDefinition());
        });

        var ret = {};
        ret[this.childNodeId] = data;
        return ret;
    },
    /**
     * this method should create and return new child node
     */
    createChild: function(){
    }
});
