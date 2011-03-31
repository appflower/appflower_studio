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
		 * @property viewLayoutConfig 
		 * Read only.
		 * Main view's layout types.
		 * For more details {@see http://www.appflower.com/docs/index.html#page-layouts}
		 * @type {Object}
		 */
		viewLayoutConfig : {
			1 : [1],
			2 : [0.5, 0.5],
			3 : [0.25, 0.75],
			4 : [0.75, 0.25],
			5 : [0.33, 0.33, 0.33],
			6 : [0.5, 0.25, 0.25],
			7 : [0.25, 0.5, 0.25],
			8 : [0.25, 0.25, 0.25, 0.25],
			9 : [0.4, 0.2, 0.2, 0.2]
		}//eo viewLayoutConfig
		
		/**
		 * Returns layout config for specific layout type.
		 * 
		 * @param {Number} layoutType The layout type.
		 * @return {Array} layout columns config 
		 */
		,getLayoutCfg : function(layoutType) {
			return this.viewLayoutConfig[layoutType];
		}//eo getLayoutCfg 
		
		/**
		 * Returns real columns number for specified layout type.
		 * 
		 * @param {Number} layoutType The layout type.
		 * @return {Number} columns number
		 */
		,getLayoutColumnsNumber : function(layoutType) {
			return this.getLayoutCfg(layoutType).length;
		}//eo getLayoutColumnsNumber
		
		/**
		 * Returns max <b>column</b> metadata attribute for specific layout type.
		 * 
		 * @param {Number} layoutType The layout type.
		 * @return {Number} column max number
		 */
		,getLayoutColumnMaxValue : function(layoutType) {
			return this.getLayoutColumnsNumber(layoutType) - 1; 
		}//eo getLayoutColumnMaxValue
		
		/**
		 * Factory method
		 * 
		 * @param {Object} meta The view meta/structure data
		 */
		,buildLayout : function(meta) {
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