Ext.namespace('afStudio.layoutDesigner.view');

/**
 * View Factory.
 * 
 * @singleton
 * @author Nikolai
 */
afStudio.layoutDesigner.view.ViewFactory = function() {
	
	return {
		
		/**
		 * Factory method
		 * 
		 * @param {Object} meta The view meta/structure data
		 */
		buildLayout : function(meta) {
			var view = [];
			
			if (Ext.isArray(meta['i:area'])) {
				
				Ext.each(meta['i:area'], function(vm, idx, all) {
					view.push(this.createView(vm, idx));
				}, this);
				
			} else {
				view.push(this.createView(meta['i:area'], 0));
			}
			
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