Ext.ns('Ext.ux');

Ext.ux.TabMenu = function(){
    var tabs, menu, tabItem, codepressItem;
    this.init = function(tp){
        tabs = tp;
        tabs.on('contextmenu', onContextMenu);
    }

    function onContextMenu(ts, item, e){
        if(!menu){ // create context menu on first right click
            menu = new Ext.menu.Menu([{
                id: tabs.id + '-save',
                text: 'Save',
                iconCls: 'icon-file-save',
                handler : function(){
                	//TODO: move to public function and it as "Save" button handler in CodeEditor Toolbar               	
                	Ext.Ajax.request({
			          url: codepressItem.fileContentUrl
			          , method:'post'
			          ,params: {
			          	'file':codepressItem.file,
			          	'code':codepressItem.getCode()			          	
			          }			
			          , success:function(response, options){			
			            Ext.Msg.alert("Success","The file was saved !");			            
			          }
      		          ,	failure: function() {
						Ext.Msg.alert("Failure","The server can't save the file !");
					  }			
			        });
                }
            },{
                id: tabs.id + '-close',
                text: 'Close Tab',
                iconCls: 'icon-file-close',
                handler : function(){
                    tabs.remove(tabItem);
                }
            },{
                id: tabs.id + '-close-others',
                text: 'Close Other Tabs',
                iconCls: 'icon-file-close-others',
                handler : function(){
                    tabs.items.each(function(item){
                        if(item.closable && item != tabItem){
                            tabs.remove(item);
                        }
                    });
                }
            }]);
        }
        tabItem = item;
        
        if(tabItem.items&&tabItem.items.items[0]&&tabItem.items.items[0].code)
        {
        	codepressItem = tabItem.items.items[0];
        }
        else
        {
        	codepressItem = tabItem;
        }
        
        var items = menu.items;
        items.get(tabs.id + '-close').setDisabled(!item.closable);
        var disableOthers = true;
        tabs.items.each(function(){
            if(this != item && this.closable){
                disableOthers = false;
                return false;
            }
        });
        
        if(item.itemId=='security'||item.itemId=='designer')
        {
        	items.get(tabs.id + '-save').setDisabled(true);
        }
        else{
        	items.get(tabs.id + '-save').setDisabled(false);
        }
        
        items.get(tabs.id + '-close-others').setDisabled(disableOthers);
        menu.showAt(e.getPoint());
    }
};