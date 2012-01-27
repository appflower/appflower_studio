N = afStudio.theme.desktop.shortcut.model; 

N.Link = Ext.extend(N.Node, {

    tag: 'link',
    
    properties : [
        {name: 'name', type: 'dbNameType', required: true},
        {name: 'title', type: 'string', required: true},
        {name: 'url', type: 'anyURI', required: true},
        {name: 'iconCls', type: 'token'},
        {name: 'icon', type: 'absoluteUriType'}
    ],
    
    defaultDefinition : {
        name: 'shortcut',
        title: 'Shortcut',
        url: '#'
    },     
    
    /**
     * @overrride
     * @protected
     */
    applyNodeDefinition : function(definition, silent) {
        var me = this;
        
        if (!Ext.isDefined(definition)) {
            return;
        }
        
        silent ? this.suspendEvents() : null;
        
        if (Ext.isObject(definition)) {
	        this.applyProperties(definition);
        }
        
        silent ? this.resumeEvents() : null;
    },
    
    /**
     * @overrride
     * @protected
     */
    fetchNodeDefinition : function() {
        var def = this.getPropertiesHash(true);
        //remove service property
        delete def.name;
        
        return def;
    }
});

delete N;