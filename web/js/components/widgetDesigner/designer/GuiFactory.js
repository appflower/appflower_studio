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
		 * 
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
						viewMeta: meta.definition,
						widgetUri: meta.widgetUri
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
			
//			var gui = [];
									
			return view;
		}//eo buildLayout		
		
		/**
		 * Creates page view <b>i:area</b>.
		 * 
		 * @param {Object} vm The view's metadata.
		 * @param {Number} mPos The view's metadata position inside page metadata.
		 */
		,createView : function(vm, mPos) {			
			var region, //depends on view type
				viewConfigObj,
				view;
				
			switch (vm.attributes.type) {
				case 'content':
					viewConfigObj = {
						viewMetaPosition: mPos,
						region: 'center'
					}					
				break;
				
				case 'sidebar':
					viewConfigObj = {
						viewMetaPosition : mPos,
						region: 'west',
						split: true,
						collapseMode: 'mini',
						width: vm.attributes.width ? vm.attributes.width : 200
					}
				break;
				
				case 'footer':
					viewConfigObj = {
						viewMetaPosition : mPos,
						region: 'south',
						split: true,
						collapseMode: 'mini',
						height: 130
					}
				break;
			}
			
			viewConfigObj.viewMeta = vm;
			
			view = afStudio.layoutDesigner.view.MetaDataProcessor.isViewTabbed(vm) 
			           ? new afStudio.layoutDesigner.view.TabbedView(viewConfigObj)
					   : new afStudio.layoutDesigner.view.NormalView(viewConfigObj);
			
			return view; 
		}//eo createView
		
	}//eo afStudio.layoutDesigner.view.ViewFactory
}();