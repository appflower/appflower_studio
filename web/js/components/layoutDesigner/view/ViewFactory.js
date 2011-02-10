Ext.namespace('afStudio.layoutDesigner.view');

/**
 * View Factory
 * @singleton
 */
afStudio.layoutDesigner.view.ViewFactory = function() {
	
	x = 'builder';
	
	return {
		
		/**
		 * @param {Object} meta The view meta/structure data
		 */
		buildView : function(meta) {			
			var view = [];
			
			if (Ext.isArray(meta['i:area'])) {
				for (var i = 0, len = meta['i:area'].length; i < len.length; i++) {
					view.push(this.createViewComponent(meta['i:area'][i]));
				}
			} else {
				view.push(this.createViewComponent(meta['i:area']));
			}
			
			return view;
		}//eo buildView
		
		,createViewComponent : function(vm) {
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
				
			} else {
				view = new afStudio.layoutDesigner.view.NormalView({
					region : region,
					viewLayout : vm.attributes.layout
				});
			}
			
			return view; 
		}//eo createViewComponent
		
	}
	
}();