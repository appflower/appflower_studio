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
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
//		console.log('layout before');
		
		return {			
			title: 'Layout',
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
//		console.log('layout init', this);
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.navigation.LayoutItem.superclass.initComponent.apply(this, arguments);
//		console.log('layout init', this);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
//		console.log('layout after', this);
		var _this = this;		
		
		this.on({
			dblclick : function(node, e) {
	            var page = node.attributes.page || 1;
				afStudio.vp.addToPortal({
					title: 'Layout Designer',
					collapsible: false, 

					//DO NOT REMOVE
					layout: 'fit',
					
					draggable: false,
					items: [{
						xtype: 'afStudio.layoutDesigner.designerPanel', 
						page: page
					}]
				}, true);
	        }
		});
	}//eo _afterInitComponent	
	
});

/**
 * @type 'afStudio.navigation.layoutItem'
 */
Ext.reg('afStudio.navigation.layoutItem', afStudio.navigation.LayoutItem);