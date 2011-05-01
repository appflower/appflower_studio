Ext.namespace('afStudio.wd');

/**
 * Graphical user interface (GUI) Factory.
 * 
 * @singleton
 * @author Nikolai
 */
afStudio.wd.GuiFactory = function() {
	
	return {
		
		/**
		 * @constant
		 */
		LIST : 'list'
		
		/**
		 * @constant
		 */
		,EDIT : 'edit'
		
		/**
		 * @constant
		 */
		,SHOW : 'show'
		
		/**
		 * @constant
		 */
		,HTML : 'html'
		
		/**
		 * Returns widget type
		 * @param {Object} meta The widget metadata or definition 
		 * @return {String} widget type
		 */
		,getWidgetType : function(meta) {
			return meta.definition ? meta.definition.type : meta.type;
		}//eo getWidgetType
		
		,isWidgetTypeValid : function(wType) {
			return [this.LIST, this.EDIT, this.SHOW, this.HTML].indexOf(wType) != -1 ? true : false;
		}//eo isWidgetTypeValid
		
		/**
		 * Factory method.
		 * 
		 * @param {Object} meta The view metadata
		 */
		,buildGui : function(meta) {
			var viewType = meta.definition.type,
				gui = {};
			
			switch (viewType) {
				case this.LIST:					
					gui.view = new afStudio.wd.list.SimpleListView({
						viewMeta: meta.definition
					});
					gui.controls = this.createListViewToolbar();
				break;
				
				case this.EDIT:
					gui.view = {
						xtype: 'container',
						html: 'EDIT view <br /> is under construction.'
					};
					gui.controls = this.createEditViewToolbar();
				break;
				
				case this.SHOW:
					gui.view = {
						xtype: 'container',
						html: 'SHOW view <br /> is under construction.'
					};
					gui.controls = this.createShowViewToolbar();
				break;
				
				case this.HTML:
					gui.view = {
						xtype: 'container',
						html: 'HTML view <br /> is under construction.'
					};
					gui.controls = this.createHtmlViewToolbar();
				break;
			}
									
			return gui;
		}//eo buildGui
		
		,createListViewToolbar : function() {
			return []; 
//TODO will be added in future release	
//			new Array(
//				{
//					text: 'Add Column',
//					itemId: 'addColumnBtn',
//					iconCls: 'icon-add'
//				},
//				'-'			
//			);
		}//eo createListViewToolbar
		
		,createEditViewToolbar : function() {
			return new Array(
				{
					text: 'Add Field', 
					iconCls: 'icon-add'
				},
				'-',
				{
					text: 'Format', 
					iconCls: 'icon-format',
					menu: {
						ignoreParentClicks: true,
						items: [
						{
							text: 'Columns',
							menu: {								
								items: [
			    				{
									xtype: 'combo', 
									triggerAction: 'all', 
									mode: 'local', 
									emptyText: 'Select an item...',
									store: [        
										[1, '1 columns'],
										[2, '2 columns'],
										[3, '3 columns'],
										[4, '4 columns']
									]
								}]
							}
						},{
							text: 'Re-size' 
						}]						
					}
				},
				'-'		
			);		
		}//eo createEditViewToolbar
		
		,createShowViewToolbar : function() {
			return [];		
		}//eo createShowViewToolbar
		
		,createHtmlViewToolbar : function() {
			return [];	
		}//eo createHtmlViewToolbar		
	};
}();