Ext.ns('afStudio.view');

/**
 * InspectorPalette is the palette of instruments dedicated for model data browsing/building/manipulating. 
 * 
 * @class afStudio.view.InspectorPalette
 * @extends Ext.Container
 * @author Nikolai Babinski
 */
afStudio.view.InspectorPalette = Ext.extend(Ext.Container, {
    
    /**
     * @cfg {afStudio.controller.BaseController} (required) controller 
     */ 
    
    /**
     * @cfg {String} layout The palettee layout, defaults to "fit" 
     */
    layout : 'fit',
    
    /**
     * @cfg {String} style
     */
    style : 'border-top: 1px solid #99BBE8;',
    
    /**
     * @property itCt The inspector tree container component.
     * @type {Ext.tree.TreePanel}
     */
    
    /**
     * @property pgCt The property grid container component.
     * @type {Ext.Panel}
     */
    
    /**
     * Initializes component
     * @private
     * @return {Object} The configuration object 
     */
    _beforeInitComponent : function() {
        var c = this.controller,
            tr = c.getView('inspectorTree'),
            pg = c.getView('propertyGrid');
            
        return {
            items: [
            {
                title: this.title,
                layout: 'border',
                defaults: {
                    layout: 'fit',
                    border: false
                },
                items: [
                {
                    region: 'center',
                    ref: '../itCt',
                    items: tr
                },{
                    region: 'south',
                    ref: '../pgCt',
                    split: true,
                    collapseMode: 'mini',                   
                    items: pg
                }]
            }]
        };
    },
    //eo _beforeInitComponent   
    
    /**
     * Template method
     * @override
     * @private
     */
    initComponent : function() {
        Ext.apply(this, 
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );
        
        afStudio.view.InspectorPalette.superclass.initComponent.apply(this, arguments);
        
        this._afterInitComponent();
    },
        
    /**
     * Initializes events & does post configuration
     * @private
     */
    _afterInitComponent : function() {
        this.on({
            scope: this,
            
            afterrender: function() {
                (function(){
                    h = this.pgCt.ownerCt.getInnerHeight() / 2;
                    this.pgCt.setHeight(h);  
                    this.pgCt.ownerCt.doLayout();    
                }).defer(100, this);
            }
        });
    }
});