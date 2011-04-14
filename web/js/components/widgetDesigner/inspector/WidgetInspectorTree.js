Ext.namespace('afStudio.wi');

/**
 * Widget Inspector tree component.
 * Responsible for representing and monupulating of widget's elements (fields, columns, datasource and etc.)
 * 
 * @class afStudio.wi.WidgetInspectorTree
 * @extends Ext.tree.TreePanel
 * @author Nikolai
 */
afStudio.wi.WidgetInspectorTree = Ext.extend(Ext.tree.TreePanel, {
	/**
	 * @cfg {String} layout
	 */
	layout : 'fit'
	
	/**
	 * Widget metadata.
	 * @cfg {Object} widgetMeta
	 */	
	
    /**
     * Tree sorter.
     * @property treeSorter
     * @type {Ext.tree.TreeSorter}
     */	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
        var root = this.createRootNode();

        var bootomBar = new Ext.Toolbar({
			items: [{
	            text: 'Save'
	            //TODO refactor!
//	            handler: function() {
//	                this.widgetInspectorTree.body.mask('Loading, please Wait...', 'x-mask-loading');
//	                var widgetsTreePanel = afStudio.getWidgetsTreePanel()
//	                widgetsTreePanel.saveWidgetDefinition();
//	            },
//	            scope: this
	        }]
        });            
        
        this.treeSorter = new Ext.tree.TreeSorter(this, {
        	folderSort: true
        });
	    
		return {
			root: root,			
            animate: true,
            containerScroll: true,
            autoScroll: true,
            bbar: bootomBar
		};
	}//eo _beforeInitComponent
	
	
	/**
	 * Ext Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this,
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wi.WidgetInspectorTree.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this;
		
		this.on({
			scope: _this,			
			afterrender: _this.initWidgetInspectorTree
		});
	}//eo _afterInitComponent

	/**
	 * Initialises inspector tree after it was rendered.
	 * This tree <u>afterrender</u> event listener.
	 * @private
	 */	
	,initWidgetInspectorTree : function() {		
		this.expandAll();
	}//eo initWidgetInspectorTree 
	
	/**
	 * Creates root node for this tree.
	 * @return {afStudio.wi.ObjectRootNode} concrete class root node
	 */
   ,createRootNode : function() {
   	    var wUri = this.widgetMeta.widgetUri,
   	    	df = this.widgetMeta.definition,
   	    	root;
   	    
       	switch (df.type) {
           case 'list':
               root = new afStudio.wi.ListNode();
           break;
           case 'edit':
               root = new afStudio.wi.EditNode();
           break;
       	}
       	root.setText(wUri + ' [' + df.type + ']');       
       	root.configureFor(df);
       
       	return root;
   }//eo createRootNode
   
});

/**
 * @type afStudio.wi.widgetInspectorTree
 */
Ext.reg('afStudio.wi.widgetInspectorTree', afStudio.wi.WidgetInspectorTree);