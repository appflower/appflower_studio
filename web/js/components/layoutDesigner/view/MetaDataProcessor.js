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
		 * Returns <u>content</u> view's metadata and its position
		 * @param {Object} page metadata
		 * @return {Object} content view's coordinates
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
		 * 
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
				viewAttr.layout = cmps.maxLayout || viewAttr.layout;				
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
		
		,getTabbedViewComponents : function(tm) {			
			var cmps = [],
				maxLayout;
			
			if (Ext.isArray(tm)) {
				Ext.each(tm, function(t, i) {
					maxLayout = t.attributes.layout;
					cmps.push(this.getNormalViewComponents(t['i:component']));
				}, this);		
			} else {
				maxLayout = tm.attributes.layout;
				cmps.push(this.getNormalViewComponents(tm['i:component']));
			}
			
			return {components: cmps, maxLayout: maxLayout};
		}//eo getTabbedViewComponents
		
		,getNormalViewComponents : function(cm) {
			var cmps = [];			
			if (Ext.isArray(cm)) {
				Ext.each(cm, function(c, i) {
					cmps.push(c);
				});
			} else {
				cmps.push(cm);
			}
			
			return cmps;
		}//eo getNormalViewComponents 
		
		
	}//eo afStudio.layoutDesigner.view.MetaDataProcessor
}();