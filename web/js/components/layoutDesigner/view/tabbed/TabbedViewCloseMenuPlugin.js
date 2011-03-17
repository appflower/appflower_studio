Ext.namespace('afStudio.layoutDesigner.view');

/**
 * Adds specific functionality to afStudio.layoutDesigner.view.TabViewPanel
 * 
 * @class afStudio.layoutDesigner.view.TabbedViewCloseMenuPlugin
 * @extends Ext.ux.TabCloseMenu
 * @author Nikolai
 */
afStudio.layoutDesigner.view.TabbedViewCloseMenuPlugin = Ext.extend(Ext.ux.TabCloseMenu, {
    
	/**
	 * Checks if TabPanel has no tabs, and if it is true fires <tt>alltabswereclosed</tt> event
	 */
	allTabsAreClosed : function() {
     	if (this.tabs.items.getCount() == 0) {
     		this.tabs.fireEvent('alltabswereclosed');
     	}		
	}//eo allTabsAreClosed	
	
	/**
	 * Close tab(s) confirmation.
	 * 
	 * @param {String} confirmText The confirm text
	 * @param {Function} callback The action function executes if confirmation was approved
	 */
	,confirmTabClosingDialog : function(confirmText, callback) {
		var _this = this;
		
		Ext.Msg.confirm('Layout Designer', confirmText, function(buttonId) {
			if (buttonId == 'yes') {
	     		callback();
			}
		});		
	}//eo confirmTabClosingDialog
	
	/**
	 * Collects tabs to be closed & their meta-titles.
	 * 
	 * @param {Boolean} excludeActive The exclude key, if it is true active tab is not being closed
	 * @return {Object} {tabs: 'tabs array', meta: 'titles array'}
	 */
	,pickTabsToClose : function(excludeActive) {
		var _this = this;
		
        var items = [];
        var meta = [];
        this.tabs.items.each(function(item){
            if(item.closable){
                if(!excludeActive || item != this.active){
                    items.push(item);
                    meta.push(item.viewMeta.attributes.title);
                }    
            }
        }, this);
		
        return {
        	tabs: items,
        	meta: meta
        }
	}//eo pickTabsToClose
	
	/**
	 * "close" menu item's <u>click</u> event listener
	 */
    ,onClose : function() {
    	var _this = this,
    		activeItem = this.active,
			confirmText;

		confirmText = 'Are you sure you want to delete tab view "' + activeItem.viewMeta.attributes.title + '"';
		
		function doCloseAction() {
			var item = this.active;		
			if (item.fireEvent('beforeclose', item) !== false) {				
				item.fireEvent('close', item);
	            this.tabs.remove(item);
	            this.allTabsAreClosed();
			}
		}
		
		this.confirmTabClosingDialog(confirmText, 
			Ext.util.Functions.createDelegate(doCloseAction, _this)
		);		
    }//eo onClose
    
    /**
     * "closeothers" menu item's <u>click</u> event listener
     */
    ,onCloseOthers : function() {
		var _this = this,
			confirmText;
		
		var tabsObj = this.pickTabsToClose(true);
		
		confirmText = 'Are you sure you want to delete tab views? <br />' + tabsObj.meta.join(', ');
		
		function doCloseAction(tabs) {
			this.doClose(tabs);
		}
		
		this.confirmTabClosingDialog(confirmText, 
			Ext.util.Functions.createDelegate(doCloseAction, _this, [tabsObj.tabs])
		);
    }//eo onCloseOthers 
    
    /**
     * "closeall" menu item's <u>click</u> event listener
     */
    ,onCloseAll : function() {
		var _this = this,
			confirmText;
			
		var tabsObj = this.pickTabsToClose(false);
		
		confirmText = 'Are you sure you want to delete all tab views and their components?';
		
		function doCloseAction(tabs) {
			this.doClose(tabs);
		}
		
		this.confirmTabClosingDialog(confirmText, 
			Ext.util.Functions.createDelegate(doCloseAction, _this, [tabsObj.tabs])
		);
    }//eo onCloseAll 
    
    /**
     * Closes several tabs
     * @param {Array} items The tabs being closed 
     */
    ,doClose : function(items) {    	
        var activeTab = this.active;
     	if (activeTab.fireEvent('beforeclose', activeTab, true, items) !== false) {
	        Ext.each(items, function(item) {
	        	item.fireEvent('close', item);
	            this.tabs.remove(item);
	        }, this);
     	}
     	
     	this.allTabsAreClosed();
    }//eo doClose
});

/**
 * plugin registration afStudio.layoutDesigner.view.tabbedViewCloseMenuPlugin
 */
Ext.preg('afStudio.layoutDesigner.view.tabbedViewCloseMenuPlugin', afStudio.layoutDesigner.view.TabbedViewCloseMenuPlugin);