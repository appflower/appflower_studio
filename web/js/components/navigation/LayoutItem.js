/**
 * LayoutItem 
 * 
 * @class afStudio.navigation.LayoutItem
 * @extends afStudio.navigation.BaseItemTreePanel
 * @author Nikolai
 */
afStudio.navigation.LayoutItem = Ext.extend(afStudio.navigation.BaseItemTreePanel, {
	
	/**
	 * @cfg {String} baseUrl (defaults to '/appFlowerStudio/layout')
	 */
	baseUrl : '/appFlowerStudio/layout'

	/**
	 * @property {Ext.menu.Menu} appContextMenu
	 * "Application" node type context menu  
	 */
	,appContextMenu : new Ext.menu.Menu({
        items: [
        {
            itemId: 'app-add-page',
            text: 'Add Page',
            iconCls: 'icon-models-add'
		}],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode;
            }
        }
	})//eo appContextMenu
	
	
	/**
	 * @property {Ext.menu.Menu} pageContextMenu
	 * "Page" node type context menu
	 */
	,pageContextMenu : new Ext.menu.Menu({
        items: [
        {
            itemId: 'edit-page',
            text: 'Edit Page',
            iconCls: 'icon-models-edit'
		},{
            itemId: 'rename-page',
            text: 'Rename Page',
            iconCls: 'icon-edit'
		},{
       		itemId: 'delete-page',
            text: 'Delete Page',
            iconCls: 'icon-models-delete'
        }],
        listeners: {
            itemclick: function(item) {
            	var node = item.parentMenu.contextNode;
                switch (item.itemId) {
                    case 'delete-model':
                	break;
                	
                    case 'edit-model':
                    break;
                    
                    case 'rename-model':
                    break;	                        
                }
            }
        }
	})//eo contextMenu	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {		
		var treeLoader = new Ext.tree.TreeLoader({
			url: this.baseUrl,
			baseParams: {
				cmd: 'getList'
			}
		});		
		
		return {			
			title: 'Layout',
		    loader: treeLoader,
			iconCls: 'icon-layout_content',
			bbar: {
				items: [
				'->',
				{
					text: 'Add Page',
					iconCls: 'icon-pages-add'
				}]
			}
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
		afStudio.navigation.LayoutItem.superclass.initComponent.apply(this, arguments);
	}//eo initComponent	
	
	/**
	 * Fires when a node is double clicked
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e
	 */
	,onNodeDblClick : function(node, e) {			
        if (this.getNodeAttribute(node, 'type') == 'page') {
        	afStudio.vp.addToPortal(new afStudio.layoutDesigner.DesignerPanel(), true);
        }				
	}//eo onNodeDblClick
	
	/**
	 * Fires when a node is right clicked.
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e
	 */
	,onNodeContextMenu : function(node, e) {		
		var _this = this;
		
        node.select();
        
        switch (node.attributes.type) {
        	case 'app' :
        		_this.appContextMenu.contextNode = node;
		        _this.appContextMenu.showAt(e.getXY());
        	break;        	
        	case 'page' :
        		_this.pageContextMenu.contextNode = node;
		        _this.pageContextMenu.showAt(e.getXY());
        	break;
        }
	}//eo onItemContextMenu
	
});

/**
 * @type 'afStudio.navigation.layoutItem'
 */
Ext.reg('afStudio.navigation.layoutItem', afStudio.navigation.LayoutItem);