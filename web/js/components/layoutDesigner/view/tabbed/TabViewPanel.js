Ext.namespace('afStudio.layoutDesigner.view');

/**
 * TabViewPanel base class for Tabbed views.
 * 
 * @class afStudio.layoutDesigner.view.TabViewPanel
 * @extends Ext.TabPanel
 * @author Nikolai
 */
afStudio.layoutDesigner.view.TabViewPanel = Ext.extend(Ext.TabPanel, {
	
	constructor : function(config) {
		
		Ext.apply(config, {
			enableTabScroll: true,
			plugins: new afStudio.layoutDesigner.view.TabbedViewCloseMenuPlugin()
		});
		
		afStudio.layoutDesigner.view.TabViewPanel.superclass.constructor.call(this, config);
	}//eo constructor	
	
	,allTabsAreClosed : function() {
     	if (this.items.getCount() == 0) {
     		this.fireEvent('alltabswereclosed');
     	}		
	}//eo allTabsAreClosed
	
	//private
	,onRender : function(ct, position) {
		afStudio.layoutDesigner.view.TabViewPanel.superclass.onRender.call(this, ct, position);
		
		this.addEvents(
			/**
			 * @event 'alltabswereclosed' Fires after all tabs were <tt>closed</tt>
			 */
			'alltabswereclosed'
		);		
	}//eo onRender 
	
	// Ext 3.3.1
    // private
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
    
});