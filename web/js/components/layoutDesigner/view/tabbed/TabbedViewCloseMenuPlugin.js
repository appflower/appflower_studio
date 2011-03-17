Ext.namespace('afStudio.layoutDesigner.view');

/**
 * Adds specific functionality to afStudio.layoutDesigner.view.TabViewPanel
 * 
 * @class afStudio.layoutDesigner.view.TabbedViewCloseMenuPlugin
 * @extends Ext.ux.TabCloseMenu
 * @author Nikolai 
 */
afStudio.layoutDesigner.view.TabbedViewCloseMenuPlugin = Ext.extend(Ext.ux.TabCloseMenu, {
    
	allTabsAreClosed : function() {
     	if (this.tabs.items.getCount() == 0) {
     		this.tabs.fireEvent('alltabswereclosed');
     	}		
	}//eo allTabsAreClosed
	
    ,onClose : function() {
    	var _this = this,
    		 item = this.active,
			confirmTitle = 'Layout Designer,',
			confirmText;

		confirmText = 'Are you sure you want to delete tab view "' + item.viewMeta.attributes.title + '"';
			
		Ext.Msg.confirm(confirmTitle, confirmText, function(buttonId) {
			if (buttonId == 'yes') {
				
		     	if (item.fireEvent('beforeclose', item) !== false) {
					item.fireEvent('close', item);
		            _this.tabs.remove(item);
		            Ext.util.Functions.createDelegate(_this.allTabsAreClosed, _this)();
		        }
			}			
		});    	
    }//eo onClose
    
    ,onCloseOthers : function() {
    	var _this = this;
    	
		Ext.Msg.confirm('Layout Designer', 'Are you sure you want to delete tab views?', function(buttonId) {
			if (buttonId == 'yes') {    	
				_this.doClose(true);
			}
		});
    }//eo onCloseOthers 
    
    ,onCloseAll : function() {
    	var _this = this;
    	
		Ext.Msg.confirm('Layout Designer', 'Are you sure you want to delete tab views?', function(buttonId) {
			if (buttonId == 'yes') {
		    	_this.doClose(false);
			}
		});
    }//eo onCloseAll 
    
    ,doClose : function(excludeActive) {
        var items = [];
        this.tabs.items.each(function(item){
            if(item.closable){
                if(!excludeActive || item != this.active){
                    items.push(item);
                }    
            }
        }, this);
        
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