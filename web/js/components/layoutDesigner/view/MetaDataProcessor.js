Ext.namespace('afStudio.layoutDesigner.view');

/**
 * Mixin class
 * 
 * @singleton
 * @author Nikolai
 */
afStudio.layoutDesigner.view.MetaDataProcessor = function() {
	
	return {
		
		/**
		 * Checks if view metadata is <i>tabbed</i>
		 * @param {Object} view metadata
		 * @return {Boolean} true is layout is tabbed otherwise false
		 */		
		isViewTabbed : function(vm) {
			return Ext.isDefined(vm['i:tab']) ? true : false;
		}//eo isViewTabbed
		
		/**
		 * Returns <u>content</u> view's metadata and its position.
		 * 
		 * @param {Object} page metadata
		 * @return {Object} content view's coordinates
		 * {
		 *    contentView: "content" view metadata,
		 *    contentIdx: metadata position / undefined
		 * }
		 */
		,getContentViewMeta : function(pm) {
			var cm,   //view metadata
				cIdx; //view position inside page's views collaction
				
			if (Ext.isArray(pm['i:area'])) {
				Ext.each(pm['i:area'], function(v, i) {
					if (v.attributes.type == 'content') {					
						cm = v;
						cIdx = i;						
						return false;
					}
				});
			} else {
				cm = pm['i:area'];
			}
			
			return {
				contentView: cm, 
				contentIdx: cIdx
			};
		}//eo getContentViewMeta
		
		/**
		 * Switches (transforms page metadata) to specified <u>content</u> type (norma/tabbed).
		 * Returns new built page metadata according to specified page type.
		 * 
		 * @param {String} type The result page's metadata type normal or tabbed
		 * @param {Object} pm The page's metadata being transformed
		 */
		,changeContentViewMetaData : function(type, pm) {
			var vo = this.getContentViewMeta(pm),
				viewTabbed = this.isViewTabbed(vo.contentView),
				cmps = viewTabbed ? this.getTabbedViewComponents(vo.contentView['i:tab']) 
								  : this.getNormalViewComponents(vo.contentView['i:component']);
								  
			var meta = {};
			
			if (type == 'tabbed') {
				var tabAttr = Ext.apply({title: pm['i:title']}, vo.contentView.attributes);				
				delete tabAttr.type;
				meta = {
					'attributes': vo.contentView.attributes,
					'i:tab': {
						'attributes': tabAttr,
						'i:component': Ext.flatten(cmps)
					}
				}
			} else {
				var viewAttr = Ext.apply({}, vo.contentView.attributes);				
				viewAttr.layout = (viewAttr.layout > cmps.maxLayout) 
								? viewAttr.layout : cmps.maxLayout;				
				meta = {
					'attributes': viewAttr,
					'i:component': Ext.flatten(cmps.components)
				}
			}
			
			if (!Ext.isEmpty(vo.contentIdx)) {
				pm['i:area'][vo.contentIdx] = meta;	
			} else {
				pm['i:area'] = meta;
			}
			
			return pm;				
		}//eo
		
		/**
		 * Returns <u>tabbed</u> view components and max layout
		 * @return {Object} components and maxLayout
		 */
		,getTabbedViewComponents : function(tm) {			
			var cmps,
				maxLayout;
				
			if (Ext.isDefined(tm)) {
				cmps = [];
				
				if (Ext.isArray(tm)) {
					Ext.each(tm, function(t, i) {
						if (t['i:component']) {
							maxLayout = t.attributes.layout;						
							cmps.push(this.getNormalViewComponents(t['i:component']));
						}		
					}, this);		
				} else {
					if (tm['i:component']) {
						maxLayout = tm.attributes.layout;
						cmps.push(this.getNormalViewComponents(tm['i:component']));
					}
				}				
			}
			
			return {components: cmps, maxLayout: maxLayout};
		}//eo getTabbedViewComponents
		
		/**
		 * Returns <u>normal</u> view components
		 * @return {Object} components 
		 */
		,getNormalViewComponents : function(cm) {
			var cmps;
			
			if (Ext.isDefined(cm)) {
				cmps = [];
				if (Ext.isArray(cm)) {
					Ext.each(cm, function(c, i) {
						cmps.push(c);
					});
				} else {
					cmps.push(cm);
				}
			}
			
			return cmps;
		}//eo getNormalViewComponents
		
		
	}//eo afStudio.layoutDesigner.view.MetaDataProcessor
}();