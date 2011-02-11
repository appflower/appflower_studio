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
				for (var i = 0, len = meta['i:area'].length; i < len; i++) {
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
			
			view = Ext.isDefined(vm['i:tab']) 
					? new afStudio.layoutDesigner.view.TabbedView(viewConfigObj)
					: view = new afStudio.layoutDesigner.view.NormalView(viewConfigObj);
			
			return view; 
		}//eo createPage
		
		
	}//eo afStudio.layoutDesigner.view.ViewFactory
}();