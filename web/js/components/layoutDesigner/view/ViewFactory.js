Ext.namespace('afStudio.layoutDesigner.view');

/**
 * View Factory
 * @singleton
 */
afStudio.layoutDesigner.view.ViewFactory = function() {
	
	return {
		
		/**
		 * @param {Object} meta The view meta/structure data
		 */
		buildView : function(meta) {			
			var view = [];
			
			if (Ext.isArray(meta['i:area'])) {
				for (var i = 0, len = meta['i:area'].length; i < len.length; i++) {
					view.push(this.createPage(meta['i:area'][i]));
				}
			} else {
				view.push(this.createPage(meta['i:area']));
			}
			
			return view;
		}//eo buildView
		
		/**
		 * Creates page view
		 */
		,createPage : function(vm) {
			var region, //depends on view type 
				  view;
			
			switch (vm.attributes.type) {
				case 'content':
					region = 'center';		
				break;				
				case 'sidebar':
					region = 'west';		
				break;				
				case 'footer':
					region = 'south';		
				break;
			}
			
			if (Ext.isDefined(vm['i:tab'])) {
				view = new afStudio.layoutDesigner.view.TabbedView({
					region : region,
					viewMeta : vm
				});
			} else {
				view = new afStudio.layoutDesigner.view.NormalView({
					region : region,
					viewMeta : vm
				});
			}
			
			return view; 
		}//eo createPage
		
		
	}//eo afStudio.layoutDesigner.view.ViewFactory
}();