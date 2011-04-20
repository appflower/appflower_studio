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
		}
		
		/**
		 * Factory method.
		 * 
		 * @param {Object} meta The view metadata
		 */
		,buildGui : function(meta) {
			var viewType = meta.definition.type,
				view;
			
			switch (viewType) {
				case this.LIST:					
					view = new afStudio.wd.list.SimpleListView({
						viewMeta: meta.definition
					});
				break;
				
				case this.EDIT:
					view = {
						xtype: 'container',
						html: 'EDIT view <br /> is under construction.'
					};
				break;
				
				case this.SHOW:
					view = {
						xtype: 'container',
						html: 'SHOW view <br /> is under construction.'
					};				
				break;
				
				case this.HTML:
					view = {
						xtype: 'container',
						html: 'HTML view <br /> is under construction.'
					};				
				break;
			}
									
			return view;
		}//eo buildGui
		
	};
}();