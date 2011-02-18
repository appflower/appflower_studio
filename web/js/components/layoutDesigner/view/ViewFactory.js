Ext.namespace('afStudio.layoutDesigner.view');

/**
 * View Factory
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
				for (var i = 0, len = meta['i:area'].length; i < len; i++) {
					view.push(this.createView(meta['i:area'][i]));
				}
			} else {
				view.push(this.createView(meta['i:area']));
			}
			
			return view;
		}//eo buildLayout		
		
		/**
		 * Creates page view
		 */
		,createView : function(vm) {
			var region, //depends on view type
				viewConfigObj = {},
				view;
			
			switch (vm.attributes.type) {
				case 'content':
					viewConfigObj.region = 'center';
				break;
				
				case 'sidebar':
					viewConfigObj = {
						region: 'west',
						split: true,
						collapseMode: 'mini',
						width: vm.attributes.width ? vm.attributes.width : 200
					}
				break;
				
				case 'footer':
					viewConfigObj = {
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