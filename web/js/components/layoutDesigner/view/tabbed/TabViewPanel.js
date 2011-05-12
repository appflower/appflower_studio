Ext.namespace('afStudio.layoutDesigner.view');

/**
 * TabViewPanel base class for Tabbed views.
 * 
 * @class afStudio.layoutDesigner.view.TabViewPanel
 * @extends Ext.TabPanel
 * @author Nikolai
 */
afStudio.layoutDesigner.view.TabViewPanel = Ext.extend(Ext.TabPanel, {
	
	/**
	 * Constructor
	 * @param {Object} config
	 */
	constructor : function(config) {		
		Ext.apply(config, {
			enableTabScroll: true,
			plugins: new afStudio.layoutDesigner.view.TabbedViewCloseMenuPlugin()
		});
		
		afStudio.layoutDesigner.view.TabViewPanel.superclass.constructor.call(this, config);
	}//eo constructor	
	
	/**
	 * Examines if all tabs are closed.
	 * Fires event 'alltabswereclosed' 
	 * @protected
	 */
	,allTabsAreClosed : function() {
     	if (this.items.getCount() == 0) {
     		this.fireEvent('alltabswereclosed');
     	}		
	}//eo allTabsAreClosed
	
	/**
	 * ExtJS
	 * @private 
	 */
	,onRender : function(ct, position) {
		afStudio.layoutDesigner.view.TabViewPanel.superclass.onRender.call(this, ct, position);
		
		this.addEvents(
			/**
			 * @event 'alltabswereclosed' Fires after all tabs were <tt>closed</tt>
			 */
			'alltabswereclosed'
		);		
	}//eo onRender
 
	// private
	/**
	 * ExtJS
	 * @private
	 * Adds <b>dblclick</b> event to <tt>strip</tt> element.  
	 */
    ,initEvents : function() {
    	afStudio.layoutDesigner.view.TabViewPanel.superclass.initEvents.call(this);
        this.strip.on('dblclick', this.onStripDblClick, this);
    }//eo initEvents
	
    //private (Ext 3.3.1)
    ,onStripMouseDown : function(e) {
        if(e.button !== 0){
            return;
        }
        e.preventDefault();
        var t = this.findTargets(e);        
        if(t.close){
            if (t.item.fireEvent('beforeclose', t.item) !== false) {
                t.item.fireEvent('close', t.item);
                this.remove(t.item);
            }
            
            //custom
            this.allTabsAreClosed();
            
            return;
        }
        if(t.item && t.item != this.activeTab){
            this.setActiveTab(t.item);
        }
    }//eo onStripMouseDown
    
    /**
     * @protected
     * @param {Ext.EventObject} e
     */
    ,onStripDblClick : function(e) {
    	var pl = this.plugins,
    		 t = this.findTargets(e);

    	if (!Ext.isEmpty(t.item)) {
    		pl.setActiveTabProperty(t.item);
    		pl.onRename();
    	}
    }//eo onStripDblClick
    
});